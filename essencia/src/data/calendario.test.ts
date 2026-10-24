import { test } from 'node:test';
import { equal, ok } from 'node:assert/strict';
import { gerarCalendario } from './calendario.ts';

test('os 30 dias têm temas e ganchos diferentes e sem placeholder', () => {
  const dias = gerarCalendario('decoração minimalista');
  equal(dias.length, 30);
  equal(new Set(dias.map((dia) => dia.tema)).size, 30);
  equal(new Set(dias.map((dia) => dia.gancho)).size, 30);
  const serializado = JSON.stringify(dias);
  equal(serializado.includes('travam'), false);
  equal(serializado.includes('[ponto'), false);
  equal(serializado.includes('{nicho}'), false);
  equal(serializado.includes('[nicho]'), false);
  ok(serializado.includes('decoração minimalista'));
});
