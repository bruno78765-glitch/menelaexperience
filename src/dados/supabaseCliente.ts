import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const urlSupabase = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const chaveAnonSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const temSupabaseConfigurado = Boolean(
  urlSupabase &&
  chaveAnonSupabase &&
  urlSupabase.startsWith('http') &&
  chaveAnonSupabase.length > 20
);

export const supabase: SupabaseClient | null = temSupabaseConfigurado
  ? createClient(urlSupabase!, chaveAnonSupabase!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
