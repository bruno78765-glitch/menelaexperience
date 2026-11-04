import type { VotacaoVila, VotoMorador } from '../src/tipos';

export interface ResultadoVoto {
  sucesso: boolean;
  erro?: string;
  votosRegistrados: VotoMorador[];
  contagem: Record<string, number>;
}

/**
 * Registra o voto de um morador na urna em frente ao salão.
 * Garante unicidade da chave primária composta (votacao_id, morador_id).
 */
export function registrarVotoUrna(params: {
  votacao: VotacaoVila;
  votosAtuais: VotoMorador[];
  moradorId: string;
  opcaoEscolhida: string;
  agoraMs?: number;
}): ResultadoVoto {
  const { votacao, votosAtuais, moradorId, opcaoEscolhida } = params;
  const agora = params.agoraMs ?? Date.now();

  if (votacao.vencedora || agora > new Date(votacao.fecha_em).getTime()) {
    return {
      sucesso: false,
      erro: 'Esta votação já foi encerrada.',
      votosRegistrados: votosAtuais,
      contagem: apurarContagemVotos(votacao, votosAtuais),
    };
  }

  if (!votacao.opcoes.includes(opcaoEscolhida)) {
    return {
      sucesso: false,
      erro: 'Opção de voto inválida.',
      votosRegistrados: votosAtuais,
      contagem: apurarContagemVotos(votacao, votosAtuais),
    };
  }

  const jaVotou = votosAtuais.some(
    (v) => v.votacao_id === votacao.id && v.morador_id === moradorId
  );

  if (jaVotou) {
    return {
      sucesso: false,
      erro: 'Voto duplicado recusado: cada morador tem direito a apenas 1 voto por votação.',
      votosRegistrados: votosAtuais,
      contagem: apurarContagemVotos(votacao, votosAtuais),
    };
  }

  const novosVotos: VotoMorador[] = [
    ...votosAtuais,
    {
      votacao_id: votacao.id,
      morador_id: moradorId,
      opcao: opcaoEscolhida,
    },
  ];

  return {
    sucesso: true,
    votosRegistrados: novosVotos,
    contagem: apurarContagemVotos(votacao, novosVotos),
  };
}

export function apurarContagemVotos(
  votacao: VotacaoVila,
  votos: VotoMorador[]
): Record<string, number> {
  const contagem: Record<string, number> = {};
  for (const op of votacao.opcoes) {
    contagem[op] = 0;
  }
  for (const voto of votos) {
    if (voto.votacao_id === votacao.id && contagem[voto.opcao] !== undefined) {
      contagem[voto.opcao] += 1;
    }
  }
  return contagem;
}

export function encerrarVotacao(votacao: VotacaoVila, votos: VotoMorador[]): VotacaoVila {
  const contagem = apurarContagemVotos(votacao, votos);
  let vencedora = votacao.opcoes[0] ?? 'Empate';
  let maior = -1;

  for (const op of votacao.opcoes) {
    if ((contagem[op] ?? 0) > maior) {
      maior = contagem[op] ?? 0;
      vencedora = op;
    }
  }

  return {
    ...votacao,
    vencedora,
    votos_por_opcao: contagem,
  };
}
