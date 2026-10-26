import { useState } from 'react';
import { Download } from 'lucide-react';
import { formatBRL } from '../lib/pricing.ts';
import type { ScenarioDTO } from '../lib/types.ts';

type ScenarioHistoryProps = {
  scenarios: ScenarioDTO[];
  compareId: string | null;
  onLoad: (scenario: ScenarioDTO) => void;
  onCompare: (scenario: ScenarioDTO) => void;
  onDelete: (id: string) => void;
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
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <section className="no-print glass rounded-2xl p-6" aria-labelledby="historico-titulo">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="historico-titulo" className="flex items-center gap-2 font-display text-xl text-creme-50">
          <span className="h-2 w-2 rounded-full bg-champagne-500" aria-hidden="true" />
          Seus cenários
        </h2>
        <button
          type="button"
          onClick={onExport}
          disabled={scenarios.length === 0}
          className="btn-ghost px-3 py-2 text-xs disabled:opacity-40"
        >
          <Download size={14} aria-hidden="true" />
          Exportar histórico (CSV)
        </button>
      </div>
      {scenarios.length === 0 ? (
        <p className="text-sm text-creme-200/65">Nenhum cenário salvo ainda. Dê um nome ao procedimento e salve.</p>
      ) : (
        <ul className="space-y-3" data-testid="scenario-list">
          {scenarios.map((scenario) => {
            const when = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
              new Date(scenario.createdAt),
            );
            return (
              <li key={scenario.id} className="flex flex-col gap-2 rounded-xl border border-champagne-500/25 bg-essencia-900/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-creme-50">{scenario.nomeProcedimento}</p>
                  <p className="text-xs text-creme-200/60">
                    {when} · sugerido {formatBRL(scenario.precoSugerido)} · custo {formatBRL(scenario.custoTotal)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onLoad(scenario)} className="rounded-lg bg-champagne-500 px-3 py-1.5 text-xs font-semibold text-essencia-900">
                    Carregar
                  </button>
                  <button
                    type="button"
                    aria-pressed={compareId === scenario.id}
                    onClick={() => onCompare(scenario)}
                    className="rounded-lg border border-champagne-500/50 px-3 py-1.5 text-xs font-semibold text-creme-50"
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
                        className="rounded-lg bg-red-800 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Confirmar exclusão
                      </button>
                      <button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border border-creme-200/30 px-3 py-1.5 text-xs text-creme-100">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setPendingDelete(scenario.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-200">
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
