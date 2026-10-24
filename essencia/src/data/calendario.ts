import { personalizarTexto } from '../lib/nicho.ts';

export type Pilar = 'Educação' | 'Autoridade' | 'Conexão' | 'Prova' | 'Convite';

export interface PilarMeta {
  nome: Pilar;
  cor: string;
  corTexto: string;
  descricao: string;
  objetivo: string;
}

export const PILARES: PilarMeta[] = [
  {
    nome: 'Educação',
    cor: '#D9B07E',
    corTexto: '#E2C39A',
    descricao: 'Ensina um conceito útil do seu nicho de forma simples e direta.',
    objetivo: 'Gerar salvamentos e autoridade percebida.',
  },
  {
    nome: 'Autoridade',
    cor: '#E2C39A',
    corTexto: '#EDD4B0',
    descricao: 'Mostra o seu método, números ou estrutura de pensamento.',
    objetivo: 'Posicioná-la como referência do seu mercado.',
  },
  {
    nome: 'Conexão',
    cor: '#C85A80',
    corTexto: '#D98AA8',
    descricao: 'História pessoal, rotina ou bastidor que humaniza a marca.',
    objetivo: 'Criar identificação e aproximação emocional.',
  },
  {
    nome: 'Prova',
    cor: '#B33C62',
    corTexto: '#D98AA8',
    descricao: 'Resultado real, depoimento ou antes e depois de uma aluna.',
    objetivo: 'Validar que o método funciona na prática.',
  },
  {
    nome: 'Convite',
    cor: '#D9B07E',
    corTexto: '#F4E3C9',
    descricao: 'Chamada elegante para a próxima ação: WhatsApp, lista ou serviço.',
    objetivo: 'Converter o interesse em conversa de venda.',
  },
];

export interface DiaCalendario {
  dia: number;
  pilar: Pilar;
  tema: string;
  gancho: string;
  formato: string;
  guia: {
    objetivo: string;
    estrutura: string[];
    roteiroBase: string;
    cta: string;
  };
}

interface Modelo {
  tema: string;
  gancho: string;
  formato: string;
  objetivo: string;
  estrutura: string[];
  roteiroBase: string;
  cta: string;
}

const EDUCACAO: Modelo[] = [
  {
    tema: 'Erro comum que trava quem está começando em {nicho}',
    gancho: 'Você está cometendo esse erro em {nicho}?',
    formato: 'Reel educacional de 45s',
    objetivo: 'Desconstruir uma crença que trava quem está começando em {nicho}.',
    estrutura: ['Abra com a pergunta que a aluna já se fez', 'Explique o erro em linguagem simples', 'Mostre a direção prática', 'Convide para o WhatsApp'],
    roteiroBase: 'Comece pela pergunta da semana. Diga por que o erro acontece, mostre o caminho do seu método e feche com um convite.',
    cta: 'Comenta ESSÊNCIA que eu te envio o guia no WhatsApp',
  },
  {
    tema: 'O que fazer antes de publicar qualquer coisa em {nicho}',
    gancho: 'Antes de postar sobre {nicho}, responde esta pergunta',
    formato: 'Carrossel de 6 slides',
    objetivo: 'Ensinar o critério de escolha de tema em {nicho}.',
    estrutura: ['Mostre a pressa de postar sem direção', 'Apresente a pergunta-filtro', 'Dê um exemplo aplicado', 'Peça para salvar o critério'],
    roteiroBase: 'A pergunta-filtro é: isso ajuda minha aluna a decidir o próximo passo hoje? Se não ajudar, o tema espera.',
    cta: 'Salva e usa esse filtro na próxima pauta',
  },
  {
    tema: 'Como explicar {nicho} em uma frase',
    gancho: 'Se você travou ao explicar {nicho}, usa esta frase',
    formato: 'Reel de quadro branco, 30s',
    objetivo: 'Dar uma frase pronta e adaptável para apresentar {nicho}.',
    estrutura: ['Mostre a versão confusa', 'Corte o jargão', 'Entregue a frase curta', 'Peça para ela reescrever a própria'],
    roteiroBase: 'Fale a versão longa, risque as palavras difíceis e deixe uma frase que uma amiga entenderia no áudio.',
    cta: 'Comenta a sua frase que eu te digo se ficou clara',
  },
  {
    tema: 'A diferença entre postar e ser encontrada em {nicho}',
    gancho: 'Postar todo dia não é a mesma coisa que ser vista em {nicho}',
    formato: 'Carrossel comparativo',
    objetivo: 'Separar volume de publicação e posicionamento em {nicho}.',
    estrutura: ['Descreva a rotina de postar no escuro', 'Mostre o que a busca da aluna realmente é', 'Ligue o tema a um pilar', 'Convide a olhar o calendário'],
    roteiroBase: 'Ela não precisa de mais posts. Precisa que cada post responda uma busca real do nicho.',
    cta: 'Comenta BUSCA que eu te mando as perguntas que eu usaria',
  },
  {
    tema: 'Um conceito de {nicho} que a sua aluna confunde toda semana',
    gancho: 'Essa confusão aparece toda semana em {nicho}',
    formato: 'Reel de correção, 40s',
    objetivo: 'Corrigir um mal-entendido frequente em {nicho}.',
    estrutura: ['Nomeie a confusão com as palavras dela', 'Diga o que não é', 'Diga o que é', 'Dê um exemplo de 10 segundos'],
    roteiroBase: 'Repita a frase confusa, substitua por uma definição curta e feche com um exemplo do dia a dia.',
    cta: 'Manda este vídeo para quem ainda mistura as duas coisas',
  },
  {
    tema: 'O primeiro passo de quem começa do zero em {nicho}',
    gancho: 'Se você está no zero em {nicho}, começa por aqui',
    formato: 'Carrossel passo a passo',
    objetivo: 'Reduzir o começo de {nicho} a uma ação pequena.',
    estrutura: ['Reconheça o excesso de conselhos', 'Escolha uma única ação', 'Mostre como fazer hoje', 'Diga o que ignorar por enquanto'],
    roteiroBase: 'O primeiro passo cabe em 20 minutos. O resto é sequência, não pré-requisito.',
    cta: 'Comenta COMEÇO que eu te devolvo o passo da sua situação',
  },
  {
    tema: 'Por que copiar o concorrente não funciona em {nicho}',
    gancho: 'Copiar o feed de {nicho} está te deixando genérica',
    formato: 'Reel de opinião, 50s',
    objetivo: 'Mostrar o custo de imitar referências em {nicho}.',
    estrutura: ['Admita que a referência inspira', 'Mostre o que se perde na cópia', 'Troque por um ponto de vista seu', 'Convide a reescrever um post'],
    roteiroBase: 'A referência mostra o formato. O conteúdo precisa carregar a sua leitura do nicho.',
    cta: 'Salva para revisar o próximo post antes de publicar',
  },
  {
    tema: 'Como escolher um tema de {nicho} em dez minutos',
    gancho: 'Dez minutos chegam para escolher o tema de {nicho} de amanhã',
    formato: 'Reel de bastidor cronometrado',
    objetivo: 'Entregar um ritual curto de pauta para {nicho}.',
    estrutura: ['Marque o tempo', 'Liste três dúvidas reais', 'Escolha a mais repetida', 'Escreva só o gancho'],
    roteiroBase: 'Timer na tela. Três dúvidas, uma escolha, um gancho. A gravação fica para depois.',
    cta: 'Comenta o gancho que saiu do exercício',
  },
  {
    tema: 'O que responder quando perguntam por onde começar em {nicho}',
    gancho: 'Quando te perguntam por onde começar em {nicho}, responde assim',
    formato: 'Reel de resposta direta',
    objetivo: 'Padronizar a resposta de DM sobre o começo em {nicho}.',
    estrutura: ['Leia a pergunta real', 'Responda em uma linha', 'Explique o porquê', 'Ofereça aprofundar no WhatsApp'],
    roteiroBase: 'A resposta cabe em uma frase. O áudio longo fica para a conversa, não para o comentário.',
    cta: 'Comenta INÍCIO que eu te mando a resposta que eu usaria',
  },
  {
    tema: 'Um mito de {nicho} que você pode desmontar hoje',
    gancho: 'Este mito de {nicho} faz a sua aluna adiar o que importa',
    formato: 'Carrossel mito e fato',
    objetivo: 'Trocar um mito de mercado por uma prática em {nicho}.',
    estrutura: ['Escreva o mito como a aluna fala', 'Mostre de onde ele veio', 'Apresente o fato', 'Dê a prática substituta'],
    roteiroBase: 'Mito numa linha, fato na seguinte, prática no slide final. Sem palestra.',
    cta: 'Comenta MITO e conta qual versão você ainda ouve',
  },
  {
    tema: 'O checklist mínimo de uma publicação de {nicho}',
    gancho: 'Antes de publicar em {nicho}, passa por estes quatro itens',
    formato: 'Carrossel checklist',
    objetivo: 'Dar um controle de qualidade curto para {nicho}.',
    estrutura: ['Gancho compreensível', 'Uma ideia só', 'Exemplo concreto', 'Próximo passo claro'],
    roteiroBase: 'Se um item faltar, o post volta para a edição. Publicar incompleto custa mais do que esperar um dia.',
    cta: 'Salva o checklist e usa na próxima legenda',
  },
];

const AUTORIDADE: Modelo[] = [
  {
    tema: 'Como eu organizo a semana de conteúdo em {nicho}',
    gancho: 'O sistema que eu uso para não ficar sem ideia em {nicho}',
    formato: 'Carrossel de 7 slides',
    objetivo: 'Mostrar a estrutura de planejamento em {nicho}.',
    estrutura: ['Capa com a promessa', 'Mapa da semana', 'Critério de escolha', 'Convite para aplicar junto'],
    roteiroBase: 'Cada slide revela uma camada: planejar, criar, publicar e medir. Deixe claro que dá para repetir.',
    cta: 'Salva para aplicar na próxima segunda',
  },
  {
    tema: 'O critério que eu uso para recusar um tema de {nicho}',
    gancho: 'Nem todo assunto de {nicho} merece um post',
    formato: 'Reel de bastidor, 40s',
    objetivo: 'Mostrar o filtro editorial do método em {nicho}.',
    estrutura: ['Cite um tema tentador', 'Aplique o critério', 'Mostre o que entra no lugar', 'Explique o efeito na aluna'],
    roteiroBase: 'O critério é simples: a aluna consegue agir depois de ver? Se a resposta for não, o tema fica de fora.',
    cta: 'Comenta FILTRO que eu te mando as três perguntas',
  },
  {
    tema: 'Três decisões que mudaram meu posicionamento em {nicho}',
    gancho: 'Três decisões separaram o meu {nicho} do conteúdo genérico',
    formato: 'Carrossel de decisões',
    objetivo: 'Registrar escolhas concretas de posicionamento em {nicho}.',
    estrutura: ['Decisão 1 com o antes', 'Decisão 2 com o custo', 'Decisão 3 com o efeito', 'O que você pode decidir esta semana'],
    roteiroBase: 'Cada decisão tem um antes curto e um efeito observável. Sem trajetória inteira num slide só.',
    cta: 'Salva e escolhe uma decisão para tomar até sexta',
  },
  {
    tema: 'O número que eu olharia se só pudesse medir uma coisa em {nicho}',
    gancho: 'Se eu só pudesse medir uma coisa em {nicho}, seria esta',
    formato: 'Reel de análise, 35s',
    objetivo: 'Ensinar a métrica que orienta decisão em {nicho}.',
    estrutura: ['Descarte a métrica de vaidade', 'Nomeie a métrica útil', 'Diga como ler em uma semana', 'Relacione com a meta'],
    roteiroBase: 'Escolha uma métrica ligada a conversa ou a salvamento, não a um número que só enfeita o perfil.',
    cta: 'Comenta NÚMERO e me diz qual métrica você olha hoje',
  },
  {
    tema: 'Como uma conversa de atendimento vira conteúdo de {nicho}',
    gancho: 'A pauta de {nicho} de amanhã saiu de uma conversa real',
    formato: 'Carrossel bastidor de atendimento',
    objetivo: 'Mostrar o caminho da conversa privada até o conteúdo público em {nicho}.',
    estrutura: ['A pergunta da aluna, sem expor a pessoa', 'O que havia por trás', 'O conteúdo que nasceu dali', 'Como repetir o processo'],
    roteiroBase: 'Proteja o nome e o caso. Publique a dúvida, a leitura e o passo. Esse é o método visível.',
    cta: 'Comenta CASO que eu te mostro como anonimizar a história',
  },
];

const CONEXAO: Modelo[] = [
  {
    tema: 'Por que eu decidi ensinar {nicho}',
    gancho: 'Quase ninguém conta isso sobre viver de {nicho}',
    formato: 'Reel de história, 60s',
    objetivo: 'Humanizar a decisão de ensinar {nicho}.',
    estrutura: ['O momento de virada', 'A dificuldade real', 'O que mudou', 'A ponte com a aluna'],
    roteiroBase: 'Fale como quem conta para uma amiga. A aluna precisa se reconhecer na história.',
    cta: 'Marca quem precisa ouvir isso hoje',
  },
  {
    tema: 'Um bastidor da minha rotina de criação em {nicho}',
    gancho: 'Quer ver uma tarde real de produção em {nicho}?',
    formato: 'Reel de bastidores, 45s',
    objetivo: 'Mostrar o processo imperfeito de criar em {nicho}.',
    estrutura: ['Abra a cortina com curiosidade', 'Mostre uma falha ou um corte', 'Diga a decisão que você tomou', 'Deixe o aprendizado aplicável'],
    roteiroBase: 'Inclua um ajuste de verdade. A perfeição sem processo afasta quem está começando.',
    cta: 'Comenta BASTIDOR se quiser o roteiro desta gravação',
  },
  {
    tema: 'O dia em que eu quase parei de aparecer por causa de {nicho}',
    gancho: 'Eu quase saí de cena em {nicho}. Foi este o motivo',
    formato: 'Reel de história, 55s',
    objetivo: 'Criar identificação com quem está cansada de {nicho}.',
    estrutura: ['Nomeie o cansaço', 'Conte o que pesou', 'Diga o que te segurou', 'Fale com quem está nesse ponto'],
    roteiroBase: 'Sem moral da história pronta no primeiro segundo. Chegue na virada depois de mostrar o peso.',
    cta: 'Manda este vídeo para quem está pensando em desistir',
  },
  {
    tema: 'O que eu diria para mim no começo de {nicho}',
    gancho: 'Se eu pudesse falar comigo no início de {nicho}, diria isto',
    formato: 'Reel carta, 40s',
    objetivo: 'Oferecer um conselho que a aluna de {nicho} possa usar agora.',
    estrutura: ['Situe o começo', 'Diga o que você faria menos', 'Diga o que você faria antes', 'Entregue uma frase para guardar'],
    roteiroBase: 'Uma carta curta. Menos tarefas, mais ordem. Termine com uma frase que caiba na bio.',
    cta: 'Salva a frase e coloca na sua nota de pauta',
  },
  {
    tema: 'A conversa que me fez ajustar o método de {nicho}',
    gancho: 'Uma aluna mudou o jeito como eu ensino {nicho}',
    formato: 'Reel de história, 50s',
    objetivo: 'Mostrar escuta ativa e evolução do método em {nicho}.',
    estrutura: ['A frase que ela disse', 'O que você entendeu errado antes', 'O ajuste do método', 'O efeito para as próximas'],
    roteiroBase: 'A história é sobre escuta, não sobre você ter sempre razão. O ajuste é o conteúdo.',
    cta: 'Comenta AJUSTE e conta uma frase de aluna que te marcou',
  },
];

const PROVA: Modelo[] = [
  {
    tema: 'Do ponto de partida ao resultado em {nicho}',
    gancho: 'Ela saiu do ponto de partida e chegou no resultado em {nicho}',
    formato: 'Carrossel de prova com contexto',
    objetivo: 'Mostrar um caso de {nicho} com antes, processo e depois.',
    estrutura: ['O antes, com situação concreta', 'Os três marcos do processo', 'O depois, com prova', 'O convite para o caso dela'],
    roteiroBase: 'O resultado sozinho não vende. O que vende é o que ela sentia antes, o que fez diferente e o que mudou.',
    cta: 'Comenta QUERO que eu te mostro como ler o seu ponto de partida',
  },
  {
    tema: 'O que mudou na primeira semana de uma aluna de {nicho}',
    gancho: 'Em sete dias de {nicho}, a mudança não foi a que ela esperava',
    formato: 'Carrossel de marcos',
    objetivo: 'Provar avanço inicial em {nicho} sem prometer o mês inteiro.',
    estrutura: ['A expectativa dela', 'O que foi feito na semana', 'O sinal de avanço', 'O que ainda não era hora de cobrar'],
    roteiroBase: 'Escolha um sinal pequeno e verdadeiro: clareza, pauta pronta, primeira conversa. Evite número inflado.',
    cta: 'Salva para lembrar que a primeira semana tem um marco próprio',
  },
  {
    tema: 'Um número modesto que mudou o mês em {nicho}',
    gancho: 'O número era pequeno. Em {nicho}, ele mudou a decisão',
    formato: 'Reel de prova, 35s',
    objetivo: 'Contextualizar um número real de {nicho}.',
    estrutura: ['Mostre o número', 'Diga o que ele significava antes', 'Explique a decisão que ele provocou', 'Convide a medir o equivalente'],
    roteiroBase: 'Número, significado, decisão. Nessa ordem. Sem print solto.',
    cta: 'Comenta MEDIR que eu te digo qual número olhar primeiro',
  },
  {
    tema: 'Depoimento de {nicho} com o processo, não só o final',
    gancho: 'O depoimento fica fraco quando só mostra o final de {nicho}',
    formato: 'Reel com fala da aluna',
    objetivo: 'Ensinar a estrutura de um depoimento útil em {nicho}.',
    estrutura: ['Onde ela estava', 'O que resistiu em fazer', 'O que fez mesmo assim', 'O que diria para outra aluna'],
    roteiroBase: 'Peça essas quatro falas. Corte o elogio genérico. Mantenha a frase específica.',
    cta: 'Comenta PROVA se você tem um caso e não sabe como contar',
  },
  {
    tema: 'O erro corrigido e o que aconteceu depois em {nicho}',
    gancho: 'Ela corrigiu um erro de {nicho} e o mês virou',
    formato: 'Carrossel antes e depois do processo',
    objetivo: 'Ligar uma correção concreta a um efeito em {nicho}.',
    estrutura: ['O erro, descrito com respeito', 'A correção em um passo', 'O que mudou na rotina', 'O convite para revisar o próprio erro'],
    roteiroBase: 'O erro não é o personagem. A correção é. Fale dela com precisão.',
    cta: 'Comenta REVISAR que eu te mando a pergunta de diagnóstico',
  },
];

const CONVITE: Modelo[] = [
  {
    tema: 'Convite para conversar sobre o próximo passo em {nicho}',
    gancho: 'Se você quer sair da improvisação em {nicho}, esta conversa é para você',
    formato: 'Reel de convite com legenda',
    objetivo: 'Abrir uma conversa de {nicho} sem empurrar a venda.',
    estrutura: ['Reconheça onde ela está', 'Mostre o que muda com método', 'Explique o próximo passo', 'Dê o caminho do WhatsApp'],
    roteiroBase: 'O convite acolhe. A clareza do próximo passo é o que converte, não a urgência falsa.',
    cta: 'Comenta PRÓXIMO PASSO ou chama no WhatsApp',
  },
  {
    tema: 'Para quem já decidiu parar de improvisar em {nicho}',
    gancho: 'Isto é para quem já cansou de improvisar em {nicho}',
    formato: 'Reel de qualificação, 30s',
    objetivo: 'Qualificar quem deve chamar sobre {nicho}.',
    estrutura: ['Diga para quem é', 'Diga para quem ainda não é', 'Descreva a conversa', 'Deixe o caminho'],
    roteiroBase: 'Qualificar também é cuidar. Quem não está no momento certo não precisa se sentir empurrada.',
    cta: 'Se for para você, comenta CONVERSA',
  },
  {
    tema: 'Como é uma conversa comigo sobre {nicho}',
    gancho: 'Antes de chamar, olha como funciona a conversa sobre {nicho}',
    formato: 'Carrossel de expectativa',
    objetivo: 'Reduzir o medo do primeiro contato sobre {nicho}.',
    estrutura: ['O que eu pergunto', 'O que eu não faço', 'O que ela leva da conversa', 'Como chamar'],
    roteiroBase: 'Mostre a conversa como um diagnóstico, não como uma sala de pressão.',
    cta: 'Chama no WhatsApp com a palavra ESSÊNCIA',
  },
  {
    tema: 'O que os 30 dias de {nicho} entregam na prática',
    gancho: 'No fim destes 30 dias de {nicho}, você não leva motivação. Leva um plano',
    formato: 'Reel de fechamento de ciclo',
    objetivo: 'Convidar quem acompanhou o ciclo de {nicho} a dar o próximo passo.',
    estrutura: ['Recapitule os cinco pilares', 'Diga o que já dá para executar', 'Aponte o que uma conversa destrava', 'Abra o WhatsApp'],
    roteiroBase: 'Feche o ciclo com dignidade. O convite é a continuação do plano, não um anúncio solto.',
    cta: 'Comenta PLANO que eu te chamo para organizar o seu',
  },
];

const MODELOS: Record<Pilar, Modelo[]> = {
  Educação: EDUCACAO,
  Autoridade: AUTORIDADE,
  Conexão: CONEXAO,
  Prova: PROVA,
  Convite: CONVITE,
};

const SEQUENCIA_30: Pilar[] = [
  'Educação', 'Educação', 'Autoridade', 'Conexão', 'Educação',
  'Prova', 'Convite', 'Educação', 'Autoridade', 'Conexão',
  'Educação', 'Prova', 'Convite', 'Educação', 'Autoridade',
  'Conexão', 'Educação', 'Prova', 'Autoridade', 'Convite',
  'Educação', 'Conexão', 'Educação', 'Prova', 'Autoridade',
  'Educação', 'Conexão', 'Prova', 'Convite', 'Educação',
];

function preencher(modelo: Modelo, nicho: string): Omit<DiaCalendario, 'dia' | 'pilar'> {
  const texto = (valor: string) => personalizarTexto(valor, nicho);
  return {
    tema: texto(modelo.tema),
    gancho: texto(modelo.gancho),
    formato: modelo.formato,
    guia: {
      objetivo: texto(modelo.objetivo),
      estrutura: modelo.estrutura.map(texto),
      roteiroBase: texto(modelo.roteiroBase),
      cta: texto(modelo.cta),
    },
  };
}

export function gerarCalendario(nicho: string): DiaCalendario[] {
  const uso: Record<Pilar, number> = {
    Educação: 0,
    Autoridade: 0,
    Conexão: 0,
    Prova: 0,
    Convite: 0,
  };

  return SEQUENCIA_30.map((pilar, indice) => {
    const modelos = MODELOS[pilar];
    const ordem = uso[pilar];
    uso[pilar] += 1;
    const modelo = modelos[ordem];
    if (!modelo) {
      throw new Error(`Não há variação suficiente para ${pilar} no dia ${indice + 1}.`);
    }
    return { dia: indice + 1, pilar, ...preencher(modelo, nicho) };
  });
}
