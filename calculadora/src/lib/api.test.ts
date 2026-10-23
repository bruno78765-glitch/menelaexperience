import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  ApiError,
  cleanEmail,
  cleanName,
  cleanPassword,
  cleanProcedureName,
  createApi,
  toPublicUser,
  translateAuthError,
  translateDbError,
  type AppSupabaseClient,
  type CenarioRow,
} from './api.ts';
import { EXAMPLE_INPUT } from './pricing.ts';

/**
 * Cliente Supabase falso: só o que a camada de dados usa. A tabela em memória filtra por usuário
 * para imitar o RLS; a prova real do RLS é o SQL em supabase/migrations, não este arquivo.
 */
type FakeUser = { id: string; email: string; password: string; confirmed: boolean; name: string };

type FakeOptions = {
  confirmEmail?: boolean;
  tableExists?: boolean;
};

function fakeClient(options: FakeOptions = {}) {
  const confirmEmail = options.confirmEmail ?? false;
  const tableExists = options.tableExists ?? true;
  const users: FakeUser[] = [];
  const rows: CenarioRow[] = [];
  let current: FakeUser | null = null;
  let counter = 0;
  const listeners: ((event: string, session: unknown) => void)[] = [];

  const authUser = (user: FakeUser) => ({
    id: user.id,
    email: user.email,
    user_metadata: { name: user.name },
    identities: [{ id: user.id }],
  });
  const session = (user: FakeUser) => ({ user: authUser(user), access_token: `token-${user.id}` });
  const authError = (message: string, status: number, code: string) => ({ message, status, code, name: 'AuthApiError' });

  function table() {
    const missing = { code: 'PGRST205', message: "Could not find the table 'public.cenarios' in the schema cache", details: null };
    const denied = { code: '42501', message: 'new row violates row-level security policy for table "cenarios"', details: null };
    return {
      select() {
        const query = {
          order() {
            return query;
          },
          then(resolve: (value: unknown) => void) {
            if (!tableExists) return resolve({ data: null, error: missing });
            if (!current) return resolve({ data: [], error: null });
            const mine = rows.filter((row) => row.user_id === current?.id).reverse();
            resolve({ data: mine, error: null });
          },
        };
        return query;
      },
      insert(values: Omit<CenarioRow, 'id' | 'created_at' | 'updated_at'>) {
        return {
          select() {
            return {
              async single() {
                if (!tableExists) return { data: null, error: missing };
                if (!current || values.user_id !== current.id) return { data: null, error: denied };
                counter += 1;
                const now = new Date(Date.UTC(2026, 9, 23, 18, 0, counter)).toISOString();
                const row: CenarioRow = { ...values, id: `cenario-${counter}`, created_at: now, updated_at: now };
                rows.push(row);
                return { data: row, error: null };
              },
            };
          },
        };
      },
      delete() {
        return {
          eq(_column: string, id: string) {
            return {
              async select() {
                if (!tableExists) return { data: null, error: missing };
                const index = rows.findIndex((row) => row.id === id && row.user_id === current?.id);
                if (index === -1) return { data: [], error: null };
                const [removed] = rows.splice(index, 1);
                return { data: [{ id: removed?.id }], error: null };
              },
            };
          },
        };
      },
    };
  }

  const client = {
    auth: {
      async getSession() {
        return { data: { session: current ? session(current) : null }, error: null };
      },
      async getUser() {
        if (!current) return { data: { user: null }, error: authError('session missing', 401, 'session_not_found') };
        return { data: { user: authUser(current) }, error: null };
      },
      onAuthStateChange(callback: (event: string, session: unknown) => void) {
        listeners.push(callback);
        return { data: { subscription: { unsubscribe() {} } } };
      },
      async signUp(input: { email: string; password: string; options?: { data?: { name?: string } } }) {
        const existing = users.find((user) => user.email === input.email);
        if (existing) {
          if (confirmEmail) {
            // Comportamento real do Supabase com confirmação ligada: usuário "fantasma" sem identidades.
            return { data: { user: { ...authUser(existing), identities: [] }, session: null }, error: null };
          }
          return { data: { user: null, session: null }, error: authError('User already registered', 422, 'user_already_exists') };
        }
        if (input.password.length < 6) {
          return { data: { user: null, session: null }, error: authError('Password should be at least 6 characters.', 422, 'weak_password') };
        }
        const user: FakeUser = {
          id: `user-${users.length + 1}`,
          email: input.email,
          password: input.password,
          confirmed: !confirmEmail,
          name: input.options?.data?.name ?? '',
        };
        users.push(user);
        if (confirmEmail) return { data: { user: authUser(user), session: null }, error: null };
        current = user;
        return { data: { user: authUser(user), session: session(user) }, error: null };
      },
      async signInWithPassword(input: { email: string; password: string }) {
        const user = users.find((candidate) => candidate.email === input.email);
        if (!user || user.password !== input.password) {
          return { data: { user: null, session: null }, error: authError('Invalid login credentials', 400, 'invalid_credentials') };
        }
        if (!user.confirmed) {
          return { data: { user: null, session: null }, error: authError('Email not confirmed', 400, 'email_not_confirmed') };
        }
        current = user;
        return { data: { user: authUser(user), session: session(user) }, error: null };
      },
      async signOut() {
        current = null;
        for (const listener of listeners) listener('SIGNED_OUT', null);
        return { error: null };
      },
    },
    from(name: string) {
      assert.equal(name, 'cenarios');
      return table();
    },
  };

  return {
    client: client as unknown as AppSupabaseClient,
    confirm(email: string) {
      const user = users.find((candidate) => candidate.email === email);
      if (user) user.confirmed = true;
    },
    rows,
  };
}

test('cadastro e entrada traduzem erros do Supabase para português', async () => {
  const fake = fakeClient();
  const api = createApi(fake.client);

  await assert.rejects(
    api.register({ name: 'A', email: 'ana@example.com', password: 'senha-ana-123' }),
    (error: unknown) => error instanceof ApiError && error.status === 400,
  );
  await assert.rejects(
    api.register({ name: 'Ana', email: 'nao-e-email', password: 'senha-ana-123' }),
    (error: unknown) => error instanceof ApiError && error.status === 400,
  );
  await assert.rejects(
    api.register({ name: 'Ana', email: 'ana@example.com', password: 'curta' }),
    (error: unknown) => error instanceof ApiError && /8 a 72/.test(error.message),
  );

  const created = await api.register({ name: '  Ana   Lima ', email: 'Ana@Example.com', password: 'senha-ana-123' });
  assert.equal(created.needsEmailConfirmation, false);
  assert.equal(created.user.email, 'ana@example.com');
  assert.equal(created.user.name, 'Ana Lima');

  await assert.rejects(
    api.register({ name: 'Ana Lima', email: 'ana@example.com', password: 'senha-ana-123' }),
    (error: unknown) => error instanceof ApiError && error.message === 'Já existe uma conta com este e-mail.',
  );

  await api.logout();
  assert.equal(await api.currentUser(), null);

  await assert.rejects(
    api.login({ email: 'ana@example.com', password: 'senha-errada' }),
    (error: unknown) => error instanceof ApiError && error.message === 'E-mail ou senha incorretos.',
  );
  const logged = await api.login({ email: 'ANA@example.com', password: 'senha-ana-123' });
  assert.equal(logged.user.id, 'user-1');
  const me = await api.currentUser();
  assert.equal(me?.email, 'ana@example.com');
});

test('com "Confirm email" ligado, o cadastro avisa para verificar o e-mail e não cria sessão', async () => {
  const fake = fakeClient({ confirmEmail: true });
  const api = createApi(fake.client);

  const created = await api.register({ name: 'Bia Souza', email: 'bia@example.com', password: 'senha-bia-123' });
  assert.equal(created.needsEmailConfirmation, true);
  assert.equal(await api.currentUser(), null);

  await assert.rejects(
    api.login({ email: 'bia@example.com', password: 'senha-bia-123' }),
    (error: unknown) => error instanceof ApiError && /Confirme seu e-mail/.test(error.message),
  );

  // Cadastro repetido com confirmação ligada vem como usuário sem identidades: tratamos como e-mail já usado.
  await assert.rejects(
    api.register({ name: 'Bia Souza', email: 'bia@example.com', password: 'outra-senha-123' }),
    (error: unknown) => error instanceof ApiError && error.status === 409,
  );

  fake.confirm('bia@example.com');
  const logged = await api.login({ email: 'bia@example.com', password: 'senha-bia-123' });
  assert.equal(logged.user.name, 'Bia Souza');
});

test('salvar, listar e excluir cenários converte centavos e respeita o dono', async () => {
  const fake = fakeClient();
  const api = createApi(fake.client);
  await api.register({ name: 'Ana Lima', email: 'ana@example.com', password: 'senha-ana-123' });

  const saved = await api.saveScenario({ nomeProcedimento: '  Limpeza   de pele ', inputs: EXAMPLE_INPUT });
  assert.equal(saved.nomeProcedimento, 'Limpeza de pele');
  assert.equal(saved.precoSugerido, 118.06);
  assert.equal(saved.custoTotal, 85);
  assert.equal(typeof saved.id, 'string');
  assert.equal(fake.rows[0]?.preco_sugerido_cents, 11806);
  assert.equal(fake.rows[0]?.user_id, 'user-1');

  const list = await api.listScenarios();
  assert.equal(list.length, 1);
  assert.deepEqual(list[0]?.inputs, EXAMPLE_INPUT);

  await api.logout();
  await api.register({ name: 'Bia Souza', email: 'bia@example.com', password: 'senha-bia-123' });
  assert.deepEqual(await api.listScenarios(), []);
  await assert.rejects(api.deleteScenario(saved.id), (error: unknown) => error instanceof ApiError && error.status === 404);
  assert.equal(fake.rows.length, 1);

  await api.logout();
  await api.login({ email: 'ana@example.com', password: 'senha-ana-123' });
  await api.deleteScenario(saved.id);
  assert.deepEqual(await api.listScenarios(), []);
});

test('não salva cenário com horas zeradas, fórmula inviável, nome vazio ou sem sessão', async () => {
  const fake = fakeClient();
  const api = createApi(fake.client);

  await assert.rejects(
    api.saveScenario({ nomeProcedimento: 'Sem login', inputs: EXAMPLE_INPUT }),
    (error: unknown) => error instanceof ApiError && error.status === 401,
  );

  await api.register({ name: 'Ana Lima', email: 'ana@example.com', password: 'senha-ana-123' });
  await assert.rejects(
    api.saveScenario({ nomeProcedimento: 'Horas zeradas', inputs: { ...EXAMPLE_INPUT, horasProdutivas: 0 } }),
    (error: unknown) => error instanceof ApiError && /horas produtivas/i.test(error.message),
  );
  await assert.rejects(
    api.saveScenario({ nomeProcedimento: 'Margem impossível', inputs: { ...EXAMPLE_INPUT, taxasVariaveis: 80, margemLucro: 20 } }),
    (error: unknown) => error instanceof ApiError && /inviável/.test(error.message),
  );
  await assert.rejects(
    api.saveScenario({ nomeProcedimento: '   ', inputs: EXAMPLE_INPUT }),
    (error: unknown) => error instanceof ApiError && error.status === 400,
  );
  assert.equal(fake.rows.length, 0);
});

test('tabela ausente vira aviso para rodar o SQL da migração', async () => {
  const fake = fakeClient({ tableExists: false });
  const api = createApi(fake.client);
  await api.register({ name: 'Ana Lima', email: 'ana@example.com', password: 'senha-ana-123' });
  await assert.rejects(api.listScenarios(), (error: unknown) => error instanceof ApiError && /supabase\/migrations/.test(error.message));
  await assert.rejects(
    api.saveScenario({ nomeProcedimento: 'Limpeza', inputs: EXAMPLE_INPUT }),
    (error: unknown) => error instanceof ApiError && /supabase\/migrations/.test(error.message),
  );
});

test('tradução de erros e limpeza de campos', () => {
  assert.equal(translateAuthError({ message: 'Invalid login credentials', status: 400 }, 'x').message, 'E-mail ou senha incorretos.');
  assert.equal(translateAuthError({ code: 'over_email_send_rate_limit', status: 429 }, 'x').status, 429);
  assert.equal(translateAuthError({ message: 'TypeError: Failed to fetch' }, 'x').message, 'Sem conexão com o Supabase. Confira a internet e tente de novo.');
  assert.equal(translateAuthError({ message: 'algo desconhecido' }, 'Padrão').message, 'Padrão');

  const rls = translateDbError({ code: '42501', message: 'permission denied for table cenarios' }, 'x');
  assert.equal(rls.status, 401);
  const limit = translateDbError({ code: 'P0001', message: 'Você chegou ao limite de 200 cenários. Exclua algum para salvar outro.' }, 'x');
  assert.match(limit.message, /limite de 200/);
  const check = translateDbError({ code: '23514', message: 'new row for relation "cenarios" violates check constraint "cenarios_horas_produtivas_positivas"' }, 'x');
  assert.equal(check.message, 'Informe o nome do procedimento e números válidos.');

  assert.equal(cleanName(' Ana \u0007 Lima '), 'Ana Lima');
  assert.equal(cleanName('A'), null);
  assert.equal(cleanEmail(' Ana@Example.COM '), 'ana@example.com');
  assert.equal(cleanEmail('sem-arroba'), null);
  assert.equal(cleanPassword('1234567'), null);
  assert.equal(cleanPassword('x'.repeat(73)), null);
  assert.equal(cleanProcedureName(' '), null);
  assert.equal(cleanProcedureName('x'.repeat(121)), null);

  assert.equal(toPublicUser(null), null);
  assert.deepEqual(toPublicUser({ id: 'u', email: 'ana@example.com', user_metadata: {} } as never), {
    id: 'u',
    email: 'ana@example.com',
    name: 'ana',
  });
});
