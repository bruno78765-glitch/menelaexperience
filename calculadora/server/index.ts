import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './http.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8787);
const databasePath = process.env.DATABASE_PATH || join(root, 'data', 'app.db');
const staticDir = join(root, 'dist');
const serveStatic =
  process.argv.includes('--with-static') ||
  process.env.SERVE_STATIC === '1' ||
  process.env.NODE_ENV === 'production';
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT inválida.');
  process.exit(1);
}

if (serveStatic && !existsSync(join(staticDir, 'index.html'))) {
  console.error('Pasta dist não encontrada. Rode npm run build antes de npm start.');
  process.exit(1);
}

const server = createApp({
  databasePath,
  bcryptRounds: Number.isInteger(bcryptRounds) && bcryptRounds >= 4 ? bcryptRounds : 12,
  staticDir,
  serveStatic,
});

server.listen(port, () => {
  const mode = serveStatic ? 'site + API' : 'somente API';
  console.log(`Calculadora de Precificação (${mode}) em http://localhost:${port}`);
});
