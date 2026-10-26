export interface RoteiroReel {
  tipo: 'Erro Comum' | 'Dúvida Frequente' | 'Bastidores';
  cor: string;
  titulo: string;
  quandoUsar: string;
  passos: { passo: number; nome: string; instrucao: string; exemplo: string }[];
}

export const ROTEIROS_REEL: RoteiroReel[] = [
  {
    tipo: 'Erro Comum',
    cor: '#C85A80',
    titulo: 'Reel do Erro Comum',
    quandoUsar:
      'Quando você quer desconstruir uma crença que trava sua audiência e mostrar que entende a dor dela.',
    passos: [
      {
        passo: 1,
        nome: 'Gancho com pergunta real',
        instrucao: 'Abra com uma pergunta que sua aluna já ouviu ou pensou. Evite frase pronta de anúncio.',
        exemplo: '“Você também já tentou {nicho} e sentiu que nada aconteceu?”',
      },
      {
        passo: 2,
        nome: 'Explicação sem termos técnicos',
        instrucao: 'Explique por que o erro acontece de um jeito que uma pessoa leiga entenda. Sem jargão e sem enrolação.',
        exemplo: '“O problema não é você. Ninguém te mostrou a ordem certa, e o passo de {nicho} está invertido.”',
      },
      {
        passo: 3,
        nome: 'Direção prática',
        instrucao: 'Mostre o caminho em uma ou duas frases. A sensação precisa ser de entendimento.',
        exemplo: '“Comece pelo gancho com uma pergunta real, não pela sua expertise. Em {nicho}, as pessoas conectam antes de aprender.”',
      },
      {
        passo: 4,
        nome: 'Convite elegante para o WhatsApp',
        instrucao: 'Feche com um convite que não empurra. Palavra-chave e caminho claro.',
        exemplo: '“Comenta ESSÊNCIA que eu te mando o guia de {nicho} no WhatsApp.”',
      },
    ],
  },
  {
    tipo: 'Dúvida Frequente',
    cor: '#D9B07E',
    titulo: 'Reel da Dúvida Frequente',
    quandoUsar: 'Quando a mesma pergunta aparece toda semana nas suas mensagens. Isso é demanda real.',
    passos: [
      {
        passo: 1,
        nome: 'Gancho com pergunta real',
        instrucao: 'Use a pergunta que chega. Quanto mais fiel, mais a pessoa sente que é com ela.',
        exemplo: '“Essa pergunta chega toda semana: como eu começo em {nicho} sem me perder?”',
      },
      {
        passo: 2,
        nome: 'Explicação sem termos técnicos',
        instrucao: 'Responda de forma direta, como numa conversa. Uma ideia por frase.',
        exemplo: '“A resposta curta: você não precisa de mais conteúdo de {nicho}. Precisa de um sistema que escolha o que publicar.”',
      },
      {
        passo: 3,
        nome: 'Direção prática',
        instrucao: 'Dê o próximo passo pequeno o bastante para acontecer hoje.',
        exemplo: '“Hoje, escolha um pilar e publique uma vez: Educação, Autoridade, Conexão, Prova ou Convite.”',
      },
      {
        passo: 4,
        nome: 'Convite elegante para o WhatsApp',
        instrucao: 'Convide para olhar o caso dela. Ofereça, sem empurrar.',
        exemplo: '“Se quiser montar o plano de {nicho}, me chama no WhatsApp.”',
      },
    ],
  },
  {
    tipo: 'Bastidores',
    cor: '#E2C39A',
    titulo: 'Reel de Bastidores',
    quandoUsar: 'Quando você quer humanizar a marca e mostrar o processo, não só o resultado.',
    passos: [
      {
        passo: 1,
        nome: 'Gancho com pergunta real',
        instrucao: 'Comece com curiosidade. A pergunta abre a cortina melhor do que uma promessa.',
        exemplo: '“Quer ver uma produção real de conteúdo em {nicho}?”',
      },
      {
        passo: 2,
        nome: 'Explicação sem termos técnicos',
        instrucao: 'Mostre o processo com ajuste e decisão. A imperfeição conecta.',
        exemplo: '“Na segunda eu fecho os 5 pilares de {nicho}. Terça é criação. Quarta é gravação. Nada fica ao acaso.”',
      },
      {
        passo: 3,
        nome: 'Direção prática',
        instrucao: 'Termine com o aprendizado que a audiência aplica.',
        exemplo: '“Planejar antes de gravar reduz retrabalho e sobe a clareza de {nicho}.”',
      },
      {
        passo: 4,
        nome: 'Convite elegante para o WhatsApp',
        instrucao: 'Convide para ver o método de perto.',
        exemplo: '“Se quiser aplicar isso em {nicho}, me chama no WhatsApp.”',
      },
    ],
  },
];

export interface ModeloCarrossel {
  id: string;
  nome: string;
  objetivo: string;
  cor: string;
  slides: { titulo: string; conteudo: string }[];
}

export const MODELOS_CARROSSEL: ModeloCarrossel[] = [
  {
    id: 'educacional',
    nome: 'Carrossel Educacional de 7 Slides',
    objetivo: 'Gerar salvamentos e compartilhamentos ensinando um conceito.',
    cor: '#D9B07E',
    slides: [
      { titulo: 'Capa', conteudo: 'Promessa clara e o nome do conceito. Exemplo: “5 pilares para nunca ficar sem ideia em {nicho}.”' },
      { titulo: 'Slide 1', conteudo: 'O problema atual de {nicho}. Valide a dor antes de ensinar.' },
      { titulo: 'Slide 2', conteudo: 'A virada: o conceito que organiza a publicação.' },
      { titulo: 'Slide 3', conteudo: 'Educação e Autoridade, cada uma com um exemplo de {nicho}.' },
      { titulo: 'Slide 4', conteudo: 'Conexão e Prova, cada uma com um exemplo de {nicho}.' },
      { titulo: 'Slide 5', conteudo: 'Convite e o jeito como os 5 pilares fecham o calendário.' },
      { titulo: 'Slide 6', conteudo: 'Próximo passo: palavra-chave e WhatsApp.' },
    ],
  },
  {
    id: 'prova',
    nome: 'Carrossel de Prova Real com Contexto',
    objetivo: 'Validar que o método funciona com prova visual e narrativa.',
    cor: '#B33C62',
    slides: [
      { titulo: 'Capa', conteudo: 'Antes e depois em uma situação concreta de {nicho}. Use um número real, nunca um número inventado.' },
      { titulo: 'Slide 1', conteudo: 'O contexto: quem era a aluna e onde ela estava.' },
      { titulo: 'Slide 2', conteudo: 'O ponto de virada: o que ela fez diferente em {nicho}.' },
      { titulo: 'Slide 3', conteudo: 'Marco 1 do processo, nos primeiros 7 dias.' },
      { titulo: 'Slide 4', conteudo: 'Marco 2 do processo, entre os dias 15 e 30.' },
      { titulo: 'Slide 5', conteudo: 'Resultado final com o depoimento e o contexto.' },
      { titulo: 'Slide 6', conteudo: 'Convite: “Quer aplicar o mesmo em {nicho}? Comenta QUERO.”' },
    ],
  },
];

export interface ParteLegenda {
  nome: string;
  cor: string;
  funcao: string;
  exemplo: string;
}

export const ANATOMIA_LEGENDA: ParteLegenda[] = [
  {
    nome: 'Gancho',
    cor: '#D9B07E',
    funcao: 'Segura a leitura na primeira linha, antes do “ver mais”.',
    exemplo: '“Quase ninguém conta isso sobre viver de {nicho}.”',
  },
  {
    nome: 'Conteúdo',
    cor: '#E2C39A',
    funcao: 'Entrega o que o gancho prometeu. Uma ideia por parágrafo.',
    exemplo: '“O segredo não é publicar mais sobre {nicho}. É publicar no sistema: Educação, Autoridade, Conexão, Prova e Convite.”',
  },
  {
    nome: 'Orientação',
    cor: '#C85A80',
    funcao: 'Diz o que fazer com o que foi aprendido. O passo cabe no mesmo dia.',
    exemplo: '“Salva este post e aplica na próxima segunda. Começa pelo pilar Educação.”',
  },
  {
    nome: 'Convite',
    cor: '#B33C62',
    funcao: 'Abre a conversa. Sem pressão, com caminho claro.',
    exemplo: '“Quer montar o plano de {nicho}? Comenta ESSÊNCIA que eu te chamo no WhatsApp.”',
  },
];
