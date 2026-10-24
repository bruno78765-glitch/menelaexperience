export interface ObjeçãoCaso {
  id: string;
  fala: string;
  contexto: string;
  emocao: string;
  respostaIdeal: ClaraResposta;
}

export interface ClaraResposta {
  compreenda: string;
  ligue: string;
  apresente: string;
  responda: string;
  avance: string;
}

export const CLARA_PASSOS = [
  {
    letra: 'C',
    nome: 'Compreenda',
    cor: '#D9B07E',
    descricao:
      'Escute de verdade e valide o sentimento antes de qualquer defesa. A aluna precisa sentir que você entendeu.',
    exemplo: '“Entendo. Faz todo sentido pensar assim.”',
  },
  {
    letra: 'L',
    nome: 'Ligue',
    cor: '#E2C39A',
    descricao:
      'Conecte a objeção ao que ela realmente quer. O preço não é sobre o valor de tabela, é sobre a meta dela.',
    exemplo:
      '“Você está comparando porque quer garantir que o investimento sirva ao seu objetivo, né?”',
  },
  {
    letra: 'A',
    nome: 'Apresente',
    cor: '#C85A80',
    descricao:
      'Mostre o valor real do método: o que muda, o sistema completo e o que está incluído.',
    exemplo:
      '“O que você leva é o sistema completo de {nicho}, com acompanhamento, não só o acesso.”',
  },
  {
    letra: 'R',
    nome: 'Responda',
    cor: '#B33C62',
    descricao:
      'Responda à objeção específica com clareza, sem se justificar demais e sem dar desconto.',
    exemplo:
      '“O valor reflete o acompanhamento humanizado. Um curso pronto não entrega isso.”',
  },
  {
    letra: 'A',
    nome: 'Avance',
    cor: '#D9B07E',
    descricao:
      'Conduza para o próximo passo com uma pergunta aberta. Nunca force, apenas abra a porta.',
    exemplo:
      '“Quer que eu te mostre como isso se encaixa na sua meta de faturamento?”',
  },
] as const;

export const CASOS_OBJECAO: ObjeçãoCaso[] = [
  {
    id: 'caro',
    fala: 'Está caro, não tenho esse orçamento agora.',
    contexto: 'A aluna ouviu o preço e travou no valor absoluto.',
    emocao: 'Medo de gastar errado e insegurança financeira.',
    respostaIdeal: {
      compreenda:
        '“Entendo. É normal respirar fundo quando se vê um investimento assim.”',
      ligue:
        '“Você quer ter certeza de que esse valor volta para você de verdade, não é? Faz sentido.”',
      apresente:
        '“O Método Essência não é um curso solto. É diagnóstico, calendário editorial, estúdio de conteúdo e treinador de vendas, com acompanhamento. Você sai com um plano de 30 dias pronto para rodar.”',
      responda:
        '“O valor reflete o acompanhamento humanizado e o método validado. Um curso pronto não dá o retorno que você precisa nos primeiros 30 dias.”',
      avance:
        '“Quer que eu te mostre quantas vendas você precisa fazer para esse investimento voltar? Está mais perto do que parece.”',
    },
  },
  {
    id: 'concorrente',
    fala: 'Na concorrente é mais barato e parece a mesma coisa.',
    contexto: 'A aluna está comparando com outra mentoria ou curso.',
    emocao: 'Dúvida de diferenciação e pressão de escolha.',
    respostaIdeal: {
      compreenda: '“Faz sentido pesquisar. Eu também comparo antes de decidir.”',
      ligue: '“Você quer a opção que realmente te tira do lugar, certo?”',
      apresente:
        '“A diferença é o diagnóstico do seu negócio, o calendário adaptado ao seu nicho e o treinador de vendas C.L.A.R.A. É um sistema, não um conjunto de aulas soltas.”',
      responda:
        '“O mais barato costuma entregar conteúdo, não estrutura. Você não precisa de mais conteúdo. Precisa de um plano que rode.”',
      avance:
        '“Quer que eu te mostre a diferença prática nos primeiros 7 dias? Aí você decide com clareza.”',
    },
  },
  {
    id: 'agora',
    fala: 'Vou pensar e te respondo depois.',
    contexto: 'A aluna está adiando por insegurança ou medo.',
    emocao: 'Medo de se comprometer e dúvida sobre o momento.',
    respostaIdeal: {
      compreenda: '“Claro. É uma decisão importante. Pensar é saudável.”',
      ligue: '“Você quer ter certeza de que este é o momento de investir no seu negócio, né?”',
      apresente:
        '“O método foi desenhado para quem está exatamente nesse ponto: decidir sair da improvisação. Os primeiros 30 dias já organizam a direção.”',
      responda:
        '“Continuar improvisando também custa. Cada semana parada é conteúdo e conversa que não acontecem.”',
      avance:
        '“Posso te deixar com o diagnóstico do seu negócio para você decidir com números? Leva alguns minutos.”',
    },
  },
  {
    id: 'tempo',
    fala: 'Não tenho tempo para fazer tudo isso agora.',
    contexto: 'A aluna tem a rotina cheia e teme não conseguir executar.',
    emocao: 'Sobrecarga e medo de não dar conta.',
    respostaIdeal: {
      compreenda: '“Entendo. A rotina cheia é real. Eu também vivo isso.”',
      ligue: '“Você quer algo que caiba na sua semana sem virar mais uma fonte de ansiedade, certo?”',
      apresente:
        '“O calendário tem 30 dias, e cada conteúdo parte de um roteiro pronto. Você não cria do zero. Você adapta.”',
      responda: '“A ideia não é fazer mais. É fazer no sistema certo. Menos conteúdo, mais direção.”',
      avance: '“Quer que eu te mostre como fica uma semana na sua rotina? Aí você vê se cabe.”',
    },
  },
];
