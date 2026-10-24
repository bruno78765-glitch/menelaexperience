import { test } from 'node:test';
import { equal, ok } from 'node:assert/strict';
import { ANATOMIA_LEGENDA, MODELOS_CARROSSEL, ROTEIROS_REEL } from '../data/estudio.ts';
import { CLARA_PASSOS } from '../data/clara.ts';
import { personalizarTexto, personalizarValor } from './nicho.ts';

test('os marcadores saem da tela com o nicho da mentorada', () => {
  const texto = personalizarTexto(
    'Viver de [nicho] e de {nicho}, sem [obstáculo comum], do [ponto A] ao [ponto B].',
    'decoração',
  );
  equal(texto.includes('['), false);
  equal(texto.includes('{nicho}'), false);
  ok(texto.includes('decoração'));
  ok(texto.includes('ponto de partida'));
  ok(texto.includes('o resultado'));
});

test('roteiros, carrosséis, legendas e o exemplo C.L.A.R.A. ficam sem marcador', () => {
  const pronto = personalizarValor({ ROTEIROS_REEL, MODELOS_CARROSSEL, ANATOMIA_LEGENDA, CLARA_PASSOS }, 'decoração');
  const serializado = JSON.stringify(pronto);
  equal(serializado.includes('{nicho}'), false);
  equal(serializado.includes('[nicho]'), false);
  equal(serializado.includes('[ponto'), false);
  ok(serializado.includes('decoração'));
});
