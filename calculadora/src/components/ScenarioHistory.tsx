import { useState } from 'react';
import { Download } from 'lucide-react';
import { formatBRL } from '@/lib/pricing.ts';
import type { ScenarioDTO } from '@/lib/types.ts';

type ScenarioHistoryProps = {
  scenarios: ScenarioDTO[];
  compareId: number | null;
  onLoad: (scenario: ScenarioDTO) => void;
  onCompare: (scenario: ScenarioDTO) => void;
  onDelete: (id: number) => void;
  onExport: () => void;
};

export function ScenarioHistory({
  scenarios,
  compareId,
  onLoad,
  onCompare,
  onDelete,
  onExport,
}: ScenarioHistoryProps) {
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  return (
    <section className="no-print bg-white rounded-xl p-6 shadow-sm border border-essence-gold/20" aria-labelledby="historico-titulo">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id="historico-titulo" className="text-lg font-semibold text-essence-dark flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-essence-gold" aria-hidden="true" />
          Seus cenários
        </h2>
        <button
          type="button"
          onClick={onExport}
          disabled={scenarios.length === 0}
          className="text-xs font-semibold text-essence-wine border border-essence-wine/30 rounded-lg px-3 py-2 disabled:opacity-40 inline-flex items-center gap-1.5"
        >
          <Download size={14} aria-hidden="true" />
          Exportar histórico (CSV)
        </button>
      </div>
      {scenarios.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhum cenário salvo ainda. Dê um nome ao procedimento e salve.</p>
      ) : (
        <ul className="space-y-3" data-testid="scenario-list">
          {scenarios.map((scenario) => {
            const when = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
              new Date(scenario.createdAt),
            );
            return (
              <li key={scenario.id} className="border border-essence-gold/30 rounded-lg p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-essence-dark text-sm">{scenario.nomeProcedimento}</p>
                  <p className="text-xs text-gray-600">
                    {when} · sugerido {formatBRL(scenario.precoSugerido)} · custo {formatBRL(scenario.custoTotal)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onLoad(scenario)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-essence-dark text-essence-cream">
                    Carregar
                  </button>
                  <button
                    type="button"
                    aria-pressed={compareId === scenario.id}
                    onClick={() => onCompare(scenario)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-essence-gold text-essence-dark"
                  >
                    {compareId === scenario.id ? 'Comparando' : 'Comparar'}
                  </button>
                  {pendingDelete === scenario.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(scenario.id);
                          setPendingDelete(null);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-800 text-white"
                      >
                        Confirmar exclusão
                      </button>
                      <button type="button" onClick={() => setPendingDelete(null)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-300">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setPendingDelete(scenario.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-800">
                      Excluir
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
