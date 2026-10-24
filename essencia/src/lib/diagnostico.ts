export interface DiagnosticoNegocio {
  nome: string;
  nicho: string;
  metaFaturamento: number;
  ticketMedio: number;
  taxaConversao: number;
}

export interface DiagnosticoPersistido extends DiagnosticoNegocio {
  updatedAt: string;
}

export const DIAGNOSTICO_PADRAO: DiagnosticoNegocio = {
  nome: '',
  nicho: '',
  metaFaturamento: 10000,
  ticketMedio: 500,
  taxaConversao: 25,
};

/** Cada conteúdo entra na conta com este alcance. A barra compara o resultado com o calendário de 30 dias. */
export const VIEWS_POR_CONTEUDO = 200;
export const TAXA_VIEW_PARA_LEAD = 0.05;
export const DIAS_DO_CALENDARIO = 30;

export type Conversao =
  | {
      ok: true;
      vendasNecessarias: number;
      leadsNecessarios: number;
      viewsNecessarios: number;
      conteudoNecessario: number;
      metaMensal: number;
      ticketMedio: number;
      taxaConversao: number;
      cabeNoCalendario: boolean;
    }
  | { ok: false; motivo: string };

function numeroFinito(valor: unknown): number | null {
  if (typeof valor === 'number' && Number.isFinite(valor)) return valor;
  if (typeof valor === 'string' && valor.trim() !== '') {
    const convertido = Number(valor);
    if (Number.isFinite(convertido)) return convertido;
  }
  return null;
}

export function calcularConversao(d: DiagnosticoNegocio): Conversao {
  if (!Number.isFinite(d.metaFaturamento) || d.metaFaturamento <= 0) {
    return { ok: false, motivo: 'Informe uma meta de faturamento maior que zero.' };
  }
  if (!Number.isFinite(d.ticketMedio) || d.ticketMedio <= 0) {
    return { ok: false, motivo: 'Informe um ticket médio maior que zero.' };
  }
  if (!Number.isFinite(d.taxaConversao) || d.taxaConversao <= 0 || d.taxaConversao > 100) {
    return { ok: false, motivo: 'A taxa de conversão precisa estar entre 0 e 100, sem incluir o zero.' };
  }

  const vendasNecessarias = Math.ceil(d.metaFaturamento / d.ticketMedio);
  const leadsNecessarios = Math.ceil(vendasNecessarias / (d.taxaConversao / 100));
  const viewsNecessarios = Math.ceil(leadsNecessarios / TAXA_VIEW_PARA_LEAD);
  const conteudoNecessario = Math.ceil(viewsNecessarios / VIEWS_POR_CONTEUDO);

  return {
    ok: true,
    vendasNecessarias,
    leadsNecessarios,
    viewsNecessarios,
    conteudoNecessario,
    metaMensal: d.metaFaturamento,
    ticketMedio: d.ticketMedio,
    taxaConversao: d.taxaConversao,
    cabeNoCalendario: conteudoNecessario <= DIAS_DO_CALENDARIO,
  };
}

export function validarDiagnostico(d: DiagnosticoNegocio): string | null {
  const nome = d.nome.trim().replace(/\s+/g, ' ');
  const nicho = d.nicho.trim().replace(/\s+/g, ' ');
  if (nome.length < 2 || nome.length > 80) return 'Informe seu nome com 2 a 80 caracteres.';
  if (nicho.length < 2 || nicho.length > 120) return 'Informe o nicho com 2 a 120 caracteres.';
  const conta = calcularConversao(d);
  if (!conta.ok) return conta.motivo;
  return null;
}

export function normalizarDiagnostico(d: DiagnosticoNegocio): DiagnosticoNegocio {
  return {
    nome: d.nome.trim().replace(/\s+/g, ' '),
    nicho: d.nicho.trim().replace(/\s+/g, ' '),
    metaFaturamento: d.metaFaturamento,
    ticketMedio: d.ticketMedio,
    taxaConversao: d.taxaConversao,
  };
}

export function interpretarDiagnostico(valor: unknown): DiagnosticoPersistido | null {
  if (!valor || typeof valor !== 'object') return null;
  const registro = valor as Record<string, unknown>;
  if (typeof registro.nome !== 'string' || typeof registro.nicho !== 'string') return null;
  const metaFaturamento = numeroFinito(registro.metaFaturamento);
  const ticketMedio = numeroFinito(registro.ticketMedio);
  const taxaConversao = numeroFinito(registro.taxaConversao);
  if (metaFaturamento == null || ticketMedio == null || taxaConversao == null) return null;
  const updatedAt = typeof registro.updatedAt === 'string' ? registro.updatedAt : '';
  return { nome: registro.nome, nicho: registro.nicho, metaFaturamento, ticketMedio, taxaConversao, updatedAt };
}

export type LinhaDiagnostico = {
  nome: string | null;
  nicho: string | null;
  meta_faturamento: number | string | null;
  ticket_medio: number | string | null;
  taxa_conversao: number | string | null;
  updated_at: string | null;
};

export function daLinha(linha: LinhaDiagnostico): DiagnosticoPersistido | null {
  const metaFaturamento = numeroFinito(linha.meta_faturamento);
  const ticketMedio = numeroFinito(linha.ticket_medio);
  const taxaConversao = numeroFinito(linha.taxa_conversao);
  if (metaFaturamento == null || ticketMedio == null || taxaConversao == null) return null;
  return {
    nome: linha.nome ?? '',
    nicho: linha.nicho ?? '',
    metaFaturamento,
    ticketMedio,
    taxaConversao,
    updatedAt: linha.updated_at ?? '',
  };
}

export function traduzirErroBanco(message: string, code: string | null): string {
  const texto = `${code ?? ''} ${message}`;
  if (/user_id|PGRST204|42703|schema cache|column/i.test(texto)) {
    return 'O banco ainda não separa o diagnóstico por conta. No SQL Editor do Supabase, rode o arquivo supabase/migrations/20261024210000_diagnosticos_por_usuario.sql.';
  }
  if (/PGRST116|more than one row|multiple/i.test(texto)) {
    return 'Há mais de um diagnóstico para esta conta. Rode a migração nova no SQL Editor para deixar uma linha por pessoa.';
  }
  if (/42501|row-level security|permission denied/i.test(texto)) {
    return 'Sem permissão para gravar este diagnóstico. Saia e entre de novo. Se continuar, rode a migração de RLS no Supabase.';
  }
  if (/check constraint|violates check/i.test(texto)) {
    return 'O banco recusou os números. Use nome, nicho e valores maiores que zero.';
  }
  if (/JWT expired|invalid JWT|PGRST301|PGRST303/i.test(texto)) {
    return 'Sua sessão expirou. Entre de novo.';
  }
  if (/fetch|network|failed to fetch|load failed/i.test(texto)) {
    return 'Sem conexão com o Supabase. O diagnóstico continua nesta tela, mas não foi gravado na conta.';
  }
  return 'Não foi possível gravar o diagnóstico na sua conta.';
}
