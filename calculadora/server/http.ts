import { createHash, randomBytes } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import bcrypt from 'bcryptjs';
import { openDatabase, type AppDatabase } from './db.ts';
import {
  calculatePricing,
  isCompletePricingInput,
  type CompletePricingInput,
} from '../src/lib/pricing.ts';
import type { PublicUser } from '../src/lib/types.ts';

const COOKIE = 'essence_session';
const SESSION_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_SCENARIOS = 200;
const MAX_BODY = 64 * 1024;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

export type AppOptions = {
  databasePath: string;
  bcryptRounds?: number;
  staticDir?: string;
  serveStatic?: boolean;
};

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function stripControls(value: string): string {
  let cleaned = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code >= 32 && code !== 127) cleaned += char;
  }
  return cleaned;
}

function cleanName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = stripControls(value).trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80) return null;
  return name;
}

function cleanEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function cleanPassword(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length < 8 || value.length > 72) return null;
  return value;
}

function cleanProcedureName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = stripControls(value).trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > 120) return null;
  return name;
}

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (!key) continue;
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}

function requestIsSecure(req: IncomingMessage): boolean {
  const forwarded = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return proto?.split(',')[0]?.trim() === 'https';
}

function sessionCookie(token: string, secure: boolean, maxAge: number): string {
  const parts = [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

function send(res: ServerResponse, status: number, body: unknown, extra?: Record<string, string>): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  });
  res.end(payload);
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
    size += buffer.length;
    if (size > MAX_BODY) {
      const error = new Error('payload');
      error.name = 'PayloadTooLarge';
      throw error;
    }
    chunks.push(buffer);
  }
  if (size === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
}

function currentUser(req: IncomingMessage, db: AppDatabase): PublicUser | undefined {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token) return undefined;
  return db.userForSession(sha256(token), new Date().toISOString());
}

function requireJson(req: IncomingMessage, res: ServerResponse): boolean {
  const type = req.headers['content-type'];
  if (!type || !type.includes('application/json')) {
    send(res, 415, { error: 'Envie os dados em JSON.' });
    return false;
  }
  return true;
}

async function hashPassword(password: string, rounds: number): Promise<string> {
  return bcrypt.hash(password, rounds);
}

async function passwordsMatch(password: string, hash: string, dummy: string): Promise<boolean> {
  const ok = await bcrypt.compare(password, hash || dummy);
  return hash.length > 0 && ok;
}

function cents(value: number): number {
  return Math.round(value * 100);
}

function resolveStatic(staticDir: string, pathname: string): string | null {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const relative = decoded.replace(/^\/+/, '');
  const root = normalize(staticDir);
  const full = normalize(join(root, relative));
  if (full !== root && !full.startsWith(root + sep)) return null;
  return full;
}

function serveFile(req: IncomingMessage, res: ServerResponse, staticDir: string): void {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  const resolved = resolveStatic(staticDir, url.pathname);
  let filePath = resolved;
  if (filePath && existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }
  const exists = filePath ? existsSync(filePath) && statSync(filePath).isFile() : false;
  const finalPath = exists && filePath ? filePath : join(staticDir, 'index.html');
  if (!existsSync(finalPath)) {
    send(res, 404, { error: 'Arquivo não encontrado.' });
    return;
  }
  const extension = extname(finalPath);
  const immutable = url.pathname.startsWith('/assets/');
  res.writeHead(200, {
    'Content-Type': MIME[extension] || 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(finalPath).pipe(res);
}

export function createApp(options: AppOptions): Server {
  const db = openDatabase(options.databasePath);
  const rounds = options.bcryptRounds ?? 12;
  let dummyHash = '';
  const dummyReady = hashPassword('senha-dummy-nao-usar', rounds).then((hash) => {
    dummyHash = hash;
  });

  db.deleteExpiredSessions(new Date().toISOString());

  const server = createServer(async (req, res) => {
    try {
      await dummyReady;
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      const path = url.pathname;
      const method = req.method || 'GET';

      if (path === '/api/health' && method === 'GET') {
        send(res, 200, { ok: true });
        return;
      }

      if (path === '/api/me' && method === 'GET') {
        send(res, 200, { user: currentUser(req, db) ?? null });
        return;
      }

      if (path === '/api/register' && method === 'POST') {
        if (!requireJson(req, res)) return;
        const body = (await readJson(req)) as Record<string, unknown>;
        const name = cleanName(body.name);
        const email = cleanEmail(body.email);
        const password = cleanPassword(body.password);
        if (!name || !email || !password) {
          send(res, 400, {
            error: 'Use um nome, um e-mail válido e uma senha de 8 a 72 caracteres.',
          });
          return;
        }
        const passwordHash = await hashPassword(password, rounds);
        try {
          const user = db.transaction(() => {
            const created = db.createUser({ email, name, passwordHash });
            const token = randomBytes(32).toString('base64url');
            const expires = new Date(Date.now() + SESSION_MS).toISOString();
            db.createSession(created.id, sha256(token), expires);
            return { created, token };
          });
          send(res, 201, { user: user.created }, {
            'Set-Cookie': sessionCookie(user.token, requestIsSecure(req), SESSION_MS / 1000),
          });
        } catch (error) {
          if (error instanceof Error && error.message.includes('UNIQUE')) {
            send(res, 409, { error: 'Já existe uma conta com este e-mail.' });
            return;
          }
          throw error;
        }
        return;
      }

      if (path === '/api/login' && method === 'POST') {
        if (!requireJson(req, res)) return;
        const body = (await readJson(req)) as Record<string, unknown>;
        const email = cleanEmail(body.email);
        const password = typeof body.password === 'string' ? body.password : '';
        const user = email ? db.findUserByEmail(email) : undefined;
        const matches = await passwordsMatch(password, user?.passwordHash ?? '', dummyHash);
        if (!email || !user || !matches) {
          send(res, 401, { error: 'E-mail ou senha incorretos.' });
          return;
        }
        const token = randomBytes(32).toString('base64url');
        db.createSession(user.id, sha256(token), new Date(Date.now() + SESSION_MS).toISOString());
        send(res, 200, { user: { id: user.id, email: user.email, name: user.name } }, {
          'Set-Cookie': sessionCookie(token, requestIsSecure(req), SESSION_MS / 1000),
        });
        return;
      }

      if (path === '/api/logout' && method === 'POST') {
        const token = parseCookies(req.headers.cookie)[COOKIE];
        if (token) db.deleteSession(sha256(token));
        send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', requestIsSecure(req), 0) });
        return;
      }

      if (path === '/api/scenarios' && method === 'GET') {
        const user = currentUser(req, db);
        if (!user) {
          send(res, 401, { error: 'Entre na sua conta para ver os cenários.' });
          return;
        }
        send(res, 200, { scenarios: db.listScenarios(user.id) });
        return;
      }

      if (path === '/api/scenarios' && method === 'POST') {
        const user = currentUser(req, db);
        if (!user) {
          send(res, 401, { error: 'Entre na sua conta para salvar um cenário.' });
          return;
        }
        if (!requireJson(req, res)) return;
        const body = (await readJson(req)) as Record<string, unknown>;
        const nomeProcedimento = cleanProcedureName(body.nomeProcedimento);
        if (!nomeProcedimento || !isCompletePricingInput(body.inputs)) {
          send(res, 400, { error: 'Informe o nome do procedimento e números válidos.' });
          return;
        }
        const inputs: CompletePricingInput = body.inputs;
        const pricing = calculatePricing(inputs);
        if (!pricing.ok) {
          send(res, 400, { error: pricing.errors[0]?.message ?? 'Este cenário não pode ser salvo.' });
          return;
        }
        if (db.countScenarios(user.id) >= MAX_SCENARIOS) {
          send(res, 400, { error: 'Você chegou ao limite de 200 cenários. Exclua algum para salvar outro.' });
          return;
        }
        const scenario = db.insertScenario({
          userId: user.id,
          nomeProcedimento,
          inputs,
          precoSugeridoCents: cents(pricing.precoSugerido),
          custoTotalCents: cents(pricing.custoTotalAtendimento),
          createdAt: new Date().toISOString(),
        });
        send(res, 201, { scenario });
        return;
      }

      const scenarioMatch = path.match(/^\/api\/scenarios\/(\d+)$/);
      if (scenarioMatch && method === 'DELETE') {
        const user = currentUser(req, db);
        if (!user) {
          send(res, 401, { error: 'Entre na sua conta para excluir um cenário.' });
          return;
        }
        const id = Number(scenarioMatch[1]);
        const removed = db.deleteScenario(user.id, id);
        if (!removed) {
          send(res, 404, { error: 'Cenário não encontrado.' });
          return;
        }
        send(res, 200, { ok: true });
        return;
      }

      if (path.startsWith('/api/')) {
        send(res, 404, { error: 'Rota não encontrada.' });
        return;
      }

      if (options.serveStatic && options.staticDir) {
        if (method !== 'GET' && method !== 'HEAD') {
          send(res, 405, { error: 'Método não permitido.' });
          return;
        }
        serveFile(req, res, options.staticDir);
        return;
      }

      send(res, 404, { error: 'Rota não encontrada.' });
    } catch (error) {
      if (error instanceof Error && error.name === 'PayloadTooLarge') {
        send(res, 413, { error: 'Os dados enviados são grandes demais.' });
        return;
      }
      if (error instanceof SyntaxError) {
        send(res, 400, { error: 'O JSON enviado é inválido.' });
        return;
      }
      console.error('erro na API', req.method, req.url);
      send(res, 500, { error: 'Não foi possível concluir a operação.' });
    }
  });

  server.on('close', () => db.close());
  return server;
}
