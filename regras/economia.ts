import type {
  DeverSemanal,
  EstoqueRecursos,
  NivelMorador,
  OfertaMercado,
  ProfissaoId,
  RecursoTipo,
  TituloNivel,
} from '../src/tipos';

export const INTERVALO_COLETA_MS = 4 * 60 * 60 * 1000; // 4 horas
export const RECOMPENSA_ASTROS_COLETA = 5;

export interface DefinicaoProfissao {
  id: ProfissaoId;
  nome: string;
  recursoProduzido: RecursoTipo;
  nomeRecursoProduzido: string;
  recursoNecessario: RecursoTipo;
  profissaoFornecedora: ProfissaoId;
  objetoPorta: string;
  deverTipo: 'entrega_obra' | 'ronda_noturna' | 'protecao_vila';
  deverDescricao: string;
}

/**
 * Tabela de dependências econômicas entre profissões:
 * Ninguém produz tudo sozinho; cada profissão depende do recurso de outra.
 */
export const TABELA_DEPENDENCIAS_PROFISSOES: Record<ProfissaoId, DefinicaoProfissao> = {
  ferreiro: {
    id: 'ferreiro',
    nome: 'Ferreiro',
    recursoProduzido: 'ferramentas',
    nomeRecursoProduzido: 'Ferramentas',
    recursoNecessario: 'comida',
    profissaoFornecedora: 'fazendeiro',
    objetoPorta: 'Bigorna',
    deverTipo: 'entrega_obra',
    deverDescricao: 'Forjar ferramentas e consumir 1 Comida para manter a forja acesa',
  },
  fazendeiro: {
    id: 'fazendeiro',
    nome: 'Fazendeiro',
    recursoProduzido: 'comida',
    nomeRecursoProduzido: 'Comida',
    recursoNecessario: 'ferramentas',
    profissaoFornecedora: 'ferreiro',
    objetoPorta: 'Horta',
    deverTipo: 'entrega_obra',
    deverDescricao: 'Colher safra usando 1 Ferramenta do Ferreiro para abastecer a vila',
  },
  lenhador: {
    id: 'lenhador',
    nome: 'Lenhador',
    recursoProduzido: 'madeira',
    nomeRecursoProduzido: 'Madeira',
    recursoNecessario: 'ferramentas',
    profissaoFornecedora: 'ferreiro',
    objetoPorta: 'Machado',
    deverTipo: 'entrega_obra',
    deverDescricao: 'Cortar lenha para a fogueira e obra usando 1 Ferramenta afiada',
  },
  costureira: {
    id: 'costureira',
    nome: 'Costureira',
    recursoProduzido: 'tecido',
    nomeRecursoProduzido: 'Tecido',
    recursoNecessario: 'madeira',
    profissaoFornecedora: 'lenhador',
    objetoPorta: 'Varal',
    deverTipo: 'entrega_obra',
    deverDescricao: 'Tecer mantos e bandeiras da vila usando 1 Madeira no tear',
  },
  bardo: {
    id: 'bardo',
    nome: 'Bardo',
    recursoProduzido: 'alegria',
    nomeRecursoProduzido: 'Alegria',
    recursoNecessario: 'tecido',
    profissaoFornecedora: 'costureira',
    objetoPorta: 'Alaúde',
    deverTipo: 'ronda_noturna',
    deverDescricao: 'Cantar na fogueira central vestindo 1 Tecido novo para animar a ronda',
  },
  mago: {
    id: 'mago',
    nome: 'Mago',
    recursoProduzido: 'protecao',
    nomeRecursoProduzido: 'Proteção',
    recursoNecessario: 'alegria',
    profissaoFornecedora: 'bardo',
    objetoPorta: 'Cajado',
    deverTipo: 'protecao_vila',
    deverDescricao: 'Renovar runas contra o Cucu canalizando 1 Alegria do Bardo',
  },
  mercador: {
    id: 'mercador',
    nome: 'Mercador',
    recursoProduzido: 'moedas',
    nomeRecursoProduzido: 'Moedas',
    recursoNecessario: 'protecao',
    profissaoFornecedora: 'mago',
    objetoPorta: 'Baú de Moedas',
    deverTipo: 'ronda_noturna',
    deverDescricao: 'Escoltar caravanas da ponte com 1 Proteção mágica do Mago',
  },
};

export const NOMES_RECURSOS: Record<RecursoTipo, string> = {
  ferramentas: 'Ferramentas',
  comida: 'Comida',
  madeira: 'Madeira',
  alegria: 'Alegria',
  protecao: 'Proteção',
  tecido: 'Tecido',
  moedas: 'Moedas',
};

export function criarEstoqueInicial(): EstoqueRecursos {
  return {
    ferramentas: 0,
    comida: 0,
    madeira: 0,
    alegria: 0,
    protecao: 0,
    tecido: 0,
    moedas: 0,
  };
}

export function podeColetarRecurso(
  ultimaColetaIso: string | null | undefined,
  agoraMs = Date.now()
): { permitido: boolean; restanteMs: number } {
  if (!ultimaColetaIso) {
    return { permitido: true, restanteMs: 0 };
  }
  const ultimaMs = new Date(ultimaColetaIso).getTime();
  if (Number.isNaN(ultimaMs)) {
    return { permitido: true, restanteMs: 0 };
  }
  const decorrido = agoraMs - ultimaMs;
  if (decorrido >= INTERVALO_COLETA_MS) {
    return { permitido: true, restanteMs: 0 };
  }
  return {
    permitido: false,
    restanteMs: INTERVALO_COLETA_MS - decorrido,
  };
}

export interface ResultadoColeta {
  sucesso: boolean;
  erro?: string;
  recurso?: RecursoTipo;
  qtdAdicionada?: number;
  astrosGanhos?: number;
  novoEstoque: EstoqueRecursos;
  novosAstros: number;
  novaUltimaColetaIso: string | null;
}

export function executarColetaProfissao(params: {
  profissao: ProfissaoId;
  estoqueAtual: EstoqueRecursos;
  astrosAtuais: number;
  ultimaColetaIso: string | null | undefined;
  agoraMs?: number;
}): ResultadoColeta {
  const agora = params.agoraMs ?? Date.now();
  const verificacao = podeColetarRecurso(params.ultimaColetaIso, agora);

  if (!verificacao.permitido) {
    const minutosRestantes = Math.ceil(verificacao.restanteMs / 60000);
    return {
      sucesso: false,
      erro: `Coleta em recarga. Aguarde mais ${minutosRestantes} min para coletar novamente.`,
      novoEstoque: { ...params.estoqueAtual },
      novosAstros: params.astrosAtuais,
      novaUltimaColetaIso: params.ultimaColetaIso ?? null,
    };
  }

  const def = TABELA_DEPENDENCIAS_PROFISSOES[params.profissao];
  const recurso = def.recursoProduzido;
  const novoEstoque: EstoqueRecursos = {
    ...params.estoqueAtual,
    [recurso]: (params.estoqueAtual[recurso] ?? 0) + 1,
  };

  return {
    sucesso: true,
    recurso,
    qtdAdicionada: 1,
    astrosGanhos: RECOMPENSA_ASTROS_COLETA,
    novoEstoque,
    novosAstros: params.astrosAtuais + RECOMPENSA_ASTROS_COLETA,
    novaUltimaColetaIso: new Date(agora).toISOString(),
  };
}

export interface EstadoJogadorTroca {
  morador_id: string;
  astros: number;
  estoque: EstoqueRecursos;
}

export interface ResultadoTrocaMercado {
  sucesso: boolean;
  erro?: string;
  ofertaAtualizada: OfertaMercado;
  vendedor: EstadoJogadorTroca;
  comprador: EstadoJogadorTroca;
}

/**
 * Executa a compra atômica de uma oferta do mercado entre dois moradores em Astros.
 * Recusa vendas duplicadas (status !== 'aberta'), auto-compra ou saldo insuficiente.
 */
export function executarTrocaMercadoAtomica(params: {
  oferta: OfertaMercado;
  vendedor: EstadoJogadorTroca;
  comprador: EstadoJogadorTroca;
}): ResultadoTrocaMercado {
  const { oferta, vendedor, comprador } = params;

  if (oferta.status !== 'aberta') {
    return {
      sucesso: false,
      erro: 'Esta oferta já foi concluída ou cancelada (venda duplicada recusada).',
      ofertaAtualizada: { ...oferta },
      vendedor: { ...vendedor, estoque: { ...vendedor.estoque } },
      comprador: { ...comprador, estoque: { ...comprador.estoque } },
    };
  }

  if (vendedor.morador_id === comprador.morador_id) {
    return {
      sucesso: false,
      erro: 'Você não pode comprar a própria oferta.',
      ofertaAtualizada: { ...oferta },
      vendedor: { ...vendedor, estoque: { ...vendedor.estoque } },
      comprador: { ...comprador, estoque: { ...comprador.estoque } },
    };
  }

  if (oferta.qtd <= 0 || oferta.preco <= 0) {
    return {
      sucesso: false,
      erro: 'Quantidade ou preço inválido na oferta.',
      ofertaAtualizada: { ...oferta },
      vendedor: { ...vendedor, estoque: { ...vendedor.estoque } },
      comprador: { ...comprador, estoque: { ...comprador.estoque } },
    };
  }

  if ((vendedor.estoque[oferta.tipo] ?? 0) < oferta.qtd) {
    return {
      sucesso: false,
      erro: 'O vendedor não possui estoque suficiente para concluir a oferta.',
      ofertaAtualizada: { ...oferta },
      vendedor: { ...vendedor, estoque: { ...vendedor.estoque } },
      comprador: { ...comprador, estoque: { ...comprador.estoque } },
    };
  }

  if (comprador.astros < oferta.preco) {
    return {
      sucesso: false,
      erro: 'Saldo de Astros insuficiente para comprar esta oferta.',
      ofertaAtualizada: { ...oferta },
      vendedor: { ...vendedor, estoque: { ...vendedor.estoque } },
      comprador: { ...comprador, estoque: { ...comprador.estoque } },
    };
  }

  const novoEstoqueVendedor: EstoqueRecursos = {
    ...vendedor.estoque,
    [oferta.tipo]: vendedor.estoque[oferta.tipo] - oferta.qtd,
  };

  const novoEstoqueComprador: EstoqueRecursos = {
    ...comprador.estoque,
    [oferta.tipo]: (comprador.estoque[oferta.tipo] ?? 0) + oferta.qtd,
  };

  const ofertaAtualizada: OfertaMercado = {
    ...oferta,
    status: 'concluida',
    comprador_id: comprador.morador_id,
  };

  return {
    sucesso: true,
    ofertaAtualizada,
    vendedor: {
      morador_id: vendedor.morador_id,
      astros: vendedor.astros + oferta.preco,
      estoque: novoEstoqueVendedor,
    },
    comprador: {
      morador_id: comprador.morador_id,
      astros: comprador.astros - oferta.preco,
      estoque: novoEstoqueComprador,
    },
  };
}

export function calcularTituloPorXp(xp: number): TituloNivel {
  if (xp >= 300) return 'Mestre';
  if (xp >= 160) return 'Veterano';
  if (xp >= 60) return 'Artífice';
  return 'Aprendiz';
}

export function gerarDeverSemanal(
  moradorId: string,
  profissao: ProfissaoId,
  semana: number
): DeverSemanal {
  const def = TABELA_DEPENDENCIAS_PROFISSOES[profissao];
  return {
    morador_id: moradorId,
    semana,
    tipo: def.deverTipo,
    descricao: def.deverDescricao,
    recurso_necessario: def.recursoNecessario,
    qtd_necessaria: 1,
    recompensa_astros: 15,
    recompensa_xp: 65,
    cumprido: false,
  };
}

export function cumprirDeverSemanal(params: {
  dever: DeverSemanal;
  estoque: EstoqueRecursos;
  astros: number;
  nivel: NivelMorador;
}): {
  sucesso: boolean;
  erro?: string;
  dever: DeverSemanal;
  estoque: EstoqueRecursos;
  astros: number;
  nivel: NivelMorador;
} {
  const { dever, estoque, astros, nivel } = params;
  if (dever.cumprido) {
    return {
      sucesso: false,
      erro: 'Dever semanal já foi cumprido nesta semana.',
      dever,
      estoque,
      astros,
      nivel,
    };
  }

  const disponivel = estoque[dever.recurso_necessario] ?? 0;
  if (disponivel < dever.qtd_necessaria) {
    return {
      sucesso: false,
      erro: `Você precisa de ${dever.qtd_necessaria}x ${NOMES_RECURSOS[dever.recurso_necessario]} (negocie no Mercado da Vila!).`,
      dever,
      estoque,
      astros,
      nivel,
    };
  }

  const novoEstoque: EstoqueRecursos = {
    ...estoque,
    [dever.recurso_necessario]: disponivel - dever.qtd_necessaria,
  };
  const novoXp = nivel.xp + dever.recompensa_xp;
  const novoNivel: NivelMorador = {
    morador_id: nivel.morador_id,
    xp: novoXp,
    titulo: calcularTituloPorXp(novoXp),
  };

  return {
    sucesso: true,
    dever: { ...dever, cumprido: true },
    estoque: novoEstoque,
    astros: astros + dever.recompensa_astros,
    nivel: novoNivel,
  };
}
