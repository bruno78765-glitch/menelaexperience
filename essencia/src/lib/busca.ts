export interface AcaoBot {
  label: string;
  modulo: 'dashboard' | 'calendario' | 'estudio' | 'vendas' | 'precificacao' | 'suporte';
}

export interface RespostaBot {
  palavrasChave: string[];
  resposta: string;
  acao?: AcaoBot;
}

export function normalizarBusca(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

/**
 * Escolhe a resposta com mais palavras inteiras em comum.
 * "mentoria" não aciona "mentor", e "contexto" não aciona "texto".
 */
export function buscarResposta(pergunta: string, base: readonly RespostaBot[]): RespostaBot | null {
  const normalizada = normalizarBusca(pergunta);
  const palavras = new Set(normalizada.split(/[^a-z0-9]+/).filter(Boolean));
  let melhor: { item: RespostaBot; pontos: number } | null = null;

  for (const item of base) {
    let acertos = 0;
    let peso = 0;
    for (const chave of item.palavrasChave) {
      const termo = normalizarBusca(chave);
      const casou = termo.includes(' ') ? normalizada.includes(termo) : palavras.has(termo);
      if (!casou) continue;
      acertos += 1;
      peso += termo.length;
    }
    if (acertos === 0) continue;
    const pontos = acertos * 100 + peso;
    if (!melhor || pontos > melhor.pontos) melhor = { item, pontos };
  }

  return melhor?.item ?? null;
}
