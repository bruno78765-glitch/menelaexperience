import type { RespostaBot } from '../lib/busca.ts';

export const BASE_CONHECIMENTO: RespostaBot[] = [
  {
    palavrasChave: ['calendario', 'editar', '30 dias', 'pilar', 'pauta'],
    resposta:
      'O Calendário Editorial está no menu. Ele gera 30 dias, um tema diferente por dia, nos 5 pilares: Educação, Autoridade, Conexão, Prova e Convite. Abra o dia para ver o guia de execução. O nicho usado é o que está no diagnóstico, mesmo antes de salvar; salvar grava esse diagnóstico na sua conta.',
    acao: { label: 'Ir para o calendário', modulo: 'calendario' },
  },
  {
    palavrasChave: ['reel', 'reels', 'video', 'tiktok', 'roteiro', 'gancho do reel'],
    resposta:
      'No Estúdio, aba Vídeos Curtos, há 3 roteiros: Erro Comum, Dúvida Frequente e Bastidores. Os quatro passos são gancho com pergunta real, explicação simples, direção prática e convite para o WhatsApp. Os exemplos usam o nicho do seu diagnóstico.',
    acao: { label: 'Abrir estúdio', modulo: 'estudio' },
  },
  {
    palavrasChave: ['carrossel', 'carousel', 'salvamento', 'compartilhar'],
    resposta:
      'Os carrosséis estão no Estúdio, aba Carrosséis. Um é educacional, com os 5 pilares distribuídos nos slides. O outro é de prova real, com antes, processo e depois.',
    acao: { label: 'Ver carrosséis', modulo: 'estudio' },
  },
  {
    palavrasChave: ['legenda', 'caption', 'gancho', 'texto'],
    resposta:
      'A legenda está no Estúdio, aba Legenda Perfeita. A ordem é Gancho, Conteúdo, Orientação e Convite. Pular um bloco quebra o caminho até a conversa.',
    acao: { label: 'Ver legenda', modulo: 'estudio' },
  },
  {
    palavrasChave: ['objecao', 'caro', 'barato', 'venda', 'vendas', 'clara', 'desconto'],
    resposta:
      'O Treinador de Vendas usa o método C.L.A.R.A.: Compreenda, Ligue, Apresente, Responda e Avance. Escolha a objeção e percorra a resposta. A simulação começa fechada: o primeiro passo só abre quando você inicia.',
    acao: { label: 'Treinar vendas', modulo: 'vendas' },
  },
  {
    palavrasChave: ['meta', 'faturamento', 'ticket', 'lead', 'leads', 'conversao', 'calcular', 'diagnostico'],
    resposta:
      'No Diagnóstico você informa nome, nicho, meta, ticket e a sua taxa de conversão. A conta usa a taxa que está no controle, não um 25% fixo. O 25% é só o ponto de partida. Cada conteúdo entra com cerca de 200 visualizações, e 5% delas viram lead.',
    acao: { label: 'Abrir diagnóstico', modulo: 'dashboard' },
  },
  {
    palavrasChave: ['humano', 'atendente', 'mentor', 'suporte', 'falar com', 'whatsapp'],
    resposta:
      'Para falar com uma pessoa, use o botão de WhatsApp desta tela. O atendimento humano é de segunda a sexta, em horário comercial. Eu só respondo dúvidas sobre os módulos do sistema.',
  },
  {
    palavrasChave: ['ola', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
    resposta:
      'Olá. Eu respondo sobre calendário, estúdio, vendas e diagnóstico. Se quiser uma pessoa da equipe, use o WhatsApp. O que você precisa?',
  },
];

export const MENSAGEM_INICIAL =
  'Olá. Eu respondo dúvidas sobre calendário, conteúdo, vendas e diagnóstico. Para uma pessoa da equipe, use o botão do WhatsApp.';
