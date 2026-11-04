import type { EventoVila, Morador } from '../src/tipos';
import { criarRngDeterministico } from '../src/vila/geradorVila';

export interface ResultadoNoiteCucu {
  protecaoTotal: number;
  ameacaCucu: number;
  vilaProtegida: boolean;
  casaAssustadaIdx: number | null;
  moradorAssustadoNome: string | null;
  evento: EventoVila;
}

/**
 * Avalia um evento da "Noite do Cucu":
 * Se a proteção da vila (fogueira + muralha + pontos de proteção mágica) for menor que a ameaça,
 * uma casa aleatória sem proteção individual fica "assustada" até de manhã (apenas visualmente).
 */
export function resolverNoiteDoCucu(params: {
  dia: number;
  moradores: Morador[];
  muralhaConstruida: boolean;
  protecaoMagicaExtra: number;
  casasComProtecaoIndividual?: Set<number>;
  semente?: number;
}): ResultadoNoiteCucu {
  const {
    dia,
    moradores,
    muralhaConstruida,
    protecaoMagicaExtra,
    casasComProtecaoIndividual = new Set<number>(),
    semente = 421337,
  } = params;

  const baseFogueira = 35;
  const bonusMuralha = muralhaConstruida ? 60 : 0;
  const protecaoTotal = baseFogueira + bonusMuralha + protecaoMagicaExtra;
  const ameacaCucu = 75 + (dia % 5) * 10;

  const rng = criarRngDeterministico(semente + dia * 97);

  if (protecaoTotal >= ameacaCucu || moradores.length === 0) {
    const evento: EventoVila = {
      id: `evt-cucu-dia-${dia}-${Date.now()}`,
      tipo: 'noite_cucu',
      dados: {
        dia,
        protecaoTotal,
        ameacaCucu,
        vilaProtegida: true,
        casaAssustadaIdx: null,
        resumo: `A fogueira e a defesa da vila (${protecaoTotal}) afastaram o Cucu (ameaça ${ameacaCucu})!`,
      },
      criado_em: new Date().toISOString(),
    };
    return {
      protecaoTotal,
      ameacaCucu,
      vilaProtegida: true,
      casaAssustadaIdx: null,
      moradorAssustadoNome: null,
      evento,
    };
  }

  const candidatos = moradores.filter((m) => !casasComProtecaoIndividual.has(m.casa_idx));
  const escolhidos = candidatos.length > 0 ? candidatos : moradores;
  const alvo = escolhidos[Math.floor(rng() * escolhidos.length)];

  const evento: EventoVila = {
    id: `evt-cucu-dia-${dia}-${Date.now()}`,
    tipo: 'noite_cucu',
    dados: {
      dia,
      protecaoTotal,
      ameacaCucu,
      vilaProtegida: false,
      casaAssustadaIdx: alvo.casa_idx,
      moradorAssustadoNome: alvo.nome,
      moradorArroba: alvo.arroba,
      resumo: `O Cucu espiou da mata! A Casa #${alvo.casa_idx + 1} (${alvo.nome}) ficou assustada até o amanhecer.`,
    },
    criado_em: new Date().toISOString(),
  };

  return {
    protecaoTotal,
    ameacaCucu,
    vilaProtegida: false,
    casaAssustadaIdx: alvo.casa_idx,
    moradorAssustadoNome: alvo.nome,
    evento,
  };
}
