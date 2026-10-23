import { formatBRL, type CompletePricingInput, type PricingSuccess } from './pricing.ts';

function escapeCell(value: string): string {
  if (/[;"\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toCsv(rows: string[][]): string {
  return `\uFEFF${rows.map((row) => row.map(escapeCell).join(';')).join('\r\n')}`;
}

export function calculationCsv(nome: string, input: CompletePricingInput, result: PricingSuccess): string {
  const rows: string[][] = [
    ['campo', 'valor'],
    ['procedimento', nome || 'Sem nome'],
    ['custo_material', formatBRL(result.custoMaterial)],
    ['custo_fixo', formatBRL(result.custoFixo)],
    ['remuneracao_mensal', formatBRL(input.remuneracaoDesejada)],
    ['horas_produtivas', String(input.horasProdutivas)],
    ['tempo_procedimento_horas', String(input.tempoProcedimento)],
    ['hora_tecnica', formatBRL(result.horaTecnica)],
    ['pro_labore_do_tempo', formatBRL(result.remuneracaoTempo)],
    ['custo_total', formatBRL(result.custoTotalAtendimento)],
    ['taxas_percentual', String(input.taxasVariaveis)],
    ['taxas_valor', formatBRL(result.taxasValor)],
    ['margem_desejada_percentual', String(input.margemLucro)],
    ['lucro', formatBRL(result.lucroValor)],
    ['preco_sugerido', formatBRL(result.precoSugerido)],
    ['desconto_percentual', String(input.percentualDesconto)],
    ['preco_com_desconto', formatBRL(result.precoComDesconto)],
    ['abaixo_do_custo', result.abaixoDoCusto ? 'sim' : 'nao'],
  ];
  return toCsv(rows);
}

export type HistoryCsvRow = {
  nomeProcedimento: string;
  createdAt: string;
  precoSugerido: number;
  custoTotal: number;
};

export function historyCsv(rows: HistoryCsvRow[]): string {
  return toCsv([
    ['procedimento', 'salvo_em', 'preco_sugerido', 'custo_total'],
    ...rows.map((row) => [
      row.nomeProcedimento,
      row.createdAt,
      formatBRL(row.precoSugerido),
      formatBRL(row.custoTotal),
    ]),
  ]);
}
