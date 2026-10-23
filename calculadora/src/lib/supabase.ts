import { createClient } from '@supabase/supabase-js';
import { createApi, type AppSupabaseClient, type Database } from './api.ts';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

function describeConfigError(): string | null {
  const missing: string[] = [];
  if (!url) missing.push('VITE_SUPABASE_URL');
  if (!anonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  if (missing.length > 0) {
    return `Falta configurar ${missing.join(' e ')}. Copie .env.example para .env (ou cadastre as variáveis no Bolt/Netlify) e gere o site de novo.`;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('protocolo');
  } catch {
    return 'VITE_SUPABASE_URL não é um endereço válido. Use algo como https://SEU-PROJETO.supabase.co.';
  }
  return null;
}

/** Mensagem em português quando as variáveis do Supabase não foram definidas no build. */
export const SUPABASE_CONFIG_ERROR = describeConfigError();

// Quando a configuração falta, o cliente aponta para um endereço inválido e a tela de erro impede qualquer chamada.
export const supabase: AppSupabaseClient = createClient<Database>(
  SUPABASE_CONFIG_ERROR ? 'https://configuracao-ausente.invalid' : url,
  SUPABASE_CONFIG_ERROR ? 'configuracao-ausente' : anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  },
);

export const api = createApi(supabase);
