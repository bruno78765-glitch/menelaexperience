import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { dirname } from 'node:path';
import type { CompletePricingInput } from '../src/lib/pricing.ts';
import type { PublicUser, ScenarioDTO } from '../src/lib/types.ts';

export type StoredUser = PublicUser & { passwordHash: string };

type UserRow = {
  id: number;
  email: string;
  name: string;
  password_hash: string;
};

type ScenarioRow = {
  id: number;
  nome_procedimento: string;
  inputs_json: string;
  created_at: string;
  preco_sugerido_cents: number;
  custo_total_cents: number;
};

export type AppDatabase = {
  createUser(input: { email: string; name: string; passwordHash: string }): PublicUser;
  findUserByEmail(email: string): StoredUser | undefined;
  createSession(userId: number, tokenHash: string, expiresAt: string): void;
  deleteSession(tokenHash: string): void;
  deleteExpiredSessions(nowIso: string): void;
  userForSession(tokenHash: string, nowIso: string): PublicUser | undefined;
  countScenarios(userId: number): number;
  listScenarios(userId: number): ScenarioDTO[];
  insertScenario(input: {
    userId: number;
    nomeProcedimento: string;
    inputs: CompletePricingInput;
    precoSugeridoCents: number;
    custoTotalCents: number;
    createdAt: string;
  }): ScenarioDTO;
  deleteScenario(userId: number, id: number): boolean;
  transaction<T>(fn: () => T): T;
  close(): void;
};

function reais(cents: number): number {
  return cents / 100;
}

function toScenario(row: ScenarioRow): ScenarioDTO {
  return {
    id: Number(row.id),
    nomeProcedimento: row.nome_procedimento,
    inputs: JSON.parse(row.inputs_json) as CompletePricingInput,
    createdAt: row.created_at,
    precoSugerido: reais(row.preco_sugerido_cents),
    custoTotal: reais(row.custo_total_cents),
  };
}

export function openDatabase(databasePath: string): AppDatabase {
  if (databasePath !== ':memory:') {
    mkdirSync(dirname(databasePath), { recursive: true });
  }
  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 3000;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      nome_procedimento TEXT NOT NULL,
      inputs_json TEXT NOT NULL,
      preco_sugerido_cents INTEGER NOT NULL,
      custo_total_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_scenarios_user ON scenarios(user_id, id DESC);
  `);

  let closed = false;

  const api: AppDatabase = {
    createUser(input) {
      const createdAt = new Date().toISOString();
      const info = db
        .prepare('INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)')
        .run(input.email, input.passwordHash, input.name, createdAt);
      return { id: Number(info.lastInsertRowid), email: input.email, name: input.name };
    },
    findUserByEmail(email) {
      const row = db
        .prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?')
        .get(email) as UserRow | undefined;
      if (!row) return undefined;
      return { id: Number(row.id), email: row.email, name: row.name, passwordHash: row.password_hash };
    },
    createSession(userId, tokenHash, expiresAt) {
      db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(
        tokenHash,
        userId,
        expiresAt,
      );
    },
    deleteSession(tokenHash) {
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    },
    deleteExpiredSessions(nowIso) {
      db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(nowIso);
    },
    userForSession(tokenHash, nowIso) {
      const row = db
        .prepare(
          `SELECT u.id AS id, u.email AS email, u.name AS name
           FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.token_hash = ? AND s.expires_at > ?`,
        )
        .get(tokenHash, nowIso) as PublicUser | undefined;
      if (!row) return undefined;
      return { id: Number(row.id), email: row.email, name: row.name };
    },
    countScenarios(userId) {
      const row = db.prepare('SELECT COUNT(*) AS total FROM scenarios WHERE user_id = ?').get(userId) as
        | { total: number }
        | undefined;
      return Number(row?.total ?? 0);
    },
    listScenarios(userId) {
      const rows = db
        .prepare(
          `SELECT id, nome_procedimento, inputs_json, created_at, preco_sugerido_cents, custo_total_cents
           FROM scenarios WHERE user_id = ? ORDER BY id DESC`,
        )
        .all(userId) as ScenarioRow[];
      return rows.map(toScenario);
    },
    insertScenario(input) {
      const info = db
        .prepare(
          `INSERT INTO scenarios (
             user_id, nome_procedimento, inputs_json, preco_sugerido_cents, custo_total_cents, created_at
           ) VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(
          input.userId,
          input.nomeProcedimento,
          JSON.stringify(input.inputs),
          input.precoSugeridoCents,
          input.custoTotalCents,
          input.createdAt,
        );
      return {
        id: Number(info.lastInsertRowid),
        nomeProcedimento: input.nomeProcedimento,
        inputs: input.inputs,
        createdAt: input.createdAt,
        precoSugerido: reais(input.precoSugeridoCents),
        custoTotal: reais(input.custoTotalCents),
      };
    },
    deleteScenario(userId, id) {
      const info = db.prepare('DELETE FROM scenarios WHERE user_id = ? AND id = ?').run(userId, id);
      return Number(info.changes) > 0;
    },
    transaction(fn) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const result = fn();
        db.exec('COMMIT');
        return result;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    close() {
      if (closed) return;
      closed = true;
      db.close();
    },
  };

  return api;
}
