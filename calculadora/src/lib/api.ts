import type { SupabaseClient, User } from '@supabase/supabase-js';
import { calculatePricing, isCompletePricingInput, type CompletePricingInput } from './pricing.ts';
import type { PublicUser, ScenarioDTO } from './types.ts';

export const MAX_SCENARIOS = 200;

export type CenarioRow = {
  id: string;
  user_id: string;
  nome_procedimento: string;
  inputs: CompletePricingInput;
  preco_sugerido_cents: number;
  custo_total_cents: number;
  created_at: string;
  updated_at: string;
};

export type CenarioInsert = {
  id?: string;
  user_id?: string;
  nome_procedimento: string;
  inputs: CompletePricingInput;
  preco_sugerido_cents: number;
  custo_total_cents: number;
  created_at?: string;
  updated_at?: string;
};

/** Tipagem mínima do schema `public` usada pelo cliente Supabase. */
export type Database = {
  public: {
    Tables: {
      cenarios: {
        Row: CenarioRow;
        Insert: CenarioInsert;
        Update: Partial<CenarioInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type AppSupabaseClient = SupabaseClient<Database>;

export class ApiError extends Error {
  status: number;
  code: string | null;

  constructor(status: number, message: string, code: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export type RegisterResult = {
  user: PublicUser;
  /** `true` quando o Supabase exige confirmar o e-mail antes de entrar (não veio sessão). */
  needsEmailConfirmation: boolean;
};

export type Api = {
  currentUser(): Promise<PublicUser | null>;
  onAuthChange(callback: (user: PublicUser | null) => void): () => void;
  register(input: { name: string; email: string; password: string }): Promise<RegisterResult>;
  login(input: { email: string; password: string }): Promise<{ user: PublicUser }>;
  logout(): Promise<void>;
  listScenarios(): Promise<ScenarioDTO[]>;
  saveScenario(input: { nomeProcedimento: string; inputs: CompletePricingInput }): Promise<ScenarioDTO>;
  deleteScenario(id: string): Promise<void>;
};

type ErrorLike = { message?: string; status?: number; code?: string | null; details?: string | null } | null;

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Verifique a caixa de entrada e o spam.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_exists: 'Já existe uma conta com este e-mail.',
  weak_password: 'A senha é fraca demais. Use de 8 a 72 caracteres, misturando letras e números.',
  email_address_invalid: 'Este e-mail não é válido.',
  email_address_not_authorized: 'Este e-mail não está autorizado a receber mensagens deste projeto.',
  signup_disabled: 'O cadastro está desativado neste projeto.',
  over_email_send_rate_limit: 'Muitos e-mails enviados em pouco tempo. Aguarde alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.',
  validation_failed: 'Confira o e-mail e a senha informados.',
  session_expired: 'Sua sessão expirou. Entre de novo.',
  session_not_found: 'Sua sessão expirou. Entre de novo.',
  user_banned: 'Esta conta está bloqueada.',
};

const AUTH_MESSAGE_PATTERNS: [RegExp, string][] = [
  [/invalid login credentials/i, AUTH_MESSAGES.invalid_credentials],
  [/email not confirmed/i, AUTH_MESSAGES.email_not_confirmed],
  [/already (been )?registered|already exists/i, AUTH_MESSAGES.user_already_exists],
  [/password should be at least|password is too weak|weak password/i, AUTH_MESSAGES.weak_password],
  [/rate limit/i, AUTH_MESSAGES.over_request_rate_limit],
  [/unable to validate email|invalid email|is invalid/i, AUTH_MESSAGES.email_address_invalid],
  [/fetch|network|failed to fetch|load failed/i, 'Sem conexão com o Supabase. Confira a internet e tente de novo.'],
];

/** Traduz erros do Supabase Auth para português. Mensagens desconhecidas viram um aviso genérico. */
export function translateAuthError(error: ErrorLike, fallback: string): ApiError {
  const status = typeof error?.status === 'number' ? error.status : 400;
  const code = error?.code ?? null;
  if (code && AUTH_MESSAGES[code]) return new ApiError(status, AUTH_MESSAGES[code], code);
  const message = error?.message ?? '';
  for (const [pattern, text] of AUTH_MESSAGE_PATTERNS) {
    if (pattern.test(message)) return new ApiError(status, text, code);
  }
  return new ApiError(status, fallback, code);
}

const DB_MESSAGE_PATTERNS: [RegExp, string][] = [
  [/PGRST205|relation .* does not exist|schema cache/i, 'A tabela de cenários ainda não existe no Supabase. Rode o SQL de supabase/migrations no SQL Editor.'],
  [/42501|row-level security|permission denied/i, 'Sem permissão para esta operação. Entre de novo na sua conta.'],
  [/limite de 200 cenários/i, `Você chegou ao limite de ${MAX_SCENARIOS} cenários. Exclua algum para salvar outro.`],
  [/check constraint|violates check/i, 'Informe o nome do procedimento e números válidos.'],
  [/JWT expired|invalid JWT|PGRST301|PGRST303/i, 'Sua sessão expirou. Entre de novo.'],
  [/fetch|network|failed to fetch|load failed/i, 'Sem conexão com o Supabase. Confira a internet e tente de novo.'],
];

/** Traduz erros do PostgREST/Postgres para português. */
export function translateDbError(error: ErrorLike, fallback: string): ApiError {
  const code = error?.code ?? null;
  const haystack = `${code ?? ''} ${error?.message ?? ''} ${error?.details ?? ''}`;
  const unauthorized = code === '42501' || code === 'PGRST301' || code === 'PGRST303' || /JWT expired/i.test(haystack);
  const status = unauthorized ? 401 : typeof error?.status === 'number' ? error.status : 400;
  for (const [pattern, text] of DB_MESSAGE_PATTERNS) {
    if (pattern.test(haystack)) return new ApiError(status, text, code);
  }
  return new ApiError(status, fallback, code);
}

function stripControls(value: string): string {
  let cleaned = '';
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code >= 32 && code !== 127) cleaned += char;
  }
  return cleaned;
}

export function cleanName(value: string): string | null {
  const name = stripControls(value).trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80) return null;
  return name;
}

export function cleanEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function cleanPassword(value: string): string | null {
  if (value.length < 8 || value.length > 72) return null;
  return value;
}

export function cleanProcedureName(value: string): string | null {
  const name = stripControls(value).trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > 120) return null;
  return name;
}

function cents(value: number): number {
  return Math.round(value * 100);
}

function reais(value: number): number {
  return value / 100;
}

export function toPublicUser(user: User | null | undefined): PublicUser | null {
  if (!user) return null;
  const email = user.email ?? '';
  const metadataName = user.user_metadata?.name;
  const name = typeof metadataName === 'string' && metadataName.trim() ? metadataName.trim() : email.split('@')[0] || 'você';
  return { id: user.id, email, name };
}

export function toScenario(row: CenarioRow): ScenarioDTO {
  return {
    id: row.id,
    nomeProcedimento: row.nome_procedimento,
    inputs: row.inputs,
    createdAt: row.created_at,
    precoSugerido: reais(Number(row.preco_sugerido_cents)),
    custoTotal: reais(Number(row.custo_total_cents)),
  };
}

const SCENARIO_COLUMNS = 'id, user_id, nome_procedimento, inputs, preco_sugerido_cents, custo_total_cents, created_at, updated_at';

/**
 * Camada de dados sobre o Supabase. Recebe o cliente para poder ser testada com um cliente falso.
 * As regras de negócio (nome válido, horas > 0, taxas + margem < 100%) são checadas aqui antes de ir ao banco;
 * o banco repete as checagens por CHECK e RLS garante que cada pessoa só mexe nas próprias linhas.
 */
export function createApi(client: AppSupabaseClient): Api {
  async function requireUserId(): Promise<string> {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      throw new ApiError(401, 'Entre na sua conta para continuar.', error?.code ?? null);
    }
    return data.user.id;
  }

  return {
    async currentUser() {
      const { data, error } = await client.auth.getSession();
      if (error) throw translateAuthError(error, 'Não foi possível recuperar sua sessão.');
      return toPublicUser(data.session?.user);
    },

    onAuthChange(callback) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        callback(toPublicUser(session?.user));
      });
      return () => data.subscription.unsubscribe();
    },

    async register(input) {
      const name = cleanName(input.name);
      const email = cleanEmail(input.email);
      const password = cleanPassword(input.password);
      if (!name || !email || !password) {
        throw new ApiError(400, 'Use um nome, um e-mail válido e uma senha de 8 a 72 caracteres.');
      }
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw translateAuthError(error, 'Não foi possível criar a conta.');
      if (!data.user) throw new ApiError(500, 'Não foi possível criar a conta.');
      // Com "Confirm email" ligado, o Supabase devolve um usuário sem identidades quando o e-mail já existe.
      if (!data.session && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new ApiError(409, AUTH_MESSAGES.user_already_exists, 'user_already_exists');
      }
      const user = toPublicUser(data.user);
      if (!user) throw new ApiError(500, 'Não foi possível criar a conta.');
      return { user: { ...user, name }, needsEmailConfirmation: !data.session };
    },

    async login(input) {
      const email = cleanEmail(input.email);
      if (!email || !input.password) {
        throw new ApiError(400, 'E-mail ou senha incorretos.');
      }
      const { data, error } = await client.auth.signInWithPassword({ email, password: input.password });
      if (error) throw translateAuthError(error, 'Não foi possível entrar.');
      const user = toPublicUser(data.user);
      if (!user) throw new ApiError(401, 'E-mail ou senha incorretos.');
      return { user };
    },

    async logout() {
      const { error } = await client.auth.signOut();
      if (error) throw translateAuthError(error, 'Não foi possível sair.');
    },

    async listScenarios() {
      const { data, error } = await client
        .from('cenarios')
        .select(SCENARIO_COLUMNS)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });
      if (error) throw translateDbError(error, 'Não foi possível carregar o histórico.');
      return (data ?? []).map(toScenario);
    },

    async saveScenario(input) {
      const nomeProcedimento = cleanProcedureName(input.nomeProcedimento);
      if (!nomeProcedimento || !isCompletePricingInput(input.inputs)) {
        throw new ApiError(400, 'Informe o nome do procedimento e números válidos.');
      }
      const pricing = calculatePricing(input.inputs);
      if (!pricing.ok) {
        throw new ApiError(400, pricing.errors[0]?.message ?? 'Este cenário não pode ser salvo.');
      }
      const userId = await requireUserId();
      const { data, error } = await client
        .from('cenarios')
        .insert({
          user_id: userId,
          nome_procedimento: nomeProcedimento,
          inputs: input.inputs,
          preco_sugerido_cents: cents(pricing.precoSugerido),
          custo_total_cents: cents(pricing.custoTotalAtendimento),
        })
        .select(SCENARIO_COLUMNS)
        .single();
      if (error) throw translateDbError(error, 'Não foi possível salvar.');
      return toScenario(data);
    },

    async deleteScenario(id) {
      const { data, error } = await client.from('cenarios').delete().eq('id', id).select('id');
      if (error) throw translateDbError(error, 'Não foi possível excluir.');
      if (!data || data.length === 0) throw new ApiError(404, 'Cenário não encontrado.');
    },
  };
}
