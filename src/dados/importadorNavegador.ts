import type { Morador, ProfissaoId } from '../tipos';

export interface MoradorBrutoVideo {
  id?: string;
  nome?: string;
  name?: string;
  arroba?: string;
  username?: string;
  profissao?: string;
  job?: string;
  casa_idx?: number;
  numero_casa?: number;
  casa?: number;
  cor_parede?: string;
  cor_telhado?: string;
  fundador?: boolean;
  segue_verificado?: boolean;
  criado_em?: string;
}

const PROFISSOES_VALIDAS: ProfissaoId[] = [
  'ferreiro',
  'fazendeiro',
  'lenhador',
  'bardo',
  'mago',
  'costureira',
  'mercador',
];

const CORES_PAREDE = ['#f2ead8', '#efe4ce', '#f6efe0', '#e9dec5', '#f4ebd9'];
const CORES_TELHADO = ['#e2552e', '#d64c27', '#e86838', '#c94523', '#f8d040', '#4a7c59', '#3a7ac8'];

function uuidDeterministico(indice: number): string {
  const hex = (indice + 1).toString(16).padStart(12, '0');
  return `00000000-0000-4000-8000-${hex}`;
}

export function normalizarProfissao(valor: string | undefined, indice: number): ProfissaoId {
  if (valor) {
    const limpo = valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    for (const p of PROFISSOES_VALIDAS) {
      if (limpo.includes(p)) return p;
    }
  }
  return PROFISSOES_VALIDAS[indice % PROFISSOES_VALIDAS.length];
}

export function converterEstadoParaMoradores(
  entrada:
    MoradorBrutoVideo[] | { moradores?: MoradorBrutoVideo[]; seguidores?: MoradorBrutoVideo[] }
): Morador[] {
  const lista = Array.isArray(entrada) ? entrada : (entrada.moradores ?? entrada.seguidores ?? []);

  return lista.map((item, idx) => {
    const casaIdx =
      typeof item.casa_idx === 'number'
        ? item.casa_idx
        : typeof item.numero_casa === 'number'
          ? item.numero_casa
          : typeof item.casa === 'number'
            ? item.casa
            : idx;

    const nome = (item.nome ?? item.name ?? `Morador #${casaIdx + 1}`).trim();
    const arrobaBruta = item.arroba ?? item.username ?? null;
    const arroba = arrobaBruta
      ? arrobaBruta.replace(/^@+/, '').toLowerCase().trim()
      : `morador_${casaIdx + 1}`;

    return {
      id: item.id ?? uuidDeterministico(casaIdx),
      user_id: null,
      nome,
      arroba,
      profissao: normalizarProfissao(item.profissao ?? item.job, casaIdx),
      casa_idx: casaIdx,
      regiao: casaIdx >= 790 ? 1 : 0,
      cor_parede: item.cor_parede ?? CORES_PAREDE[casaIdx % CORES_PAREDE.length],
      cor_telhado: item.cor_telhado ?? (casaIdx === 0 ? '#f8d040' : CORES_TELHADO[casaIdx % 4]),
      fundador: item.fundador ?? casaIdx < 50,
      segue_verificado: item.segue_verificado ?? true,
      criado_em: item.criado_em ?? new Date(Date.UTC(2026, 0, 1, 12, 0, casaIdx)).toISOString(),
    };
  });
}
