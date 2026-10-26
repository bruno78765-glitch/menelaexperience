function substituicoes(): RegExp[] {
  return [
    /\[nicho\]|\{nicho\}/gi,
    /\[ação do nicho\]|\[acao do nicho\]/gi,
    /\[obstáculo comum\]|\[obstaculo comum\]/gi,
    /\[ponto A\]/gi,
    /\[ponto B\]/gi,
  ];
}

function valorDe(padrao: RegExp, nicho: string): string {
  const fonte = padrao.source;
  if (fonte.includes('obst')) return 'a falta de um sistema';
  if (fonte.includes('ponto A')) return 'o ponto de partida';
  if (fonte.includes('ponto B')) return 'o resultado';
  return nicho;
}

export function personalizarValor<T>(valor: T, nicho: string): T {
  if (typeof valor === 'string') return personalizarTexto(valor, nicho) as T;
  if (Array.isArray(valor)) return valor.map((item) => personalizarValor(item, nicho)) as T;
  if (valor && typeof valor === 'object') {
    const saida: Record<string, unknown> = {};
    for (const [chave, item] of Object.entries(valor)) {
      saida[chave] = personalizarValor(item, nicho);
    }
    return saida as T;
  }
  return valor;
}

/** Troca os marcadores de nicho pelo texto da mentorada, sem deixar colchetes na tela. */
export function personalizarTexto(texto: string, nicho: string): string {
  const nome = nicho.trim() || 'seu nicho';
  return substituicoes().reduce(
    (atual, padrao) => atual.replace(padrao, () => valorDe(padrao, nome)),
    texto,
  );
}
