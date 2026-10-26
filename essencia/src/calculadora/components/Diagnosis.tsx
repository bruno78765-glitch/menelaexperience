import { Download, Printer } from 'lucide-react';
import { formatBRL, formatPercent, type PricingFields, type PricingResult, type PricingSuccess } from '../lib/pricing.ts';
import { ResultAlerts } from './ResultAlerts.tsx';

type DiagnosisProps = {
  nome: string;
  input: PricingFields;
  result: PricingResult;
  comparison: { nome: string; result: PricingSuccess } | null;
  onExport: () => void;
};

function money(value: number | null): string {
  return formatBRL(value);
}

export function Diagnosis({ nome, input, result, comparison, onExport }: DiagnosisProps) {
  const today = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());
  const price = result.ok ? money(result.precoSugerido) : '—';

  return (
    <aside className="report-sheet glass rounded-2xl p-6 shadow-glow lg:sticky lg:top-6">
      <p className="print-only text-xs uppercase tracking-widest mb-1">Relatório de precificação · Método Essence</p>
      <p className="print-only text-sm font-semibold mb-4">
        {nome.trim() || 'Procedimento sem nome'} · {today}
      </p>

      <table className="print-only w-full text-sm mb-4">
        <caption className="text-left font-semibold mb-2">Premissas deste cálculo</caption>
        <tbody>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Produtos e descartáveis</th>
            <td className="text-right">{money(input.custoMaterial)}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Rateio de despesas fixas</th>
            <td className="text-right">{money(input.custoFixo)}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Remuneração mensal (pró-labore)</th>
            <td className="text-right">{money(input.remuneracaoDesejada)}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Horas produtivas</th>
            <td className="text-right">{input.horasProdutivas ?? '—'}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Tempo do procedimento (h)</th>
            <td className="text-right">{input.tempoProcedimento ?? '—'}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Taxas variáveis</th>
            <td className="text-right">{input.taxasVariaveis === null ? '—' : `${input.taxasVariaveis}%`}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Margem de lucro desejada</th>
            <td className="text-right">{input.margemLucro === null ? '—' : `${input.margemLucro}%`}</td>
          </tr>
          <tr>
            <th scope="row" className="text-left font-normal py-0.5">Desconto simulado</th>
            <td className="text-right">{input.percentualDesconto === null ? '—' : `${input.percentualDesconto}%`}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-4 border-b border-champagne-500/30 pb-2 text-sm font-semibold uppercase tracking-widest text-champagne-500">
        Diagnóstico de precificação
      </h2>

      <div className="space-y-4">
        <div>
          <span className="block text-xs text-creme-200/60">Hora técnica</span>
          <span className="font-display text-2xl text-creme-50">
            {result.ok ? `${money(result.horaTecnica)} /h` : '—'}
          </span>
        </div>
        <div>
          <span className="block text-xs text-creme-200/60">Custo total (materiais + fixos + pró-labore)</span>
          <span className="font-display text-2xl text-creme-50">
            {result.ok ? money(result.custoTotalAtendimento) : '—'}
          </span>
        </div>

        <div className="pt-2">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-champagne-500">Composição do preço</h3>
          <table className="w-full text-sm">
            <caption className="sr-only">Composição do preço sugerido</caption>
            <tbody>
              <Breakdown label="Produtos e descartáveis" value={result.ok ? money(result.custoMaterial) : '—'} />
              <Breakdown label="Rateio de despesas fixas" value={result.ok ? money(result.custoFixo) : '—'} />
              <Breakdown label="Pró-labore do tempo" value={result.ok ? money(result.remuneracaoTempo) : '—'} />
              <Breakdown label="Taxas e impostos" value={result.ok ? money(result.taxasValor) : '—'} />
              <Breakdown label="Lucro da margem" value={result.ok ? money(result.lucroValor) : '—'} />
            </tbody>
          </table>
          <p className="mt-2 text-[11px] text-creme-200/60">
            O pró-labore remunera o seu tempo e já está dentro do custo. A margem é o lucro do negócio, calculada por
            cima desse custo.
          </p>
        </div>

        <div className="border-t border-champagne-500/30 pt-4">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-champagne-500">
            Preço sugerido de referência
          </span>
          <p data-testid="suggested-price" aria-live="polite" className="font-display text-4xl font-semibold text-champagne-400">
            {price}
          </p>
          <p className="mt-1 text-[11px] text-creme-200/60">
            {result.ok
              ? 'Cobre materiais, despesas fixas, pró-labore, taxas e a margem desejada.'
              : 'O preço sugerido só aparece quando a fórmula é viável.'}
          </p>
        </div>

        <ResultAlerts result={result} />

        {comparison ? (
          <div className="rounded-xl border border-champagne-500/25 bg-essencia-900/30 p-3 text-xs text-creme-100">
            <h3 className="mb-2 font-semibold text-champagne-400">Comparando com {comparison.nome}</h3>
            <table className="w-full">
              <caption className="sr-only">Cenário atual e cenário salvo</caption>
              <thead>
                <tr className="text-creme-200/60">
                  <th scope="col" className="text-left font-normal py-1">Indicador</th>
                  <th scope="col" className="text-right font-normal py-1">Atual</th>
                  <th scope="col" className="text-right font-normal py-1">Salvo</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow
                  label="Preço sugerido"
                  current={result.ok ? money(result.precoSugerido) : '—'}
                  saved={money(comparison.result.precoSugerido)}
                />
                <CompareRow
                  label="Custo total"
                  current={result.ok ? money(result.custoTotalAtendimento) : '—'}
                  saved={money(comparison.result.custoTotalAtendimento)}
                />
                <CompareRow
                  label="Hora técnica"
                  current={result.ok ? money(result.horaTecnica) : '—'}
                  saved={money(comparison.result.horaTecnica)}
                />
                <CompareRow
                  label="Margem efetiva"
                  current={result.ok ? formatPercent(result.margemEfetiva) : '—'}
                  saved={formatPercent(comparison.result.margemEfetiva)}
                />
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="no-print mt-8 grid grid-cols-1 gap-2 border-t border-champagne-500/30 pt-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-gold w-full py-3 text-sm"
        >
          <Printer size={16} aria-hidden="true" />
          Imprimir / salvar PDF
        </button>
        <button
          type="button"
          onClick={onExport}
          disabled={!result.ok}
          className="btn-ghost w-full py-3 text-sm disabled:opacity-40"
        >
          <Download size={16} aria-hidden="true" />
          Exportar CSV
        </button>
      </div>
    </aside>
  );
}

function Breakdown({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-white/5">
      <th scope="row" className="py-1.5 text-left font-normal text-creme-200/80">
        {label}
      </th>
      <td className="py-1.5 text-right text-creme-50">{value}</td>
    </tr>
  );
}

function CompareRow({ label, current, saved }: { label: string; current: string; saved: string }) {
  return (
    <tr>
      <th scope="row" className="text-left font-normal py-1">{label}</th>
      <td className="text-right py-1">{current}</td>
      <td className="text-right py-1">{saved}</td>
    </tr>
  );
}
