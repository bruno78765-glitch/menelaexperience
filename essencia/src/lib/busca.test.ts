import { test } from 'node:test';
import { equal } from 'node:assert/strict';
import { BASE_CONHECIMENTO } from '../data/suporte.ts';
import { buscarResposta } from './busca.ts';

function moduloDe(pergunta: string): string | null {
  return buscarResposta(pergunta, BASE_CONHECIMENTO)?.acao?.modulo ?? buscarResposta(pergunta, BASE_CONHECIMENTO)?.resposta.slice(0, 12) ?? null;
}

test('palavras curtas não vazam para dentro de outras palavras', () => {
  equal(buscarResposta('quero saber da mentoria', BASE_CONHECIMENTO), null);
  equal(buscarResposta('me explica o contexto do método', BASE_CONHECIMENTO), null);
  equal(buscarResposta('estou na metade do caminho', BASE_CONHECIMENTO), null);
  equal(moduloDe('oi, como faço o calendário?'), 'calendario');
});

test('quando dois módulos casam, vence o mais específico', () => {
  equal(buscarResposta('como editar uma legenda', BASE_CONHECIMENTO)?.resposta.includes('Legenda'), true);
  equal(buscarResposta('qual é o gancho do reel', BASE_CONHECIMENTO)?.resposta.includes('Vídeos Curtos'), true);
  equal(moduloDe('como responder está caro'), 'vendas');
});
