export type ProfissaoId =
  'ferreiro' | 'fazendeiro' | 'lenhador' | 'bardo' | 'mago' | 'costureira' | 'mercador';

export type RecursoTipo =
  'ferramentas' | 'comida' | 'madeira' | 'alegria' | 'protecao' | 'tecido' | 'moedas';

export type TituloNivel = 'Aprendiz' | 'Artífice' | 'Veterano' | 'Mestre';

export interface Morador {
  id: string;
  user_id: string | null;
  nome: string;
  arroba: string | null;
  profissao: ProfissaoId;
  casa_idx: number;
  regiao: number;
  cor_parede: string;
  cor_telhado: string;
  fundador: boolean;
  segue_verificado: boolean;
  criado_em: string;
  ultima_coleta_em?: string | null;
  assustado_ate?: string | null;
}

export interface EstoqueRecursos {
  ferramentas: number;
  comida: number;
  madeira: number;
  alegria: number;
  protecao: number;
  tecido: number;
  moedas: number;
}

export interface OfertaMercado {
  id: string;
  vendedor_id: string;
  vendedor_nome?: string;
  tipo: RecursoTipo;
  qtd: number;
  preco: number;
  status: 'aberta' | 'concluida' | 'cancelada';
  comprador_id: string | null;
  criado_em: string;
}

export interface DeverSemanal {
  morador_id: string;
  semana: number;
  tipo: 'entrega_obra' | 'ronda_noturna' | 'protecao_vila';
  descricao: string;
  recurso_necessario: RecursoTipo;
  qtd_necessaria: number;
  recompensa_astros: number;
  recompensa_xp: number;
  cumprido: boolean;
}

export interface NivelMorador {
  morador_id: string;
  xp: number;
  titulo: TituloNivel;
}

export interface ObraSemanal {
  id: string;
  nome: string;
  tipo: string;
  meta: Partial<Record<RecursoTipo, number>>;
  progresso: Partial<Record<RecursoTipo, number>>;
  status: 'em_andamento' | 'concluida';
  semana: number;
}

export interface ContribuicaoObra {
  id: string;
  obra_id: string;
  morador_id: string;
  morador_nome?: string;
  tipo: RecursoTipo;
  qtd: number;
  criado_em: string;
}

export interface VotacaoVila {
  id: string;
  pergunta: string;
  opcoes: string[];
  abre_em: string;
  fecha_em: string;
  vencedora: string | null;
  votos_por_opcao?: Record<string, number>;
}

export interface VotoMorador {
  votacao_id: string;
  morador_id: string;
  opcao: string;
}

export interface ReivindicacaoCasa {
  id: string;
  user_id: string;
  email?: string;
  arroba: string;
  codigo: string;
  status: 'pendente' | 'aprovada' | 'recusada';
  casa_idx_atribuida?: number;
  criado_em?: string;
}

export interface EventoVila {
  id: string;
  tipo: 'noite_cucu' | 'obra_pronta' | 'votacao_encerrada' | 'novo_morador';
  dados: Record<string, unknown>;
  criado_em: string;
}

export interface ItemCosmetico {
  id: string;
  nome: string;
  categoria: 'telhado' | 'jardim' | 'estandarte' | 'mascote';
  preco_gemas: number;
  exclusivo_fundador: boolean;
  preview_cor: string;
}
