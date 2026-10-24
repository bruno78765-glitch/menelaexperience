import { test } from 'node:test';
import { equal, ok } from 'node:assert/strict';
import {
  calcularConversao,
  interpretarDiagnostico,
  traduzirErroBanco,
  validarDiagnostico,
  type DiagnosticoNegocio,
} from './diagnostico.ts';

const base: DiagnosticoNegocio = {
  nome: 'Marina',
  nicho: 'decoração',
  metaFaturamento: 10000,
  ticketMedio: 500,
  taxaConversao: 25,
};

test('a conta padrão usa a taxa informada e separa visualização de conteúdo', () => {
  const conta = calcularConversao(base);
  ok(conta.ok);
  if (!conta.ok) return;
  equal(conta.vendasNecessarias, 20);
  equal(conta.leadsNecessarios, 80);
  equal(conta.viewsNecessarios, 1600);
  equal(conta.conteudoNecessario, 8);
  equal(conta.cabeNoCalendario, true);
});

test('zero e negativo não viram um divisor escondido', () => {
  for (const campo of ['metaFaturamento', 'ticketMedio', 'taxaConversao'] as const) {
    const conta = calcularConversao({ ...base, [campo]: 0 });
    equal(conta.ok, false);
    const negativa = calcularConversao({ ...base, [campo]: -10 });
    equal(negativa.ok, false);
  }
});

test('zero vindo do armazenamento continua zero', () => {
  const lido = interpretarDiagnostico({
    nome: 'Marina',
    nicho: 'decoração',
    metaFaturamento: 0,
    ticketMedio: '500',
    taxaConversao: 25,
  });
  equal(lido?.metaFaturamento, 0);
  equal(lido?.ticketMedio, 500);
});

test('registro sem número é descartado', () => {
  equal(interpretarDiagnostico({ nome: 'Marina', nicho: 'decoração' }), null);
});

test('nome só com espaço não passa', () => {
  ok(validarDiagnostico({ ...base, nome: '   ' }));
  equal(validarDiagnostico({ ...base, nome: '  Marina  ', nicho: '  decoração  ' }), null);
});

test('coluna user_id ausente aponta a migração', () => {
  ok(traduzirErroBanco("Could not find the 'user_id' column", 'PGRST204').includes('20261024210000'));
});
