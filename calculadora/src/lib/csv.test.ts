import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculationCsv, historyCsv, toCsv } from './csv.ts';
import { EXAMPLE_INPUT, calculatePricing } from './pricing.ts';

test('csv escapa aspas e usa ponto e vírgula', () => {
  const csv = toCsv([
    ['campo', 'valor'],
    ['nome', 'Design "gold"; teste'],
  ]);
  assert.ok(csv.charCodeAt(0) === 0xfeff);
  assert.match(csv, /campo;valor/);
  assert.match(csv, /"Design ""gold""; teste"/);
});

test('exportação do cálculo traz o preço sugerido', () => {
  const result = calculatePricing(EXAMPLE_INPUT);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const csv = calculationCsv('Limpeza de pele', EXAMPLE_INPUT, result);
  assert.match(csv, /Limpeza de pele/);
  assert.match(csv, /118,06/);
  assert.match(csv, /abaixo_do_custo;nao/);
});

test('histórico em csv lista procedimento e preço', () => {
  const csv = historyCsv([
    {
      nomeProcedimento: 'Massagem',
      createdAt: '2026-10-23T18:00:00.000Z',
      precoSugerido: 118.06,
      custoTotal: 85,
    },
  ]);
  assert.match(csv, /Massagem/);
  assert.match(csv, /118,06/);
  assert.match(csv, /85,00/);
});
