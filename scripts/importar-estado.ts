import fs from 'node:fs';
import path from 'node:path';

export type ProfissaoId =
  'ferreiro' | 'fazendeiro' | 'lenhador' | 'bardo' | 'mago' | 'costureira' | 'mercador';

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

export interface MoradorSeed {
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

const PRIMEIROS_NOMES = [
  'Bruno',
  'Helena',
  'Gael',
  'Luna',
  'Theo',
  'Maya',
  'Davi',
  'Clara',
  'Arthur',
  'Alice',
  'Gabriel',
  'Laura',
  'Bernardo',
  'Manuela',
  'Lucas',
  'Valentina',
  'Matheus',
  'Sofia',
  'Pedro',
  'Isabella',
  'Rafael',
  'Heloísa',
  'Enzo',
  'Luísa',
  'Guilherme',
  'Júlia',
  'Gustavo',
  'Lorena',
  'Nicolas',
  'Lívia',
  'Felipe',
  'Maria',
  'Caio',
  'Cecília',
  'Vinícius',
  'Eloá',
  'Leonardo',
  'Giovanna',
  'Rodrigo',
  'Beatriz',
];

const SOBRENOMES_VILA = [
  'da Forja',
  'do Vale',
  'da Mata',
  'do Rio',
  'da Colina',
  'do Sol',
  'da Bruma',
  'de Asterion',
  'do Cedro',
  'do Vento',
  'da Aurora',
  'da Ponte',
  'do Farol',
  'da Pedra',
  'do Trigo',
  'das Estrelas',
  'do Carvalho',
  'da Lua',
  'do Musgo',
  'da Chama',
];

const CORES_PAREDE = ['#f2ead8', '#efe4ce', '#f6efe0', '#e9dec5', '#f4ebd9'];
const CORES_TELHADO = ['#e2552e', '#d64c27', '#e86838', '#c94523', '#f8d040', '#4a7c59', '#3a7ac8'];

function mulberry32(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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
): MoradorSeed[] {
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

export function gerarEstadoPadraoVideos(
  total = 800,
  semente = 421337
): {
  dia: number;
  semente: number;
  moradores: MoradorBrutoVideo[];
} {
  const rng = mulberry32(semente);
  const moradores: MoradorBrutoVideo[] = [];

  for (let i = 0; i < total; i++) {
    const pNome = PRIMEIROS_NOMES[Math.floor(rng() * PRIMEIROS_NOMES.length)];
    const sNome = SOBRENOMES_VILA[Math.floor(rng() * SOBRENOMES_VILA.length)];
    const nome = i === 0 ? 'Bruno Fundador' : `${pNome} ${sNome}`;
    const baseArroba = `${pNome}_${sNome}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_');

    const arroba = i === 0 ? 'mundoasterion' : `${baseArroba}_${i + 1}`;
    const profissao = PROFISSOES_VALIDAS[i % PROFISSOES_VALIDAS.length];
    const corParede = CORES_PAREDE[Math.floor(rng() * CORES_PAREDE.length)];
    const corTelhado =
      i === 0
        ? '#f8d040'
        : rng() < 0.86
          ? '#e2552e'
          : CORES_TELHADO[Math.floor(rng() * CORES_TELHADO.length)];

    moradores.push({
      id: uuidDeterministico(i),
      nome,
      arroba,
      profissao,
      casa_idx: i,
      cor_parede: corParede,
      cor_telhado: corTelhado,
      fundador: i < 50,
      segue_verificado: true,
      criado_em: new Date(Date.UTC(2026, 0, 1 + Math.floor(i / 25), 12, i % 60, 0)).toISOString(),
    });
  }

  return {
    dia: 32,
    semente,
    moradores,
  };
}

function executarCli() {
  const args = process.argv.slice(2);
  const caminhoEntrada = args[0]
    ? path.resolve(process.cwd(), args[0])
    : path.resolve(process.cwd(), 'seed/estado.json');
  const caminhoSaida = args[1]
    ? path.resolve(process.cwd(), args[1])
    : path.resolve(process.cwd(), 'seed/moradores.json');

  fs.mkdirSync(path.dirname(caminhoSaida), { recursive: true });

  let dadosBrutos:
    MoradorBrutoVideo[] | { moradores?: MoradorBrutoVideo[]; seguidores?: MoradorBrutoVideo[] };
  if (fs.existsSync(caminhoEntrada)) {
    const texto = fs.readFileSync(caminhoEntrada, 'utf-8');
    dadosBrutos = JSON.parse(texto);
  } else {
    const gerado = gerarEstadoPadraoVideos(800, 421337);
    fs.mkdirSync(path.dirname(caminhoEntrada), { recursive: true });
    fs.writeFileSync(caminhoEntrada, JSON.stringify(gerado, null, 2), 'utf-8');
    dadosBrutos = gerado;
  }

  const moradores = converterEstadoParaMoradores(dadosBrutos);
  fs.writeFileSync(caminhoSaida, JSON.stringify(moradores, null, 2), 'utf-8');
  console.log(
    `Importados ${moradores.length} moradores em ${path.relative(process.cwd(), caminhoSaida)}`
  );
}

const ehExecucaoDireta =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename);

if (ehExecucaoDireta) {
  executarCli();
}
