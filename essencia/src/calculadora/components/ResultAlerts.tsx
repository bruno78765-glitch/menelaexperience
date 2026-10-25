import { formatBRL, formatPercent, type PricingResult } from '../lib/pricing.ts';
import { AlertTriangle } from 'lucide-react';

export function ResultAlerts({ result }: { result: PricingResult }) {
  if (!result.ok) {
    return (
      <div role="alert" data-testid="formula-error" className="alert rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-900 space-y-2">
        {result.errors.map((error) => (
          <p key={error.code}>{error.message}</p>
        ))}
      </div>
    );
  }

  if (!result.temDesconto) return null;

  if (result.abaixoDoCusto) {
    return (
      <div role="alert" data-testid="below-cost-alert" className="alert rounded-lg border border-red-400 bg-red-50 p-3 text-xs text-red-950">
        <p className="font-bold flex items-center gap-1.5 mb-1">
          <AlertTriangle size={14} aria-hidden="true" />
          Preço abaixo do custo
        </p>
        <p>
          Com este desconto, o valor fica em {formatBRL(result.precoComDesconto)}, menor que o custo total de{' '}
          {formatBRL(result.custoTotalAtendimento)}. Isso não é um preço saudável. Margem efetiva, já descontando as
          taxas: {formatPercent(result.margemEfetiva)}.
        </p>
      </div>
    );
  }

  if (result.margemEfetivaNegativa) {
    return (
      <div role="alert" data-testid="negative-margin-alert" className="alert rounded-lg border border-red-400 bg-red-50 p-3 text-xs text-red-950">
        <p className="font-bold flex items-center gap-1.5 mb-1">
          <AlertTriangle size={14} aria-hidden="true" />
          Taxas não cabem neste desconto
        </p>
        <p>
          O preço com desconto ainda cobre o custo direto, mas as taxas variáveis deixam a margem efetiva negativa (
          {formatPercent(result.margemEfetiva)}). Não trate este valor como um preço saudável.
        </p>
      </div>
    );
  }

  return (
    <div role="status" data-testid="discount-impact" className="alert rounded-lg border border-essence-gold/50 bg-essence-cream p-3 text-xs text-essence-dark">
      <p className="font-bold flex items-center gap-1.5 mb-1 text-essence-wine">
        <AlertTriangle size={14} aria-hidden="true" />
        Impacto do desconto
      </p>
      <p>
        Você abre mão de {formatBRL(result.diferenca)} por atendimento. A margem efetiva neste preço, já descontando as
        taxas, fica em {formatPercent(result.margemEfetiva)}.
      </p>
    </div>
  );
}
