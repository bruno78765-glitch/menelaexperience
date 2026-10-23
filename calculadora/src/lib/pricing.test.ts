import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  EXAMPLE_INPUT,
  LIMITS,
  calculatePricing,
  clampNumber,
  formatBRL,
  formatPercent,
  readNumberInput,
  type PricingFields,
} from './pricing.ts';

function withInput(patch: Partial<PricingFields>): PricingFields {
  return { ...EXAMPLE_INPUT, ...patch };
}

test('defaults do Método Essence fecham em R$ 118,06', () => {
  const result = calculatePricing(EXAMPLE_INPUT);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.horaTecnica, 40);
  assert.equal(result.remuneracaoTempo, 40);
  assert.equal(result.custoTotalAtendimento, 85);
  assert.equal(result.precoSugerido, 118.06);
  assert.equal(result.precoComDesconto, 118.06);
  assert.equal(result.abaixoDoCusto, false);
  assert.match(formatBRL(result.precoSugerido).replace(/\u00a0/g, ' '), /R\$\s118,06/);
  assert.equal(
    Math.round((result.custoMaterial + result.custoFixo + result.remuneracaoTempo) * 100),
    Math.round(result.custoTotalAtendimento * 100),
  );
  assert.equal(
    Math.round((result.custoTotalAtendimento + result.taxasValor + result.lucroValor) * 100),
    Math.round(result.precoSugerido * 100),
  );
});

test('taxas + margem >= 100 não devolve o custo como preço', () => {
  const result = calculatePricing(withInput({ taxasVariaveis: 80, margemLucro: 20 }));
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(
    result.errors.some((error) => error.code === 'divisor_inviavel'),
    true,
  );
  assert.equal('precoSugerido' in result, false);
  assert.equal(JSON.stringify(result).includes('85'), false);
});

test('desconto de 50% nos defaults fica abaixo do custo e mostra margem efetiva', () => {
  const result = calculatePricing(withInput({ percentualDesconto: 50 }));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.precoComDesconto, 59.03);
  assert.equal(result.abaixoDoCusto, true);
  assert.equal(result.margemEfetivaNegativa, true);
  assert.ok(result.margemEfetiva !== null && result.margemEfetiva < 0);
  assert.match(formatPercent(result.margemEfetiva), /-52,0%/);
});

test('desconto de 10% permanece acima do custo com margem efetiva de 12%', () => {
  const result = calculatePricing(withInput({ percentualDesconto: 10 }));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.abaixoDoCusto, false);
  assert.equal(result.margemEfetivaNegativa, false);
  assert.equal(result.margemEfetiva, 0.12);
  assert.equal(formatPercent(result.margemEfetiva), '12,0%');
});

test('horas produtivas 0 não vira 1 e não infla a hora técnica', () => {
  const result = calculatePricing(withInput({ horasProdutivas: 0 }));
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(
    result.errors.some((error) => error.code === 'horas_produtivas'),
    true,
  );
  assert.equal('horaTecnica' in result, false);
  assert.equal(JSON.stringify(result).includes('4000'), false);
});

test('horas produtivas vazias também são erro', () => {
  const result = calculatePricing(withInput({ horasProdutivas: null }));
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.errors.some((error) => error.code === 'horas_produtivas'));
});

test('NaN, negativo e percentual acima do limite não geram preço', () => {
  for (const input of [
    withInput({ custoMaterial: Number.NaN }),
    withInput({ custoFixo: -10 }),
    withInput({ taxasVariaveis: 150 }),
    withInput({ percentualDesconto: 80 }),
    withInput({ remuneracaoDesejada: null }),
  ]) {
    const result = calculatePricing(input);
    assert.equal(result.ok, false);
    assert.equal('precoSugerido' in result, false);
  }
  assert.equal(formatBRL(Number.NaN), '—');
  assert.equal(formatPercent(Number.POSITIVE_INFINITY), '—');
});

test('estado numérico corta negativos e percentuais fora da faixa', () => {
  assert.equal(readNumberInput(''), null);
  assert.equal(readNumberInput('   '), null);
  assert.equal(readNumberInput('abc'), 'partial');
  assert.equal(readNumberInput('NaN'), 'partial');
  assert.equal(readNumberInput('1,5'), 1.5);
  assert.equal(readNumberInput('-4'), -4);
  assert.equal(clampNumber(-4, 0, LIMITS.moneyMax), 0);
  assert.equal(clampNumber(150, 0, 100), 100);
  assert.equal(clampNumber(80, 0, 50), 50);
  assert.throws(() => clampNumber(Number.NaN, 0, 10));
});
