import { useMemo } from 'react';
import { SectionHeader } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { Calculator } from '@/calculadora/components/Calculator.tsx';
import { createApi, type AppSupabaseClient } from '@/calculadora/lib/api.ts';

export function Precificacao() {
  const api = useMemo(() => createApi(supabase as unknown as AppSupabaseClient), []);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Área da mentorada · Precificação"
        titulo="Calculadora de preço e viabilidade"
        descricao="Abre nesta aba, com a conta que você já usou para entrar. O cálculo aparece na hora. Os cenários salvos continuam só seus."
      />
      <Calculator api={api} />
    </div>
  );
}
