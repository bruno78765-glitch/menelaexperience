import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MarcoTipo } from '../vila/geradorVila';
import type { ProfissaoId } from '../tipos';

function removerFaceInferior(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const naoIndexada = geo.index ? geo.toNonIndexed() : geo.clone();
  naoIndexada.computeVertexNormals();
  const pos = naoIndexada.attributes.position;
  const norm = naoIndexada.attributes.normal;
  const novasPos: number[] = [];
  const novasNorm: number[] = [];

  for (let i = 0; i < pos.count; i += 3) {
    const ny = norm.getY(i);
    // Descarta triângulos voltados para baixo (-Y), invisíveis na câmera isométrica
    if (ny < -0.8) continue;
    for (let v = 0; v < 3; v++) {
      novasPos.push(pos.getX(i + v), pos.getY(i + v), pos.getZ(i + v));
      novasNorm.push(norm.getX(i + v), norm.getY(i + v), norm.getZ(i + v));
    }
  }

  const limpa = new THREE.BufferGeometry();
  limpa.setAttribute('position', new THREE.Float32BufferAttribute(novasPos, 3));
  limpa.setAttribute('normal', new THREE.Float32BufferAttribute(novasNorm, 3));
  return limpa;
}

export function colorirGeometria(
  geometria: THREE.BufferGeometry,
  corHex: string | number
): THREE.BufferGeometry {
  const geo = removerFaceInferior(geometria);
  const cor = new THREE.Color(corHex);
  const qtdVertices = geo.attributes.position.count;
  const normais = geo.attributes.normal;
  const cores = new Float32Array(qtdVertices * 3);

  for (let i = 0; i < qtdVertices; i++) {
    const nx = normais ? normais.getX(i) : 0;
    const ny = normais ? normais.getY(i) : 1;
    const nz = normais ? normais.getZ(i) : 0;
    const luzFace = Math.min(1.12, Math.max(0.68, 0.84 + ny * 0.16 + nx * 0.08 + nz * 0.05));
    cores[i * 3] = Math.min(1, cor.r * luzFace);
    cores[i * 3 + 1] = Math.min(1, cor.g * luzFace);
    cores[i * 3 + 2] = Math.min(1, cor.b * luzFace);
  }

  geo.setAttribute('color', new THREE.BufferAttribute(cores, 3));
  return geo;
}

function caixaColorida(
  largura: number,
  altura: number,
  profundidade: number,
  x: number,
  y: number,
  z: number,
  corHex: string | number,
  rotY = 0
): THREE.BufferGeometry {
  const box = new THREE.BoxGeometry(largura, altura, profundidade);
  if (rotY !== 0) box.rotateY(rotY);
  box.translate(x, y, z);
  return colorirGeometria(box, corHex);
}

/**
 * Geometria unificada das paredes da casa (cor controlada por instância: #f2ead8 creme por padrão)
 */
export function criarGeometriaParedeCasa(): THREE.BufferGeometry {
  const corpo = colorirGeometria(new THREE.BoxGeometry(2.1, 1.55, 2.1), '#ffffff');
  corpo.translate(0, 0.95, 0);

  const empenaFrente = colorirGeometria(new THREE.BoxGeometry(1.45, 0.45, 1.95), '#f7f3eb');
  empenaFrente.translate(0, 1.85, 0);

  return mergeGeometries([corpo, empenaFrente], false)!;
}

/**
 * Geometria unificada do telhado low-poly/voxel da casa (cor por instância: #e2552e telha por padrão)
 */
export function criarGeometriaTelhadoCasa(): THREE.BufferGeometry {
  const camada1 = colorirGeometria(new THREE.BoxGeometry(2.45, 0.36, 2.45), '#ffffff');
  camada1.translate(0, 1.84, 0);

  const camada2 = colorirGeometria(new THREE.BoxGeometry(1.75, 0.4, 2.25), '#f2f2f2');
  camada2.translate(0, 2.22, 0);

  const cumeeira = colorirGeometria(new THREE.BoxGeometry(0.95, 0.34, 2.1), '#e6e6e6');
  cumeeira.translate(0, 2.58, 0);

  return mergeGeometries([camada1, camada2, cumeeira], false)!;
}

/**
 * Detalhes arquitetônicos da casa (base de pedra, porta de madeira, janelas iluminadas e chaminé)
 */
export function criarGeometriaDetalhesCasa(): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [
    // Fundação de pedra
    caixaColorida(2.25, 0.22, 2.25, 0, 0.11, 0, '#7c7872'),
    // Porta de madeira na frente (+Z)
    caixaColorida(0.52, 0.95, 0.12, 0, 0.65, 1.04, '#6b3e26'),
    // Batente da porta
    caixaColorida(0.64, 0.1, 0.16, 0, 1.15, 1.05, '#4e2b18'),
    // Janela esquerda e direita com brilho aconchegante
    caixaColorida(0.38, 0.38, 0.12, -0.62, 1.05, 1.03, '#f8d040'),
    caixaColorida(0.38, 0.38, 0.12, 0.62, 1.05, 1.03, '#f8d040'),
    // Chaminé de tijolos
    caixaColorida(0.36, 0.95, 0.36, 0.65, 2.45, -0.45, '#8c4a38'),
  ];
  return mergeGeometries(partes, false)!;
}

/**
 * Objeto característico de cada profissão posicionado na frente da porta da casa
 */
export function criarGeometriaObjetoProfissao(profissao: ProfissaoId): THREE.BufferGeometry {
  const offsetZ = 1.48;
  const offsetX = 0.72;

  switch (profissao) {
    case 'ferreiro': {
      // Bigorna de ferro sobre cepo
      const cepo = caixaColorida(0.42, 0.28, 0.42, offsetX, 0.14, offsetZ, '#6b4423');
      const baseBigorna = caixaColorida(0.36, 0.18, 0.26, offsetX, 0.36, offsetZ, '#3d434d');
      const topoBigorna = caixaColorida(0.58, 0.18, 0.28, offsetX, 0.52, offsetZ, '#596270');
      return mergeGeometries([cepo, baseBigorna, topoBigorna], false)!;
    }
    case 'fazendeiro': {
      // Horta com canteiro e plantas douradas/verdes
      const canteiro = caixaColorida(0.68, 0.16, 0.52, offsetX, 0.08, offsetZ, '#5c3c24');
      const broto1 = caixaColorida(0.16, 0.32, 0.16, offsetX - 0.16, 0.28, offsetZ, '#f8d040');
      const broto2 = caixaColorida(0.16, 0.36, 0.16, offsetX + 0.16, 0.3, offsetZ, '#6cc24a');
      return mergeGeometries([canteiro, broto1, broto2], false)!;
    }
    case 'lenhador': {
      // Cepo com machado cravado e toras
      const cepo = caixaColorida(0.44, 0.34, 0.44, offsetX, 0.17, offsetZ, '#7c4d2b');
      const cabo = caixaColorida(0.08, 0.48, 0.08, offsetX, 0.52, offsetZ, '#c48f52', 0.3);
      const lamina = caixaColorida(0.24, 0.2, 0.06, offsetX + 0.08, 0.66, offsetZ, '#b8c4d0');
      return mergeGeometries([cepo, cabo, lamina], false)!;
    }
    case 'bardo': {
      // Alaúde dourado em suporte
      const suporte = caixaColorida(0.3, 0.16, 0.3, offsetX, 0.08, offsetZ, '#54351e');
      const bojo = caixaColorida(0.34, 0.42, 0.2, offsetX, 0.36, offsetZ, '#d9822b');
      const braco = caixaColorida(0.1, 0.42, 0.08, offsetX, 0.68, offsetZ, '#f8d040');
      return mergeGeometries([suporte, bojo, braco], false)!;
    }
    case 'mago': {
      // Cajado místico com cristal brilhante
      const pedestal = caixaColorida(0.32, 0.16, 0.32, offsetX, 0.08, offsetZ, '#4a3b69');
      const haste = caixaColorida(0.1, 0.78, 0.1, offsetX, 0.52, offsetZ, '#6b3e26');
      const orbe = caixaColorida(0.26, 0.26, 0.26, offsetX, 0.98, offsetZ, '#5ce1e6', 0.78);
      return mergeGeometries([pedestal, haste, orbe], false)!;
    }
    case 'costureira': {
      // Varal com tecidos coloridos
      const hasteEsq = caixaColorida(0.08, 0.72, 0.08, offsetX - 0.26, 0.36, offsetZ, '#6b3e26');
      const hasteDir = caixaColorida(0.08, 0.72, 0.08, offsetX + 0.26, 0.36, offsetZ, '#6b3e26');
      const corda = caixaColorida(0.58, 0.05, 0.05, offsetX, 0.68, offsetZ, '#f2ead8');
      const pano1 = caixaColorida(0.2, 0.32, 0.04, offsetX - 0.11, 0.5, offsetZ, '#e2552e');
      const pano2 = caixaColorida(0.2, 0.28, 0.04, offsetX + 0.12, 0.52, offsetZ, '#3a7ac8');
      return mergeGeometries([hasteEsq, hasteDir, corda, pano1, pano2], false)!;
    }
    case 'mercador': {
      // Baú e pilha de moedas Astros (#f8d040)
      const bau = caixaColorida(0.46, 0.32, 0.34, offsetX, 0.16, offsetZ, '#8a5229');
      const tampa = caixaColorida(0.48, 0.12, 0.36, offsetX, 0.36, offsetZ, '#a86533');
      const moedas = caixaColorida(0.26, 0.16, 0.22, offsetX, 0.46, offsetZ, '#f8d040');
      return mergeGeometries([bau, tampa, moedas], false)!;
    }
  }
}

/**
 * Geometria unificada de árvore low-poly/voxel (tronco + 3 copas em camadas)
 */
export function criarGeometriaArvore(): THREE.BufferGeometry {
  const tronco = caixaColorida(0.55, 1.3, 0.55, 0, 0.65, 0, '#6e472b');
  const copa1 = caixaColorida(2.1, 1.1, 2.1, 0, 1.65, 0, '#3e7a34');
  const copa2 = caixaColorida(1.6, 1.0, 1.6, 0, 2.45, 0, '#4f8f40');
  const copa3 = caixaColorida(1.0, 0.85, 1.0, 0, 3.15, 0, '#5f9e46');
  return mergeGeometries([tronco, copa1, copa2, copa3], false)!;
}

/**
 * Geometria de aldeão low-poly caminhando pela vila
 */
export function criarGeometriaAldeao(): THREE.BufferGeometry {
  const corpo = caixaColorida(0.42, 0.62, 0.3, 0, 0.38, 0, '#ffffff');
  const cabeca = caixaColorida(0.36, 0.36, 0.36, 0, 0.9, 0, '#f5cfa6');
  const chapeu = caixaColorida(0.44, 0.16, 0.44, 0, 1.14, 0, '#f8d040');
  return mergeGeometries([corpo, cabeca, chapeu], false)!;
}

/**
 * Geometria das construções especiais por marco de moradores
 */
export function criarGeometriaMarco(tipo: MarcoTipo): THREE.BufferGeometry {
  switch (tipo) {
    case 'poco': {
      const base = caixaColorida(1.8, 0.9, 1.8, 0, 0.45, 0, '#8d8c8a');
      const agua = caixaColorida(1.2, 0.2, 1.2, 0, 0.85, 0, '#3a7ac8');
      const pilarE = caixaColorida(0.2, 1.4, 0.2, -0.7, 1.5, 0, '#6b3e26');
      const pilarD = caixaColorida(0.2, 1.4, 0.2, 0.7, 1.5, 0, '#6b3e26');
      const telhado = caixaColorida(2.1, 0.45, 1.5, 0, 2.3, 0, '#e2552e');
      return mergeGeometries([base, agua, pilarE, pilarD, telhado], false)!;
    }
    case 'curral': {
      const cercaN = caixaColorida(3.2, 0.7, 0.18, 0, 0.35, -1.5, '#8c5832');
      const cercaS = caixaColorida(3.2, 0.7, 0.18, 0, 0.35, 1.5, '#8c5832');
      const cercaL = caixaColorida(0.18, 0.7, 3.0, -1.5, 0.35, 0, '#8c5832');
      const cercaO = caixaColorida(0.18, 0.7, 3.0, 1.5, 0.35, 0, '#8c5832');
      const feno = caixaColorida(0.9, 0.65, 0.8, -0.6, 0.32, -0.5, '#f8d040');
      const ovelha = caixaColorida(0.65, 0.55, 0.45, 0.5, 0.28, 0.3, '#f2ead8');
      return mergeGeometries([cercaN, cercaS, cercaL, cercaO, feno, ovelha], false)!;
    }
    case 'salao': {
      const base = caixaColorida(4.2, 0.35, 3.2, 0, 0.18, 0, '#7a7570');
      const paredes = caixaColorida(3.8, 2.1, 2.8, 0, 1.35, 0, '#f2ead8');
      const telhado1 = caixaColorida(4.3, 0.55, 3.3, 0, 2.6, 0, '#e2552e');
      const telhado2 = caixaColorida(3.1, 0.55, 2.9, 0, 3.1, 0, '#f8d040');
      const porta = caixaColorida(0.9, 1.3, 0.15, 0, 0.9, 1.42, '#5c3317');
      return mergeGeometries([base, paredes, telhado1, telhado2, porta], false)!;
    }
    case 'roca': {
      const solo = caixaColorida(3.6, 0.18, 3.0, 0, 0.09, 0, '#5c3a21');
      const trigo1 = caixaColorida(3.2, 0.45, 0.45, 0, 0.35, -0.9, '#f8d040');
      const trigo2 = caixaColorida(3.2, 0.48, 0.45, 0, 0.35, 0, '#e8be30');
      const trigo3 = caixaColorida(3.2, 0.45, 0.45, 0, 0.35, 0.9, '#f8d040');
      return mergeGeometries([solo, trigo1, trigo2, trigo3], false)!;
    }
    case 'celeiro': {
      const corpo = caixaColorida(3.2, 2.4, 2.6, 0, 1.2, 0, '#c84428');
      const telhado = caixaColorida(3.5, 0.8, 2.9, 0, 2.75, 0, '#5a3825');
      const cruzBranca = caixaColorida(1.2, 1.2, 0.12, 0, 1.1, 1.32, '#f2ead8');
      return mergeGeometries([corpo, telhado, cruzBranca], false)!;
    }
    case 'mercado': {
      const balcao = caixaColorida(3.4, 0.9, 1.8, 0, 0.45, 0, '#8a5229');
      const toldo1 = caixaColorida(1.8, 0.4, 2.2, -0.85, 2.1, 0, '#e2552e');
      const toldo2 = caixaColorida(1.8, 0.4, 2.2, 0.85, 2.1, 0, '#f8d040');
      const haste1 = caixaColorida(0.18, 2.0, 0.18, -1.5, 1.0, 0.8, '#5c3a21');
      const haste2 = caixaColorida(0.18, 2.0, 0.18, 1.5, 1.0, 0.8, '#5c3a21');
      return mergeGeometries([balcao, toldo1, toldo2, haste1, haste2], false)!;
    }
    case 'templo': {
      const degrau1 = caixaColorida(3.8, 0.4, 3.8, 0, 0.2, 0, '#d8d2c5');
      const degrau2 = caixaColorida(3.0, 0.4, 3.0, 0, 0.6, 0, '#e5dfd3');
      const santuario = caixaColorida(2.2, 2.1, 2.2, 0, 1.8, 0, '#f2ead8');
      const cupula = caixaColorida(1.6, 0.9, 1.6, 0, 3.2, 0, '#3a7ac8');
      const cristal = caixaColorida(0.5, 0.7, 0.5, 0, 3.9, 0, '#f8d040');
      return mergeGeometries([degrau1, degrau2, santuario, cupula, cristal], false)!;
    }
    case 'muralha': {
      // Anel de segmentos de muralha de pedra ao redor da vila
      const segmentos: THREE.BufferGeometry[] = [];
      const totalSeg = 36;
      const raio = 81.5;
      for (let i = 0; i < totalSeg; i++) {
        // Deixa portão norte (ponte) e sul abertos
        const angulo = (i / totalSeg) * Math.PI * 2;
        if (Math.abs(Math.cos(angulo)) < 0.18) continue;
        const x = Math.cos(angulo) * raio;
        const z = Math.sin(angulo) * raio;
        const rot = -angulo + Math.PI / 2;
        segmentos.push(caixaColorida(11.5, 2.8, 1.4, x, 1.4, z, '#8c877e', rot));
        segmentos.push(caixaColorida(3.2, 3.5, 1.8, x, 1.75, z, '#736e65', rot));
      }
      return mergeGeometries(segmentos, false)!;
    }
    case 'torre': {
      const base = caixaColorida(2.6, 5.2, 2.6, 0, 2.6, 0, '#858078');
      const topo = caixaColorida(3.1, 0.9, 3.1, 0, 5.5, 0, '#6e6a63');
      const telhado = caixaColorida(2.4, 1.6, 2.4, 0, 6.6, 0, '#e2552e');
      const farol = caixaColorida(0.8, 0.8, 0.8, 0, 7.6, 0, '#f8d040');
      return mergeGeometries([base, topo, telhado, farol], false)!;
    }
    case 'castelo': {
      const corpo = caixaColorida(6.0, 4.2, 4.5, 0, 2.1, 0, '#cfc8b8');
      const torreE = caixaColorida(2.2, 6.2, 2.2, -3.2, 3.1, 1.5, '#bfb7a6');
      const torreD = caixaColorida(2.2, 6.2, 2.2, 3.2, 3.1, 1.5, '#bfb7a6');
      const torreC = caixaColorida(2.6, 7.5, 2.6, 0, 3.75, -0.8, '#e0d9c8');
      const telhadoE = caixaColorida(2.5, 1.6, 2.5, -3.2, 6.9, 1.5, '#3a7ac8');
      const telhadoD = caixaColorida(2.5, 1.6, 2.5, 3.2, 6.9, 1.5, '#3a7ac8');
      const telhadoC = caixaColorida(2.9, 2.0, 2.9, 0, 8.4, -0.8, '#e2552e');
      const portao = caixaColorida(1.8, 2.4, 0.3, 0, 1.2, 2.25, '#54351e');
      return mergeGeometries(
        [corpo, torreE, torreD, torreC, telhadoE, telhadoD, telhadoC, portao],
        false
      )!;
    }
  }
}

/**
 * Geometria da urna de votação que fica em frente ao Salão da Comunidade
 */
export function criarGeometriaUrna(): THREE.BufferGeometry {
  const pedestal = caixaColorida(0.9, 0.9, 0.9, 0, 0.45, 0, '#8c877e');
  const caixaUrna = caixaColorida(0.75, 0.65, 0.75, 0, 1.2, 0, '#f2ead8');
  const topoDourado = caixaColorida(0.85, 0.16, 0.85, 0, 1.58, 0, '#f8d040');
  const fenda = caixaColorida(0.4, 0.06, 0.12, 0, 1.68, 0, '#1e1e24');
  return mergeGeometries([pedestal, caixaUrna, topoDourado, fenda], false)!;
}
