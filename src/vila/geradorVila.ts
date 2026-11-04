import type { Morador, ProfissaoId } from '../tipos';

export type MarcoTipo =
  | 'poco'
  | 'curral'
  | 'salao'
  | 'roca'
  | 'celeiro'
  | 'mercado'
  | 'templo'
  | 'muralha'
  | 'torre'
  | 'castelo';

export interface PosicaoCasa {
  casa_idx: number;
  regiao: number;
  anel: number;
  x: number;
  y: number;
  z: number;
  rotacaoY: number;
}

export interface ConstrucaoMarco {
  tipo: MarcoTipo;
  nome: string;
  minMoradores: number;
  desbloqueado: boolean;
  x: number;
  y: number;
  z: number;
  rotacaoY: number;
  escala: number;
}

export interface ArvoreMapa {
  id: number;
  regiao: number;
  x: number;
  y: number;
  z: number;
  escala: number;
  rotacaoY: number;
}

export interface AldeaoMapa {
  id: number;
  morador_idx: number;
  regiao: number;
  raio: number;
  anguloInicial: number;
  velocidade: number;
  corRoupa: string;
  profissao: ProfissaoId;
}

export interface OlhoCucuMapa {
  id: number;
  x: number;
  y: number;
  z: number;
  rotacaoY: number;
  fasePiscar: number;
}

export interface LayoutVila {
  semente: number;
  posicoesCasas: PosicaoCasa[];
  marcos: ConstrucaoMarco[];
  arvores: ArvoreMapa[];
  aldeoes: AldeaoMapa[];
  olhosCucu: OlhoCucuMapa[];
  urnaPosicao: { x: number; y: number; z: number };
  centroIlhaNorte: { x: number; y: number; z: number };
  ponte: { x: number; zInicio: number; zFim: number; largura: number };
}

export const LIMITE_REGIAO_PRINCIPAL = 790;
export const CENTRO_ILHA_NORTE = { x: 0, y: 0, z: -148 };

export function criarRngDeterministico(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFINICOES_MARCOS: Array<{
  tipo: MarcoTipo;
  nome: string;
  minMoradores: number;
  x: number;
  z: number;
  rotacaoY: number;
  escala: number;
}> = [
  {
    tipo: 'poco',
    nome: 'Poço da Vila',
    minMoradores: 6,
    x: 5.5,
    z: 3.5,
    rotacaoY: 0.4,
    escala: 1.0,
  },
  {
    tipo: 'curral',
    nome: 'Curral Comunitário',
    minMoradores: 8,
    x: -7.5,
    z: 5.0,
    rotacaoY: -0.6,
    escala: 1.1,
  },
  {
    tipo: 'salao',
    nome: 'Salão da Comunidade',
    minMoradores: 10,
    x: 0,
    z: -8.5,
    rotacaoY: 0,
    escala: 1.35,
  },
  {
    tipo: 'roca',
    nome: 'Roça Coletiva',
    minMoradores: 12,
    x: 8.5,
    z: -4.5,
    rotacaoY: 0.8,
    escala: 1.15,
  },
  {
    tipo: 'celeiro',
    nome: 'Grande Celeiro',
    minMoradores: 20,
    x: -9.0,
    z: -5.5,
    rotacaoY: -0.5,
    escala: 1.25,
  },
  {
    tipo: 'mercado',
    nome: 'Mercado de Astros',
    minMoradores: 50,
    x: 6.8,
    z: -7.2,
    rotacaoY: 0.3,
    escala: 1.25,
  },
  {
    tipo: 'templo',
    nome: 'Templo dos Antigos',
    minMoradores: 80,
    x: -6.8,
    z: 7.5,
    rotacaoY: 0.9,
    escala: 1.3,
  },
  {
    tipo: 'muralha',
    nome: 'Muralha Protetora',
    minMoradores: 200,
    x: 0,
    z: 0,
    rotacaoY: 0,
    escala: 1.0,
  },
  {
    tipo: 'torre',
    nome: 'Torre de Vigia',
    minMoradores: 250,
    x: 12.5,
    z: -82.0,
    rotacaoY: 0,
    escala: 1.4,
  },
  {
    tipo: 'castelo',
    nome: 'Castelo de Asterion',
    minMoradores: 500,
    x: 0,
    z: 82.0,
    rotacaoY: Math.PI,
    escala: 1.7,
  },
];

export function gerarPosicoesCasas(totalCasas: number, semente = 421337): PosicaoCasa[] {
  const rng = criarRngDeterministico(semente);
  const posicoes: PosicaoCasa[] = [];

  // Anéis concêntricos na ilha principal (casa_idx < 790)
  let casaAtual = 0;
  let anel = 0;
  const maxPrincipal = Math.min(totalCasas, LIMITE_REGIAO_PRINCIPAL);

  while (casaAtual < maxPrincipal) {
    const raio = 12.5 + anel * 4.15;
    const circunferencia = 2 * Math.PI * raio;
    const vagasNoAnel = Math.max(12, Math.floor(circunferencia / 4.2));

    for (let vaga = 0; vaga < vagasNoAnel && casaAtual < maxPrincipal; vaga++) {
      const anguloBase = (vaga / vagasNoAnel) * Math.PI * 2 + (anel % 2) * (Math.PI / vagasNoAnel);
      // Deixa corredor norte livre para a ponte da Ilha Norte e sul para o Castelo
      const distNorte = Math.abs(Math.sin(anguloBase) + 1) + Math.abs(Math.cos(anguloBase));
      if (anel >= 14 && distNorte < 0.14) {
        continue;
      }

      const variacaoRaio = (rng() - 0.5) * 0.45;
      const variacaoAngulo = (rng() - 0.5) * 0.025;
      const rFinal = raio + variacaoRaio;
      const aFinal = anguloBase + variacaoAngulo;

      const x = Math.cos(aFinal) * rFinal;
      const z = Math.sin(aFinal) * rFinal;
      // Casa olha em direção à fogueira central
      const rotacaoY = Math.atan2(-x, -z);

      posicoes.push({
        casa_idx: casaAtual,
        regiao: 0,
        anel,
        x: Number(x.toFixed(3)),
        y: 0,
        z: Number(z.toFixed(3)),
        rotacaoY: Number(rotacaoY.toFixed(3)),
      });
      casaAtual++;
    }
    anel++;
  }

  // Região 1: Ilha Norte (casa_idx >= 790)
  let anelNorte = 0;
  while (casaAtual < totalCasas) {
    const raio = 8.5 + anelNorte * 4.2;
    const vagasNoAnel = Math.max(10, Math.floor((2 * Math.PI * raio) / 4.2));

    for (let vaga = 0; vaga < vagasNoAnel && casaAtual < totalCasas; vaga++) {
      const angulo = (vaga / vagasNoAnel) * Math.PI * 2;
      const rFinal = raio + (rng() - 0.5) * 0.3;
      const x = CENTRO_ILHA_NORTE.x + Math.cos(angulo) * rFinal;
      const z = CENTRO_ILHA_NORTE.z + Math.sin(angulo) * rFinal;
      const rotacaoY = Math.atan2(CENTRO_ILHA_NORTE.x - x, CENTRO_ILHA_NORTE.z - z);

      posicoes.push({
        casa_idx: casaAtual,
        regiao: 1,
        anel: anelNorte,
        x: Number(x.toFixed(3)),
        y: 0,
        z: Number(z.toFixed(3)),
        rotacaoY: Number(rotacaoY.toFixed(3)),
      });
      casaAtual++;
    }
    anelNorte++;
  }

  return posicoes;
}

export function gerarLayoutVila(moradores: Morador[], semente = 421337): LayoutVila {
  const rng = criarRngDeterministico(semente + 99);
  const totalCasas = Math.max(moradores.length, 1);
  const posicoesCasas = gerarPosicoesCasas(Math.max(totalCasas, 820), semente).slice(0, totalCasas);

  const marcos: ConstrucaoMarco[] = DEFINICOES_MARCOS.map((m) => ({
    tipo: m.tipo,
    nome: m.nome,
    minMoradores: m.minMoradores,
    desbloqueado: moradores.length >= m.minMoradores,
    x: m.x,
    y: 0,
    z: m.z,
    rotacaoY: m.rotacaoY,
    escala: m.escala,
  }));

  // Árvores na mata ao redor da vila principal e na Ilha Norte
  const arvores: ArvoreMapa[] = [];
  const totalArvoresPrincipal = 240;
  for (let i = 0; i < totalArvoresPrincipal; i++) {
    const angulo = (i / totalArvoresPrincipal) * Math.PI * 2 + (rng() - 0.5) * 0.08;
    // Corredor da ponte ao norte (ângulo próximo a -PI/2 ou 3*PI/2)
    const xDir = Math.cos(angulo);
    const zDir = Math.sin(angulo);
    if (zDir < -0.92 && Math.abs(xDir) < 0.22) {
      continue;
    }
    const raio = 85 + rng() * 19;
    arvores.push({
      id: arvores.length,
      regiao: 0,
      x: Number((xDir * raio).toFixed(2)),
      y: 0,
      z: Number((zDir * raio).toFixed(2)),
      escala: Number((0.75 + rng() * 0.7).toFixed(2)),
      rotacaoY: Number((rng() * Math.PI * 2).toFixed(2)),
    });
  }

  // Árvores na Ilha Norte
  for (let i = 0; i < 45; i++) {
    const angulo = (i / 45) * Math.PI * 2 + (rng() - 0.5) * 0.1;
    const zDir = Math.sin(angulo);
    const xDir = Math.cos(angulo);
    if (zDir > 0.85 && Math.abs(xDir) < 0.35) {
      continue;
    }
    const raio = 23 + rng() * 8;
    arvores.push({
      id: arvores.length,
      regiao: 1,
      x: Number((CENTRO_ILHA_NORTE.x + xDir * raio).toFixed(2)),
      y: 0,
      z: Number((CENTRO_ILHA_NORTE.z + zDir * raio).toFixed(2)),
      escala: Number((0.75 + rng() * 0.55).toFixed(2)),
      rotacaoY: Number((rng() * Math.PI * 2).toFixed(2)),
    });
  }

  // Olhos do Cucu na mata escura
  const olhosCucu: OlhoCucuMapa[] = [];
  for (let i = 0; i < 24; i++) {
    const angulo = (i / 24) * Math.PI * 2 + rng() * 0.15;
    const raio = 87 + rng() * 10;
    const x = Math.cos(angulo) * raio;
    const z = Math.sin(angulo) * raio;
    olhosCucu.push({
      id: i,
      x: Number(x.toFixed(2)),
      y: Number((1.4 + rng() * 1.1).toFixed(2)),
      z: Number(z.toFixed(2)),
      rotacaoY: Number(Math.atan2(-x, -z).toFixed(2)),
      fasePiscar: Number((rng() * Math.PI * 2).toFixed(2)),
    });
  }

  // Aldeões caminhando pelos anéis da vila
  const coresAldeoes = [
    '#e2552e',
    '#f8d040',
    '#3a7ac8',
    '#8a5cf5',
    '#e87a90',
    '#48b878',
    '#f2ead8',
  ];
  const totalAldeoes = Math.min(90, Math.max(16, Math.floor(moradores.length / 8)));
  const aldeoes: AldeaoMapa[] = [];
  for (let i = 0; i < totalAldeoes; i++) {
    const moradorRef = moradores[i % moradores.length];
    const naIlhaNorte = i >= totalAldeoes - 6 && moradores.length > LIMITE_REGIAO_PRINCIPAL;
    const anelCaminhada = naIlhaNorte ? 1 : i % 14;
    const raio = naIlhaNorte ? 7.0 + (i % 2) * 4.0 : 10.2 + anelCaminhada * 4.15;
    aldeoes.push({
      id: i,
      morador_idx: moradorRef ? moradorRef.casa_idx : i,
      regiao: naIlhaNorte ? 1 : 0,
      raio,
      anguloInicial: (i / totalAldeoes) * Math.PI * 2,
      velocidade: (i % 2 === 0 ? 1 : -1) * (0.08 + (i % 5) * 0.025) * (14 / raio),
      corRoupa: coresAldeoes[i % coresAldeoes.length],
      profissao: moradorRef ? moradorRef.profissao : 'fazendeiro',
    });
  }

  return {
    semente,
    posicoesCasas,
    marcos,
    arvores,
    aldeoes,
    olhosCucu,
    urnaPosicao: { x: 0, y: 0, z: -5.2 },
    centroIlhaNorte: CENTRO_ILHA_NORTE,
    ponte: { x: 0, zInicio: -95, zFim: -120, largura: 5.5 },
  };
}

export function encontrarCasaLivreMaisProxima(
  casaConviteIdx: number,
  casasOcupadas: Set<number>,
  totalSlots = 850,
  semente = 421337
): PosicaoCasa {
  const posicoes = gerarPosicoesCasas(totalSlots, semente);
  const origem = posicoes[casaConviteIdx] ?? posicoes[0];

  let melhor: PosicaoCasa | null = null;
  let menorDistancia = Infinity;

  for (const pos of posicoes) {
    if (casasOcupadas.has(pos.casa_idx)) continue;
    const dx = pos.x - origem.x;
    const dz = pos.z - origem.z;
    const dist = Math.hypot(dx, dz);
    if (dist < menorDistancia) {
      menorDistancia = dist;
      melhor = pos;
    }
  }

  if (melhor) return melhor;

  const novoIdx = totalSlots;
  const expandidas = gerarPosicoesCasas(novoIdx + 1, semente);
  return expandidas[novoIdx];
}
