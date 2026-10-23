/**
 * Precificação do Método Essence, em centavos.
 *
 * A remuneração do tempo (pró-labore) entra no custo, junto com material e
 * despesas fixas. A margem de lucro é aplicada depois, por cima desse custo:
 * preço = custo / (1 − taxas − margem).
 */

export const LIMITS = {
  moneyMax: 1_000_000_000,
  hoursMax: 744,
  percentMax: 100,
  discountMax: 50,
} as const;

export type PricingFields = {
  custoMaterial: number | null;
  custoFixo: number | null;
  taxasVariaveis: number | null;
  margemLucro: number | null;
  remuneracaoDesejada: number | null;
  horasProdutivas: number | null;
  tempoProcedimento: number | null;
  percentualDesconto: number | null;
};

export type CompletePricingInput = {
  [Key in keyof PricingFields]: number;
};

export const EXAMPLE_INPUT: CompletePricingInput = {
  custoMaterial: 20,
  custoFixo: 25,
  taxasVariaveis: 8,
  margemLucro: 20,
  remuneracaoDesejada: 4000,
  horasProdutivas: 100,
  tempoProcedimento: 1,
  percentualDesconto: 0,
};

export type PricingErrorCode = 'campos' | 'horas_produtivas' | 'divisor_inviavel' | 'resultado_invalido';

export type PricingError = {
  code: PricingErrorCode;
  message: string;
};

export type PricingFailure = {
  ok: false;
  errors: PricingError[];
};

export type PricingSuccess = {
  ok: true;
  horaTecnica: number;
  remuneracaoTempo: number;
  custoMaterial: number;
  custoFixo: number;
  custoTotalAtendimento: number;
  taxasValor: number;
  lucroValor: number;
  precoSugerido: number;
  precoComDesconto: number;
  diferenca: number;
  temDesconto: boolean;
  abaixoDoCusto: boolean;
  margemEfetivaNegativa: boolean;
  margemEfetiva: number | null;
  taxasMaisMargem: number;
};

export type PricingResult = PricingSuccess | PricingFailure;

const FIELD_KEYS = Object.keys(EXAMPLE_INPUT) as (keyof PricingFields)[];

export function isCompletePricingInput(value: unknown): value is CompletePricingInput {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return FIELD_KEYS.every((key) => typeof record[key] === 'number' && Number.isFinite(record[key]));
}

export type NumberDraft = number | null | 'partial';

/** Lê o que a pessoa digitou. Não devolve NaN. Negativo volta como número para o campo limitar no estado. */
export function readNumberInput(raw: string): NumberDraft {
  const trimmed = raw.trim().replace(/\s+/g, '').replace(',', '.');
  if (trimmed === '') return null;
  if (!/^-?\d*\.?\d+$/.test(trimmed)) return 'partial';
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'partial';
  return value;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('valor não finito');
  }
  return Math.min(max, Math.max(min, value));
}

function reais(cents: number): number {
  return cents / 100;
}

function percentPoints(value: number): number {
  return Math.round(value * 100);
}

export function calculatePricing(input: PricingFields): PricingResult {
  const errors: PricingError[] = [];

  const horas = input.horasProdutivas;
  if (horas === null || !Number.isFinite(horas) || horas <= 0 || horas > LIMITS.hoursMax) {
    errors.push({
      code: 'horas_produtivas',
      message:
        'Informe as horas produtivas do mês, maiores que zero. Um campo vazio ou zerado não é substituído por 1.',
    });
  }

  const invalid = FIELD_KEYS.some((key) => {
    if (key === 'horasProdutivas') return false;
    const value = input[key];
    if (value === null || !Number.isFinite(value) || value < 0) return true;
    if (key === 'taxasVariaveis' || key === 'margemLucro') return value > LIMITS.percentMax;
    if (key === 'percentualDesconto') return value > LIMITS.discountMax;
    if (key === 'tempoProcedimento') return value > LIMITS.hoursMax;
    return value > LIMITS.moneyMax;
  });

  if (invalid) {
    errors.push({
      code: 'campos',
      message: 'Preencha todos os campos com números válidos, sem negativos e dentro dos limites.',
    });
  }

  const taxas = input.taxasVariaveis;
  const margem = input.margemLucro;
  let taxasMaisMargem: number | null = null;
  if (taxas !== null && margem !== null && Number.isFinite(taxas) && Number.isFinite(margem)) {
    const somaBp = percentPoints(taxas) + percentPoints(margem);
    taxasMaisMargem = somaBp / 100;
    if (somaBp >= 10_000) {
      errors.push({
        code: 'divisor_inviavel',
        message: `Taxas e margem somam ${taxasMaisMargem.toLocaleString('pt-BR', {
          maximumFractionDigits: 2,
        })}%. Com 100% ou mais, a fórmula é inviável. Ajuste os percentuais — o custo bruto não será apresentado como preço sugerido.`,
      });
    }
  }

  if (errors.length > 0 || taxasMaisMargem === null) {
    return { ok: false, errors };
  }

  const horasValor = input.horasProdutivas;
  const tempo = input.tempoProcedimento;
  const remuneracao = input.remuneracaoDesejada;
  const material = input.custoMaterial;
  const fixo = input.custoFixo;
  const desconto = input.percentualDesconto;
  if (
    horasValor === null ||
    tempo === null ||
    remuneracao === null ||
    material === null ||
    fixo === null ||
    desconto === null ||
    taxas === null ||
    margem === null
  ) {
    return {
      ok: false,
      errors: [
        {
          code: 'campos',
          message: 'Preencha todos os campos com números válidos, sem negativos e dentro dos limites.',
        },
      ],
    };
  }

  const taxasBp = percentPoints(taxas);
  const margemBp = percentPoints(margem);
  const descontoBp = percentPoints(desconto);
  const remCents = Math.round(remuneracao * 100);
  const materialCents = Math.round(material * 100);
  const fixoCents = Math.round(fixo * 100);
  const prolaboreCents = Math.round((remCents * tempo) / horasValor);
  const horaCents = Math.round(remCents / horasValor);
  const custoCents = materialCents + fixoCents + prolaboreCents;
  const divisorBp = 10_000 - taxasBp - margemBp;
  const precoCents = Math.round((custoCents * 10_000) / divisorBp);
  const descontoCents = Math.round((precoCents * (10_000 - descontoBp)) / 10_000);
  const taxasCents = Math.round((precoCents * taxasBp) / 10_000);
  const lucroCents = precoCents - custoCents - taxasCents;

  const finite =
    [prolaboreCents, horaCents, custoCents, precoCents, descontoCents, taxasCents, lucroCents].every((cents) =>
      Number.isSafeInteger(cents),
    ) && divisorBp > 0;

  if (!finite) {
    return {
      ok: false,
      errors: [
        {
          code: 'resultado_invalido',
          message: 'Os valores informados não produzem um preço finito. Reduza os números e tente de novo.',
        },
      ],
    };
  }

  const taxasNoDesconto = Math.round((descontoCents * taxasBp) / 10_000);
  const sobra = descontoCents - taxasNoDesconto - custoCents;

  return {
    ok: true,
    horaTecnica: reais(horaCents),
    remuneracaoTempo: reais(prolaboreCents),
    custoMaterial: reais(materialCents),
    custoFixo: reais(fixoCents),
    custoTotalAtendimento: reais(custoCents),
    taxasValor: reais(taxasCents),
    lucroValor: reais(lucroCents),
    precoSugerido: reais(precoCents),
    precoComDesconto: reais(descontoCents),
    diferenca: reais(precoCents - descontoCents),
    temDesconto: descontoBp > 0,
    abaixoDoCusto: descontoCents < custoCents,
    margemEfetivaNegativa: sobra < 0,
    margemEfetiva: descontoCents > 0 ? sobra / descontoCents : null,
    taxasMaisMargem,
  };
}

export function formatBRL(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatPercent(fraction: number | null): string {
  if (fraction === null || !Number.isFinite(fraction)) return '—';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(fraction);
}

export function findError(result: PricingFailure, code: PricingErrorCode): string | null {
  return result.errors.find((error) => error.code === code)?.message ?? null;
}
