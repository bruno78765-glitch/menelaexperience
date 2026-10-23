import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { EXAMPLE_INPUT } from '../src/lib/pricing.ts';
import { createApp } from './http.ts';

type CallResult = {
  status: number;
  json: Record<string, unknown> | null;
  setCookies: string[];
};

function start(server: Server): Promise<number> {
  server.listen(0, '127.0.0.1');
  return once(server, 'listening').then(() => (server.address() as AddressInfo).port);
}

async function stop(server: Server): Promise<void> {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function client(port: number) {
  let cookie = '';
  return {
    cookie: () => cookie,
    async call(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<CallResult> {
      const response = await fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
          ...(cookie ? { cookie } : {}),
          ...extraHeaders,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      const setCookies = response.headers.getSetCookie();
      for (const item of setCookies) {
        const [pair] = item.split(';');
        if (!pair?.startsWith('essence_session=')) continue;
        const value = pair.slice('essence_session='.length);
        cookie = value ? `essence_session=${value}` : '';
      }
      const text = await response.text();
      return {
        status: response.status,
        json: text ? (JSON.parse(text) as Record<string, unknown>) : null,
        setCookies,
      };
    },
  };
}

async function withApp(fn: (port: number) => Promise<void>): Promise<void> {
  const dir = mkdtempSync(join(tmpdir(), 'calculadora-'));
  const server = createApp({
    databasePath: join(dir, 'test.db'),
    bcryptRounds: 4,
    serveStatic: false,
  });
  const port = await start(server);
  try {
    await fn(port);
  } finally {
    await stop(server);
    rmSync(dir, { recursive: true, force: true });
  }
}

test('cadastro grava senha com hash e sessão httpOnly', async () => {
  await withApp(async (port) => {
    const ana = client(port);
    const created = await ana.call('POST', '/api/register', {
      name: 'Ana Lima',
      email: 'Ana@Example.com',
      password: 'senha-ana-123',
    });
    assert.equal(created.status, 201);
    const user = created.json?.user as { email: string; name: string };
    assert.equal(user.email, 'ana@example.com');
    const duplicate = await ana.call('POST', '/api/register', {
      name: 'Ana Lima',
      email: 'ana@example.com',
      password: 'senha-ana-123',
    });
    assert.equal(duplicate.status, 409);
    assert.equal(JSON.stringify(created.json).includes('senha-ana-123'), false);
    assert.equal(JSON.stringify(created.json).includes('password'), false);
    assert.match(created.setCookies[0] || '', /HttpOnly/i);
    assert.match(created.setCookies[0] || '', /SameSite=Lax/i);
    assert.doesNotMatch(created.setCookies[0] || '', /Secure/i);

    const secure = await client(port).call(
      'POST',
      '/api/login',
      { email: 'ana@example.com', password: 'senha-ana-123' },
      { 'x-forwarded-proto': 'https' },
    );
    assert.match(secure.setCookies[0] || '', /Secure/i);

    const wrong = await ana.call('POST', '/api/login', {
      email: 'ana@example.com',
      password: 'senha-errada',
    });
    assert.equal(wrong.status, 401);
  });
});

test('uma pessoa não vê nem apaga o cenário da outra', async () => {
  await withApp(async (port) => {
    const ana = client(port);
    await ana.call('POST', '/api/register', {
      name: 'Ana Lima',
      email: 'ana@example.com',
      password: 'senha-ana-123',
    });
    const saved = await ana.call('POST', '/api/scenarios', {
      nomeProcedimento: 'Limpeza de pele',
      inputs: EXAMPLE_INPUT,
    });
    assert.equal(saved.status, 201);
    const scenario = saved.json?.scenario as { id: number; precoSugerido: number };
    assert.equal(scenario.precoSugerido, 118.06);

    const bia = client(port);
    await bia.call('POST', '/api/register', {
      name: 'Bia Souza',
      email: 'bia@example.com',
      password: 'senha-bia-123',
    });
    const biaList = await bia.call('GET', '/api/scenarios');
    assert.equal(biaList.status, 200);
    assert.deepEqual(biaList.json?.scenarios, []);

    const blocked = await bia.call('DELETE', `/api/scenarios/${scenario.id}`);
    assert.equal(blocked.status, 404);

    const anaList = await ana.call('GET', '/api/scenarios');
    const scenarios = anaList.json?.scenarios as { nomeProcedimento: string }[];
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0]?.nomeProcedimento, 'Limpeza de pele');

    const guest = client(port);
    const hidden = await guest.call('GET', '/api/scenarios');
    assert.equal(hidden.status, 401);
  });
});

test('não salva cenário com horas zeradas ou fórmula inviável', async () => {
  await withApp(async (port) => {
    const ana = client(port);
    await ana.call('POST', '/api/register', {
      name: 'Ana Lima',
      email: 'ana@example.com',
      password: 'senha-ana-123',
    });
    const zeroHours = await ana.call('POST', '/api/scenarios', {
      nomeProcedimento: 'Horas zeradas',
      inputs: { ...EXAMPLE_INPUT, horasProdutivas: 0 },
    });
    assert.equal(zeroHours.status, 400);
    const impossible = await ana.call('POST', '/api/scenarios', {
      nomeProcedimento: 'Margem impossível',
      inputs: { ...EXAMPLE_INPUT, taxasVariaveis: 80, margemLucro: 20 },
    });
    assert.equal(impossible.status, 400);
    const list = await ana.call('GET', '/api/scenarios');
    assert.deepEqual(list.json?.scenarios, []);
  });
});
