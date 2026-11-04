import { describe, expect, it } from 'vitest';
import {
  INTERVALO_COLETA_MS,
  TABELA_DEPENDENCIAS_PROFISSOES,
  criarEstoqueInicial,
  cumprirDeverSemanal,
  executarColetaProfissao,
  executarTrocaMercadoAtomica,
  gerarDeverSemanal,
} from './economia';
import { encerrarVotacao, registrarVotoUrna } from './votacao';
import { resolverNoiteDoCucu } from './cucu';
import {
  LIMITE_REGIAO_PRINCIPAL,
  encontrarCasaLivreMaisProxima,
  gerarPosicoesCasas,
} from '../src/vila/geradorVila';
import type { OfertaMercado, VotacaoVila } from '../src/tipos';

describe('Regras de Economia, Coleta e Mercado (Asterion)', () => {
  it('garante que nenhuma profissão produz o próprio recurso de que depende', () => {
    for (const [id, def] of Object.entries(TABELA_DEPENDENCIAS_PROFISSOES)) {
      expect(def.id).toBe(id);
      expect(def.recursoProduzido).not.toBe(def.recursoNecessario);
      expect(def.profissaoFornecedora).not.toBe(id);
    }
  });

  it('permite a primeira coleta e bloqueia coleta duplicada antes de 4 horas', () => {
    const agora = 1_700_000_000_000;
    const primeira = executarColetaProfissao({
      profissao: 'ferreiro',
      estoqueAtual: criarEstoqueInicial(),
      astrosAtuais: 10,
      ultimaColetaIso: null,
      agoraMs: agora,
    });

    expect(primeira.sucesso).toBe(true);
    expect(primeira.recurso).toBe('ferramentas');
    expect(primeira.novoEstoque.ferramentas).toBe(1);
    expect(primeira.novosAstros).toBe(15);

    // Tenta coletar novamente 1 hora depois (deve recusar)
    const segundaAntesDoTempo = executarColetaProfissao({
      profissao: 'ferreiro',
      estoqueAtual: primeira.novoEstoque,
      astrosAtuais: primeira.novosAstros,
      ultimaColetaIso: primeira.novaUltimaColetaIso,
      agoraMs: agora + 60 * 60 * 1000,
    });

    expect(segundaAntesDoTempo.sucesso).toBe(false);
    expect(segundaAntesDoTempo.novoEstoque.ferramentas).toBe(1);
    expect(segundaAntesDoTempo.novosAstros).toBe(15);

    // Coleta após 4 horas completas (deve permitir)
    const terceiraApos4h = executarColetaProfissao({
      profissao: 'ferreiro',
      estoqueAtual: primeira.novoEstoque,
      astrosAtuais: primeira.novosAstros,
      ultimaColetaIso: primeira.novaUltimaColetaIso,
      agoraMs: agora + INTERVALO_COLETA_MS + 1000,
    });

    expect(terceiraApos4h.sucesso).toBe(true);
    expect(terceiraApos4h.novoEstoque.ferramentas).toBe(2);
    expect(terceiraApos4h.novosAstros).toBe(20);
  });

  it('negocia uma ferramenta por Astros entre dois jogadores e recusa venda duplicada', () => {
    const estoqueFerreiro = { ...criarEstoqueInicial(), ferramentas: 2 };
    const estoqueFazendeiro = { ...criarEstoqueInicial(), comida: 3 };

    const oferta: OfertaMercado = {
      id: 'oferta-1',
      vendedor_id: 'morador-ferreiro',
      tipo: 'ferramentas',
      qtd: 1,
      preco: 12,
      status: 'aberta',
      comprador_id: null,
      criado_em: new Date().toISOString(),
    };

    const resultado1 = executarTrocaMercadoAtomica({
      oferta,
      vendedor: {
        morador_id: 'morador-ferreiro',
        astros: 20,
        estoque: estoqueFerreiro,
      },
      comprador: {
        morador_id: 'morador-fazendeiro',
        astros: 30,
        estoque: estoqueFazendeiro,
      },
    });

    expect(resultado1.sucesso).toBe(true);
    expect(resultado1.ofertaAtualizada.status).toBe('concluida');
    expect(resultado1.vendedor.astros).toBe(32);
    expect(resultado1.vendedor.estoque.ferramentas).toBe(1);
    expect(resultado1.comprador.astros).toBe(18);
    expect(resultado1.comprador.estoque.ferramentas).toBe(1);

    // Tentativa de compra duplicada na mesma oferta já concluída
    const resultadoDuplicado = executarTrocaMercadoAtomica({
      oferta: resultado1.ofertaAtualizada,
      vendedor: resultado1.vendedor,
      comprador: {
        morador_id: 'outro-comprador',
        astros: 50,
        estoque: criarEstoqueInicial(),
      },
    });

    expect(resultadoDuplicado.sucesso).toBe(false);
    expect(resultadoDuplicado.erro).toContain('duplicada');
    expect(resultadoDuplicado.vendedor.astros).toBe(32);
    expect(resultadoDuplicado.vendedor.estoque.ferramentas).toBe(1);
  });

  it('cumpre dever semanal consumindo recurso de outra profissão e evolui nível', () => {
    const dever = gerarDeverSemanal('m-1', 'fazendeiro', 1);
    expect(dever.recurso_necessario).toBe('ferramentas');

    const semFerramenta = cumprirDeverSemanal({
      dever,
      estoque: criarEstoqueInicial(),
      astros: 10,
      nivel: { morador_id: 'm-1', xp: 0, titulo: 'Aprendiz' },
    });
    expect(semFerramenta.sucesso).toBe(false);

    const comFerramenta = cumprirDeverSemanal({
      dever,
      estoque: { ...criarEstoqueInicial(), ferramentas: 1 },
      astros: 10,
      nivel: { morador_id: 'm-1', xp: 0, titulo: 'Aprendiz' },
    });
    expect(comFerramenta.sucesso).toBe(true);
    expect(comFerramenta.estoque.ferramentas).toBe(0);
    expect(comFerramenta.nivel.xp).toBe(65);
    expect(comFerramenta.nivel.titulo).toBe('Artífice');
  });
});

describe('Regras de Votação na Urna e Eventos', () => {
  it('aceita 1 voto por morador e recusa voto repetido na mesma votação', () => {
    const votacao: VotacaoVila = {
      id: 'vot-1',
      pergunta: 'Qual deve ser a próxima grande obra de Asterion?',
      opcoes: ['Muralha de Pedra', 'Farol da Ilha Norte', 'Grande Biblioteca'],
      abre_em: new Date(Date.now() - 3600_000).toISOString(),
      fecha_em: new Date(Date.now() + 3600_000).toISOString(),
      vencedora: null,
    };

    const primeiroVoto = registrarVotoUrna({
      votacao,
      votosAtuais: [],
      moradorId: 'morador-1',
      opcaoEscolhida: 'Muralha de Pedra',
    });

    expect(primeiroVoto.sucesso).toBe(true);
    expect(primeiroVoto.contagem['Muralha de Pedra']).toBe(1);

    const votoRepetido = registrarVotoUrna({
      votacao,
      votosAtuais: primeiroVoto.votosRegistrados,
      moradorId: 'morador-1',
      opcaoEscolhida: 'Farol da Ilha Norte',
    });

    expect(votoRepetido.sucesso).toBe(false);
    expect(votoRepetido.votosRegistrados).toHaveLength(1);

    const encerrada = encerrarVotacao(votacao, primeiroVoto.votosRegistrados);
    expect(encerrada.vencedora).toBe('Muralha de Pedra');
  });

  it('registra evento da Noite do Cucu quando proteção é menor que ameaça', () => {
    const resultado = resolverNoiteDoCucu({
      dia: 12,
      moradores: [
        {
          id: '1',
          user_id: null,
          nome: 'Bruno',
          arroba: 'mundoasterion',
          profissao: 'ferreiro',
          casa_idx: 0,
          regiao: 0,
          cor_parede: '#f2ead8',
          cor_telhado: '#e2552e',
          fundador: true,
          segue_verificado: true,
          criado_em: new Date().toISOString(),
        },
      ],
      muralhaConstruida: false,
      protecaoMagicaExtra: 0,
    });

    expect(resultado.vilaProtegida).toBe(false);
    expect(resultado.casaAssustadaIdx).toBe(0);
    expect(resultado.evento.tipo).toBe('noite_cucu');
  });

  it('gera layout determinístico com Ilha Norte a partir de 790 moradores e vizinho mais próximo', () => {
    const posA = gerarPosicoesCasas(800, 421337);
    const posB = gerarPosicoesCasas(800, 421337);
    expect(posA).toEqual(posB);
    expect(posA[0].regiao).toBe(0);
    expect(posA[LIMITE_REGIAO_PRINCIPAL - 1].regiao).toBe(0);
    expect(posA[LIMITE_REGIAO_PRINCIPAL].regiao).toBe(1);

    const ocupadas = new Set<number>([0, 1, 2]);
    const livreMaisProxima = encontrarCasaLivreMaisProxima(0, ocupadas, 50, 421337);
    expect(ocupadas.has(livreMaisProxima.casa_idx)).toBe(false);
  });
});
