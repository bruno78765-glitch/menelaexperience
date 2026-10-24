import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? '';

function descreverConfiguracao(): string | null {
  const faltando: string[] = [];
  if (!url) faltando.push('VITE_SUPABASE_URL');
  if (!anon) faltando.push('VITE_SUPABASE_ANON_KEY');
  if (faltando.length > 0) {
    return `Falta configurar ${faltando.join(' e ')}. Copie .env.example para .env e gere o site de novo.`;
  }
  try {
    const endereco = new URL(url);
    if (endereco.protocol !== 'https:' && endereco.protocol !== 'http:') throw new Error('protocolo');
  } catch {
    return 'VITE_SUPABASE_URL não é um endereço válido.';
  }
  return null;
}

export const SUPABASE_CONFIG_ERROR = descreverConfiguracao();

export const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG_ERROR ? 'https://configuracao-ausente.invalid' : url,
  SUPABASE_CONFIG_ERROR ? 'configuracao-ausente' : anon,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // O link de redefinição precisa abrir em qualquer navegador. O fluxo PKCE só conclui
      // no mesmo navegador que pediu o e-mail.
      flowType: 'implicit',
    },
  },
);
