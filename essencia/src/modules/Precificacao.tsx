import { useMemo } from 'react';
import { SectionHeader } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { Calculator } from '../../../calculadora/src/components/Calculator.tsx';
import { createApi, type AppSupabaseClient } from '../../../calculadora/src/lib/api.ts';

export function Precificacao({ onSair }: { onSair: () => void }) {
  const api = useMemo(() => createApi(supabase as unknown as AppSupabaseClient), []);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Área da mentorada · Precificação"
        titulo="Calculadora de preço e viabilidade"
        descricao="A mesma conta do hub. Cada cenário fica só com quem o gravou."
      />
      <div className="rounded-2xl bg-creme-50 p-4 text-essence-dark sm:p-6">
        <Calculator api={api} onUnauthorized={onSair} />
      </div>
    </div>
  );
}
