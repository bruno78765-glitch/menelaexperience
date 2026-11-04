import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Morador, ProfissaoId } from '../tipos';
import {
  CENTRO_ILHA_NORTE,
  gerarLayoutVila,
  type LayoutVila,
  type MarcoTipo,
  type PosicaoCasa,
} from '../vila/geradorVila';
import {
  colorirGeometria,
  criarGeometriaAldeao,
  criarGeometriaArvore,
  criarGeometriaDetalhesCasa,
  criarGeometriaMarco,
  criarGeometriaObjetoProfissao,
  criarGeometriaParedeCasa,
  criarGeometriaTelhadoCasa,
  criarGeometriaUrna,
} from './geometriasProcedurais';
import { sons } from '../audio/sons';

export interface Placa3DProjetada {
  id: string;
  texto: string;
  subtitulo?: string;
  x: number;
  y: number;
  visivel: boolean;
  destaque: 'minha_casa' | 'selecionada' | 'assustada' | 'marco';
}

export interface MetricasDesempenho {
  fps: number;
  drawCalls: number;
  casasVisiveis: number;
  qualidade: 'alta' | 'economica';
  pixelRatio: number;
  progressoCicloDia: number;
  ehNoite: boolean;
}

export interface OpcoesMotorCena {
  canvas: HTMLCanvasElement;
  aoSelecionarCasa: (casaIdx: number | null) => void;
  aoClicarMarco: (tipo: MarcoTipo | 'urna') => void;
  aoAtualizarPlacas: (placas: Placa3DProjetada[]) => void;
  aoAtualizarMetricas: (metricas: MetricasDesempenho) => void;
  aoEntrarNaNoite?: () => void;
}

const DURACAO_CICLO_COMPLETO_MS = 10 * 60 * 1000;
const CAPACIDADE_MAX_CASAS = 900;
const INCLINACAO_ISOMETRICA_RAD = THREE.MathUtils.degToRad(35.264);

const COR_GRAMA_DIA = new THREE.Color('#5f9e46');
const COR_GRAMA_NOITE = new THREE.Color('#1d3b2a');
const COR_AGUA_DIA = new THREE.Color('#3a7ac8');
const COR_AGUA_NOITE = new THREE.Color('#132952');
const COR_CEU_DIA = new THREE.Color('#7ec8e3');
const COR_CEU_TARDE = new THREE.Color('#e27248');
const COR_NOITE_AZUL = new THREE.Color('#0c1030');
const COR_DESTAQUE_AMARELO = new THREE.Color('#f8d040');

export class MotorCenaAsterion {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private opcoes: OpcoesMotorCena;

  private moradores: Morador[] = [];
  private layout: LayoutVila | null = null;

  // Câmera isométrica
  private alvoCamera = new THREE.Vector3(0, 0, 0);
  private alvoCameraDesejado = new THREE.Vector3(0, 0, 0);
  private anguloAzimute = Math.PI / 4;
  private anguloAzimuteDesejado = Math.PI / 4;
  private zoom = 0.85;
  private zoomDesejado = 0.85;
  private raioCamera = 160;

  // Estado de seleção e jogador
  private casaSelecionadaIdx: number | null = null;
  private minhaCasaIdx: number | null = null;
  private casaAssustadaIdx: number | null = null;

  // InstancedMeshes principais
  private paredeInstanced: THREE.InstancedMesh | null = null;
  private telhadoInstanced: THREE.InstancedMesh | null = null;
  private detalhesInstanced: THREE.InstancedMesh | null = null;
  private sombraCasasInstanced: THREE.InstancedMesh | null = null;
  private objetosProfissaoInstanced = new Map<
    ProfissaoId,
    { mesh: THREE.InstancedMesh; indicesCasa: number[] }
  >();
  private arvoresInstanced: THREE.InstancedMesh | null = null;
  private aldeoesInstanced: THREE.InstancedMesh | null = null;
  private olhosCucuInstanced: THREE.InstancedMesh | null = null;

  // Grupos especiais
  private grupoMundo = new THREE.Group();
  private grupoMarcos = new THREE.Group();
  private malhasMarcos = new Map<MarcoTipo | 'urna', THREE.Mesh>();
  private animacoesObra = new Map<MarcoTipo, { progresso: number }>();
  private anelSelecao: THREE.Mesh;
  private anelMinhaCasa: THREE.Group;
  private iconeAssustada: THREE.Group;

  // Ambiente Dia/Noite, Fogueira, Vagalumes e Cucu
  private luzAmbiente: THREE.HemisphereLight;
  private luzSolLua: THREE.DirectionalLight;
  private luzFogueiraCentral: THREE.PointLight;
  private chamasFogueira: THREE.Mesh[] = [];
  private vagalumesPoints: THREE.Points | null = null;
  private poeiraObraPoints: THREE.Points | null = null;
  private tempoPoeiraRestante = 0;
  private aguaMesh: THREE.Mesh | null = null;
  private matAgua: THREE.MeshBasicMaterial | null = null;
  private matGrama: THREE.MeshBasicMaterial | null = null;
  private matVerticeColorido = new THREE.MeshBasicMaterial({ vertexColors: true });

  // Ciclo dia/noite e métricas
  private inicioCicloMs = Date.now() - DURACAO_CICLO_COMPLETO_MS * 0.12;
  private overrideProgressoDia: number | null = null;
  private eraNoiteAnterior = false;
  private qualidade: 'alta' | 'economica' = 'alta';
  private pixelRatioAtual = 1;
  private contadorFrames = 0;
  private ultimoTempoFps = performance.now();
  private fpsAtual = 60;
  private segundosFpsBaixo = 0;
  private ultimoDisparoMetricas = 0;
  private animFrameId = 0;
  private destruido = false;

  // Interação de ponteiro/toque
  private ponteiroAtivo = false;
  private arrastou = false;
  private inicioPonteiro = { x: 0, y: 0 };
  private ultimoPonteiro = { x: 0, y: 0 };
  private raycaster = new THREE.Raycaster();

  constructor(opcoes: OpcoesMotorCena) {
    this.opcoes = opcoes;
    this.canvas = opcoes.canvas;

    const glTemp = document.createElement('canvas').getContext('webgl');
    const debugInfo = glTemp?.getExtension('WEBGL_debug_renderer_info');
    const rendererStr =
      (debugInfo && glTemp?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) || '';
    const ehRenderizadorSoftware = /SwiftShader|llvmpipe|Software/i.test(String(rendererStr));

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !ehRenderizadorSoftware,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });

    this.pixelRatioAtual = ehRenderizadorSoftware
      ? 0.45
      : Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.pixelRatioAtual);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.shadowMap.enabled = false;

    this.scene = new THREE.Scene();
    this.scene.background = COR_CEU_DIA.clone();

    const aspecto = window.innerWidth / Math.max(1, window.innerHeight);
    const frustum = 92;
    this.camera = new THREE.OrthographicCamera(
      (-frustum * aspecto) / 2,
      (frustum * aspecto) / 2,
      frustum / 2,
      -frustum / 2,
      1,
      500
    );

    this.luzAmbiente = new THREE.HemisphereLight('#ffffff', '#3e6b2c', 0.9);
    this.scene.add(this.luzAmbiente);

    this.luzSolLua = new THREE.DirectionalLight('#fff6dc', 1.25);
    this.luzSolLua.position.set(75, 110, 65);
    this.scene.add(this.luzSolLua);

    this.luzFogueiraCentral = new THREE.PointLight('#ff9933', 2.6, 38, 1.4);
    this.luzFogueiraCentral.position.set(0, 2.6, 0);
    this.scene.add(this.luzFogueiraCentral);

    this.scene.add(this.grupoMundo);
    this.grupoMundo.add(this.grupoMarcos);

    this.anelSelecao = this.criarAnelDestaque('#ffffff', 1.9, 2.35);
    this.anelSelecao.visible = false;
    this.grupoMundo.add(this.anelSelecao);

    this.anelMinhaCasa = this.criarIndicadorMinhaCasa();
    this.anelMinhaCasa.visible = false;
    this.grupoMundo.add(this.anelMinhaCasa);

    this.iconeAssustada = this.criarIndicadorCasaAssustada();
    this.iconeAssustada.visible = false;
    this.grupoMundo.add(this.iconeAssustada);

    this.construirTerrenoEFogueira();
    this.construirVagalumesEPoeira();
    this.registrarEventosInteracao();
    this.atualizarTransformacaoCamera(true);
    this.iniciarLoop();
  }

  private criarAnelDestaque(corHex: string, raioInterno: number, raioExterno: number): THREE.Mesh {
    const geo = new THREE.RingGeometry(raioInterno, raioExterno, 24);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: corHex,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.08;
    return mesh;
  }

  private criarIndicadorMinhaCasa(): THREE.Group {
    const grupo = new THREE.Group();
    const anel = this.criarAnelDestaque('#f8d040', 1.95, 2.6);
    grupo.add(anel);

    const geoFeixe = new THREE.CylinderGeometry(1.65, 2.1, 6.5, 16, 1, true);
    geoFeixe.translate(0, 3.25, 0);
    const matFeixe = new THREE.MeshBasicMaterial({
      color: '#f8d040',
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    grupo.add(new THREE.Mesh(geoFeixe, matFeixe));

    const geoEstrela = new THREE.OctahedronGeometry(0.58, 0);
    const matEstrela = new THREE.MeshBasicMaterial({ color: '#f8d040' });
    const estrela = new THREE.Mesh(geoEstrela, matEstrela);
    estrela.position.y = 4.6;
    estrela.name = 'estrelaMinhaCasa';
    grupo.add(estrela);

    return grupo;
  }

  private criarIndicadorCasaAssustada(): THREE.Group {
    const grupo = new THREE.Group();
    const anel = this.criarAnelDestaque('#a855f7', 1.9, 2.45);
    grupo.add(anel);

    const olhoE = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.28),
      new THREE.MeshBasicMaterial({ color: '#f8d040' })
    );
    olhoE.position.set(-0.35, 3.8, 0);
    const olhoD = olhoE.clone();
    olhoD.position.set(0.35, 3.8, 0);
    grupo.add(olhoE, olhoD);
    return grupo;
  }

  private construirTerrenoEFogueira() {
    // Oceano / Água (#3a7ac8)
    const geoAgua = new THREE.PlaneGeometry(520, 520, 1, 1);
    geoAgua.rotateX(-Math.PI / 2);
    this.matAgua = new THREE.MeshBasicMaterial({ color: COR_AGUA_DIA });
    this.aguaMesh = new THREE.Mesh(geoAgua, this.matAgua);
    this.aguaMesh.position.y = -0.55;
    this.grupoMundo.add(this.aguaMesh);

    this.matGrama = new THREE.MeshBasicMaterial({ color: COR_GRAMA_DIA });
    const geoGramaPrincipal = new THREE.CircleGeometry(106, 36);
    geoGramaPrincipal.rotateX(-Math.PI / 2);
    geoGramaPrincipal.translate(0, 0.01, 0);
    const geoGramaNorte = new THREE.CircleGeometry(31.5, 28);
    geoGramaNorte.rotateX(-Math.PI / 2);
    geoGramaNorte.translate(CENTRO_ILHA_NORTE.x, 0.01, CENTRO_ILHA_NORTE.z);
    const gramaUnificada = new THREE.Mesh(
      mergeGeometries([geoGramaPrincipal, geoGramaNorte], false)!,
      this.matGrama
    );
    this.grupoMundo.add(gramaUnificada);

    // Areia + Praça central + Ponte + Pedras e Toras das Fogueiras em 1 única malha estática!
    const partesEstaticas: THREE.BufferGeometry[] = [];

    const geoAreia = colorirGeometria(new THREE.RingGeometry(105.5, 112, 36), '#d9c38e');
    geoAreia.rotateX(-Math.PI / 2);
    geoAreia.translate(0, 0.0, 0);
    partesEstaticas.push(geoAreia);

    const geoAreiaNorte = colorirGeometria(new THREE.RingGeometry(31, 35, 28), '#d9c38e');
    geoAreiaNorte.rotateX(-Math.PI / 2);
    geoAreiaNorte.translate(CENTRO_ILHA_NORTE.x, 0.0, CENTRO_ILHA_NORTE.z);
    partesEstaticas.push(geoAreiaNorte);

    const geoPraca = colorirGeometria(new THREE.CircleGeometry(9.6, 24), '#9c7e54');
    geoPraca.rotateX(-Math.PI / 2);
    geoPraca.translate(0, 0.02, 0);
    partesEstaticas.push(geoPraca);

    const tablado = colorirGeometria(new THREE.BoxGeometry(5.2, 0.35, 32), '#7c4d2b');
    tablado.translate(0, 0.3, -110);
    partesEstaticas.push(tablado);

    for (let z = -96; z >= -124; z -= 4) {
      const pilarE = colorirGeometria(new THREE.BoxGeometry(0.4, 1.8, 0.4), '#6b3e26');
      pilarE.translate(-2.4, 0.2, z);
      const pilarD = colorirGeometria(new THREE.BoxGeometry(0.4, 1.8, 0.4), '#6b3e26');
      pilarD.translate(2.4, 0.2, z);
      partesEstaticas.push(pilarE, pilarD);
    }

    // Bases das duas fogueiras (pedras e lenha)
    for (const f of [
      { x: 0, z: 0, s: 1.25 },
      { x: CENTRO_ILHA_NORTE.x, z: CENTRO_ILHA_NORTE.z, s: 0.9 },
    ]) {
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2;
        const pedra = colorirGeometria(
          new THREE.BoxGeometry(0.45 * f.s, 0.32 * f.s, 0.45 * f.s),
          '#6e6a63'
        );
        pedra.rotateY(ang);
        pedra.translate(
          f.x + Math.cos(ang) * 1.35 * f.s,
          0.16 * f.s,
          f.z + Math.sin(ang) * 1.35 * f.s
        );
        partesEstaticas.push(pedra);
      }
      for (let i = 0; i < 4; i++) {
        const tora = colorirGeometria(
          new THREE.BoxGeometry(0.32 * f.s, 0.32 * f.s, 1.8 * f.s),
          '#5c3818'
        );
        tora.rotateX(0.2);
        tora.rotateY((i * Math.PI) / 4);
        tora.translate(f.x, 0.28 * f.s, f.z);
        partesEstaticas.push(tora);
      }
    }

    const malhaEstatica = new THREE.Mesh(
      mergeGeometries(partesEstaticas, false)!,
      this.matVerticeColorido
    );
    this.grupoMundo.add(malhaEstatica);

    // Chamas animadas da Fogueira Central e Ilha Norte
    this.criarChamasFogueira(0, 0, 1.25);
    this.criarChamasFogueira(CENTRO_ILHA_NORTE.x, CENTRO_ILHA_NORTE.z, 0.9);
  }

  private criarChamasFogueira(x: number, z: number, escala: number) {
    const matChamaExterna = new THREE.MeshBasicMaterial({ color: '#e2552e' });
    const chama1 = new THREE.Mesh(
      new THREE.ConeGeometry(0.85 * escala, 1.8 * escala, 6),
      matChamaExterna
    );
    chama1.position.set(x, 1.05 * escala, z);

    const matChamaInterna = new THREE.MeshBasicMaterial({ color: '#f8d040' });
    const chama2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.5 * escala, 1.35 * escala, 5),
      matChamaInterna
    );
    chama2.position.set(x, 1.15 * escala, z);

    this.chamasFogueira.push(chama1, chama2);
    this.grupoMundo.add(chama1, chama2);
  }

  private construirVagalumesEPoeira() {
    const qtdVagalumes = 220;
    const posicoes = new Float32Array(qtdVagalumes * 3);
    for (let i = 0; i < qtdVagalumes; i++) {
      const ang = (i / qtdVagalumes) * Math.PI * 2 * 7;
      const raio = 4 + (i % 88);
      posicoes[i * 3] = Math.cos(ang) * raio;
      posicoes[i * 3 + 1] = 1.4 + (i % 6) * 0.65;
      posicoes[i * 3 + 2] = Math.sin(ang) * raio;
    }
    const geoVagalumes = new THREE.BufferGeometry();
    geoVagalumes.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
    const matVagalumes = new THREE.PointsMaterial({
      color: COR_DESTAQUE_AMARELO,
      size: 6.5,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.95,
    });
    this.vagalumesPoints = new THREE.Points(geoVagalumes, matVagalumes);
    this.vagalumesPoints.visible = false;
    this.grupoMundo.add(this.vagalumesPoints);

    const qtdPoeira = 60;
    const posPoeira = new Float32Array(qtdPoeira * 3);
    const geoPoeira = new THREE.BufferGeometry();
    geoPoeira.setAttribute('position', new THREE.BufferAttribute(posPoeira, 3));
    const matPoeira = new THREE.PointsMaterial({
      color: '#f8d040',
      size: 7,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.9,
    });
    this.poeiraObraPoints = new THREE.Points(geoPoeira, matPoeira);
    this.poeiraObraPoints.visible = false;
    this.grupoMundo.add(this.poeiraObraPoints);
  }

  public atualizarVila(
    moradores: Morador[],
    opcoesExtras?: {
      minhaCasaIdx?: number | null;
      casaAssustadaIdx?: number | null;
      marcosConcluidosExtras?: MarcoTipo[];
    }
  ) {
    this.moradores = moradores;
    if (opcoesExtras?.minhaCasaIdx !== undefined) {
      this.minhaCasaIdx = opcoesExtras.minhaCasaIdx;
    }
    if (opcoesExtras?.casaAssustadaIdx !== undefined) {
      this.casaAssustadaIdx = opcoesExtras.casaAssustadaIdx;
    }

    this.layout = gerarLayoutVila(moradores, 421337);
    if (opcoesExtras?.marcosConcluidosExtras) {
      for (const m of this.layout.marcos) {
        if (opcoesExtras.marcosConcluidosExtras.includes(m.tipo)) {
          m.desbloqueado = true;
        }
      }
    }

    this.reconstruirMalhasInstanciadas();
    this.reconstruirMarcosEOlhosCucu();
    this.atualizarDestaquesCasas();
  }

  private reconstruirMalhasInstanciadas() {
    if (!this.layout) return;

    const paraRemover: THREE.Object3D[] = [];
    if (this.paredeInstanced) paraRemover.push(this.paredeInstanced);
    if (this.telhadoInstanced) paraRemover.push(this.telhadoInstanced);
    if (this.detalhesInstanced) paraRemover.push(this.detalhesInstanced);
    if (this.sombraCasasInstanced) paraRemover.push(this.sombraCasasInstanced);
    if (this.arvoresInstanced) paraRemover.push(this.arvoresInstanced);
    if (this.aldeoesInstanced) paraRemover.push(this.aldeoesInstanced);
    if (this.olhosCucuInstanced) paraRemover.push(this.olhosCucuInstanced);
    for (const item of this.objetosProfissaoInstanced.values()) {
      paraRemover.push(item.mesh);
    }
    for (const obj of paraRemover) {
      this.grupoMundo.remove(obj);
    }
    this.objetosProfissaoInstanced.clear();

    const totalCasas = Math.min(this.moradores.length, CAPACIDADE_MAX_CASAS);
    const matVerticeColorido = this.matVerticeColorido;

    this.paredeInstanced = new THREE.InstancedMesh(
      criarGeometriaParedeCasa(),
      matVerticeColorido,
      totalCasas
    );
    this.telhadoInstanced = new THREE.InstancedMesh(
      criarGeometriaTelhadoCasa(),
      matVerticeColorido,
      totalCasas
    );
    this.detalhesInstanced = new THREE.InstancedMesh(
      criarGeometriaDetalhesCasa(),
      matVerticeColorido,
      totalCasas
    );

    const geoSombra = new THREE.CircleGeometry(1.75, 10);
    geoSombra.rotateX(-Math.PI / 2);
    const matSombra = new THREE.MeshBasicMaterial({
      color: '#172b12',
      transparent: true,
      opacity: 0.36,
    });
    this.sombraCasasInstanced = new THREE.InstancedMesh(geoSombra, matSombra, totalCasas);

    const dummy = new THREE.Object3D();
    const corTemp = new THREE.Color();
    const casasPorProfissao = new Map<ProfissaoId, number[]>();

    for (let i = 0; i < totalCasas; i++) {
      const morador = this.moradores[i];
      const pos: PosicaoCasa = this.layout.posicoesCasas[i] ?? {
        casa_idx: i,
        regiao: 0,
        anel: 0,
        x: 12,
        y: 0,
        z: 12,
        rotacaoY: 0,
      };

      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.rotation.set(0, pos.rotacaoY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();

      this.paredeInstanced.setMatrixAt(i, dummy.matrix);
      this.telhadoInstanced.setMatrixAt(i, dummy.matrix);
      this.detalhesInstanced.setMatrixAt(i, dummy.matrix);

      dummy.position.set(pos.x, 0.03, pos.z);
      dummy.updateMatrix();
      this.sombraCasasInstanced.setMatrixAt(i, dummy.matrix);

      corTemp.set(morador.cor_parede || '#f2ead8');
      this.paredeInstanced.setColorAt(i, corTemp);

      corTemp.set(morador.cor_telhado || '#e2552e');
      this.telhadoInstanced.setColorAt(i, corTemp);

      const listaProf = casasPorProfissao.get(morador.profissao) ?? [];
      listaProf.push(i);
      casasPorProfissao.set(morador.profissao, listaProf);
    }

    this.paredeInstanced.instanceMatrix.needsUpdate = true;
    this.telhadoInstanced.instanceMatrix.needsUpdate = true;
    this.detalhesInstanced.instanceMatrix.needsUpdate = true;
    this.sombraCasasInstanced.instanceMatrix.needsUpdate = true;
    if (this.paredeInstanced.instanceColor) this.paredeInstanced.instanceColor.needsUpdate = true;
    if (this.telhadoInstanced.instanceColor) this.telhadoInstanced.instanceColor.needsUpdate = true;

    this.grupoMundo.add(
      this.sombraCasasInstanced,
      this.paredeInstanced,
      this.telhadoInstanced,
      this.detalhesInstanced
    );

    for (const [profissao, indices] of casasPorProfissao.entries()) {
      const geoObj = criarGeometriaObjetoProfissao(profissao);
      const meshObj = new THREE.InstancedMesh(geoObj, matVerticeColorido, indices.length);
      indices.forEach((casaIdx, instIdx) => {
        const pos = this.layout!.posicoesCasas[casaIdx];
        dummy.position.set(pos.x, pos.y, pos.z);
        dummy.rotation.set(0, pos.rotacaoY, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshObj.setMatrixAt(instIdx, dummy.matrix);
      });
      meshObj.instanceMatrix.needsUpdate = true;
      this.objetosProfissaoInstanced.set(profissao, { mesh: meshObj, indicesCasa: indices });
      this.grupoMundo.add(meshObj);
    }

    const arvores = this.layout.arvores;
    this.arvoresInstanced = new THREE.InstancedMesh(
      criarGeometriaArvore(),
      matVerticeColorido,
      arvores.length
    );
    arvores.forEach((arv, idx) => {
      dummy.position.set(arv.x, arv.y, arv.z);
      dummy.rotation.set(0, arv.rotacaoY, 0);
      dummy.scale.setScalar(arv.escala);
      dummy.updateMatrix();
      this.arvoresInstanced!.setMatrixAt(idx, dummy.matrix);
    });
    this.arvoresInstanced.instanceMatrix.needsUpdate = true;
    this.grupoMundo.add(this.arvoresInstanced);

    const aldeoes = this.layout.aldeoes;
    this.aldeoesInstanced = new THREE.InstancedMesh(
      criarGeometriaAldeao(),
      matVerticeColorido,
      aldeoes.length
    );
    aldeoes.forEach((ald, idx) => {
      corTemp.set(ald.corRoupa);
      this.aldeoesInstanced!.setColorAt(idx, corTemp);
    });
    if (this.aldeoesInstanced.instanceColor) {
      this.aldeoesInstanced.instanceColor.needsUpdate = true;
    }
    this.grupoMundo.add(this.aldeoesInstanced);

    // Olhos do Cucu em 1 única InstancedMesh
    const olhoE = new THREE.BoxGeometry(0.28, 0.18, 0.12);
    olhoE.translate(-0.24, 0, 0);
    const olhoD = new THREE.BoxGeometry(0.28, 0.18, 0.12);
    olhoD.translate(0.24, 0, 0);
    const geoParOlhos = mergeGeometries([olhoE, olhoD], false)!;
    this.olhosCucuInstanced = new THREE.InstancedMesh(
      geoParOlhos,
      new THREE.MeshBasicMaterial({ color: '#f8d040' }),
      this.layout.olhosCucu.length
    );
    this.layout.olhosCucu.forEach((olho, idx) => {
      dummy.position.set(olho.x, olho.y, olho.z);
      dummy.rotation.set(0, olho.rotacaoY, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      this.olhosCucuInstanced!.setMatrixAt(idx, dummy.matrix);
    });
    this.olhosCucuInstanced.instanceMatrix.needsUpdate = true;
    this.olhosCucuInstanced.visible = false;
    this.grupoMundo.add(this.olhosCucuInstanced);
  }

  private reconstruirMarcosEOlhosCucu() {
    if (!this.layout) return;

    this.grupoMarcos.clear();
    this.malhasMarcos.clear();

    const matVerticeColorido = this.matVerticeColorido;

    for (const marco of this.layout.marcos) {
      if (!marco.desbloqueado) continue;
      const geo = criarGeometriaMarco(marco.tipo);
      const mesh = new THREE.Mesh(geo, matVerticeColorido);
      mesh.position.set(marco.x, marco.y, marco.z);
      mesh.rotation.y = marco.rotacaoY;
      mesh.scale.setScalar(marco.escala);
      mesh.userData = { tipoMarco: marco.tipo };
      this.grupoMarcos.add(mesh);
      this.malhasMarcos.set(marco.tipo, mesh);
    }

    const urnaMesh = new THREE.Mesh(criarGeometriaUrna(), matVerticeColorido);
    urnaMesh.position.set(
      this.layout.urnaPosicao.x,
      this.layout.urnaPosicao.y,
      this.layout.urnaPosicao.z
    );
    urnaMesh.userData = { tipoMarco: 'urna' };
    this.grupoMarcos.add(urnaMesh);
    this.malhasMarcos.set('urna', urnaMesh);
  }

  public animarConstrucaoMarco(tipo: MarcoTipo) {
    if (!this.layout) return;
    const marco = this.layout.marcos.find((m) => m.tipo === tipo);
    if (marco) {
      marco.desbloqueado = true;
    }
    this.reconstruirMarcosEOlhosCucu();
    this.animacoesObra.set(tipo, { progresso: 0.01 });

    const alvo = marco ?? { x: 0, y: 0, z: 0 };
    if (this.poeiraObraPoints) {
      const attr = this.poeiraObraPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < attr.count; i++) {
        const ang = (i / attr.count) * Math.PI * 2;
        const raio = 1.5 + (i % 7) * 0.6;
        attr.setXYZ(
          i,
          alvo.x + Math.cos(ang) * raio,
          0.5 + (i % 5) * 0.6,
          alvo.z + Math.sin(ang) * raio
        );
      }
      attr.needsUpdate = true;
      this.poeiraObraPoints.visible = true;
      this.tempoPoeiraRestante = 3.0;
    }
    sons.tocarPlim();
  }

  public definirMinhaCasa(casaIdx: number | null, voarAteEla = false) {
    this.minhaCasaIdx = casaIdx;
    this.atualizarDestaquesCasas();
    if (voarAteEla && casaIdx !== null) {
      this.voarParaCasa(casaIdx);
      sons.tocarPlim();
    }
  }

  public definirCasaAssustada(casaIdx: number | null) {
    this.casaAssustadaIdx = casaIdx;
    this.atualizarDestaquesCasas();
  }

  public selecionarCasa(casaIdx: number | null, voarAteEla = false) {
    this.casaSelecionadaIdx = casaIdx;
    this.atualizarDestaquesCasas();
    this.opcoes.aoSelecionarCasa(casaIdx);
    if (voarAteEla && casaIdx !== null) {
      this.voarParaCasa(casaIdx);
    }
  }

  public voarParaCasa(casaIdx: number) {
    if (!this.layout) return;
    const pos = this.layout.posicoesCasas[casaIdx];
    if (!pos) return;
    this.alvoCameraDesejado.set(pos.x, 0, pos.z);
    this.zoomDesejado = Math.max(this.zoomDesejado, 1.35);
  }

  public voarParaPonto(x: number, z: number, zoom = 1.15) {
    this.alvoCameraDesejado.set(x, 0, z);
    this.zoomDesejado = zoom;
  }

  public girarCameraPassos(passosNoventaGraus: number) {
    this.anguloAzimuteDesejado += passosNoventaGraus * (Math.PI / 2);
    sons.tocarClique();
  }

  public ajustarZoom(fatorDelta: number) {
    this.zoomDesejado = THREE.MathUtils.clamp(this.zoomDesejado + fatorDelta, 0.42, 3.2);
  }

  public definirHorarioManual(progresso: number | null) {
    this.overrideProgressoDia = progresso;
  }

  private atualizarDestaquesCasas() {
    if (!this.layout) return;

    if (this.casaSelecionadaIdx !== null && this.layout.posicoesCasas[this.casaSelecionadaIdx]) {
      const p = this.layout.posicoesCasas[this.casaSelecionadaIdx];
      this.anelSelecao.position.set(p.x, 0.08, p.z);
      this.anelSelecao.visible = true;
    } else {
      this.anelSelecao.visible = false;
    }

    if (this.minhaCasaIdx !== null && this.layout.posicoesCasas[this.minhaCasaIdx]) {
      const p = this.layout.posicoesCasas[this.minhaCasaIdx];
      this.anelMinhaCasa.position.set(p.x, 0, p.z);
      this.anelMinhaCasa.visible = true;
    } else {
      this.anelMinhaCasa.visible = false;
    }

    if (this.casaAssustadaIdx !== null && this.layout.posicoesCasas[this.casaAssustadaIdx]) {
      const p = this.layout.posicoesCasas[this.casaAssustadaIdx];
      this.iconeAssustada.position.set(p.x, 0, p.z);
      this.iconeAssustada.visible = true;
    } else {
      this.iconeAssustada.visible = false;
    }
    this.emitirPlacasProjetadas();
  }

  private registrarEventosInteracao() {
    const aoRedimensionar = () => {
      if (this.destruido) return;
      const w = window.innerWidth;
      const h = Math.max(1, window.innerHeight);
      const aspecto = w / h;
      const frustum = 92;
      this.camera.left = (-frustum * aspecto) / 2;
      this.camera.right = (frustum * aspecto) / 2;
      this.camera.top = frustum / 2;
      this.camera.bottom = -frustum / 2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', aoRedimensionar);

    this.canvas.addEventListener('pointerdown', (e) => {
      this.ponteiroAtivo = true;
      this.arrastou = false;
      this.inicioPonteiro = { x: e.clientX, y: e.clientY };
      this.ultimoPonteiro = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.ponteiroAtivo) return;
      const dx = e.clientX - this.ultimoPonteiro.x;
      const dy = e.clientY - this.ultimoPonteiro.y;
      this.ultimoPonteiro = { x: e.clientX, y: e.clientY };

      if (Math.hypot(e.clientX - this.inicioPonteiro.x, e.clientY - this.inicioPonteiro.y) > 6) {
        this.arrastou = true;
      }

      if (this.arrastou) {
        const fatorPan = 0.15 / Math.max(0.42, this.zoom);
        const cosA = Math.cos(this.anguloAzimute);
        const sinA = Math.sin(this.anguloAzimute);

        const dirX = -sinA;
        const dirZ = cosA;
        const frenteX = -cosA;
        const frenteZ = -sinA;

        this.alvoCameraDesejado.x += (-dx * dirX + dy * frenteX) * fatorPan;
        this.alvoCameraDesejado.z += (-dx * dirZ + dy * frenteZ) * fatorPan;

        this.alvoCameraDesejado.x = THREE.MathUtils.clamp(this.alvoCameraDesejado.x, -120, 120);
        this.alvoCameraDesejado.z = THREE.MathUtils.clamp(this.alvoCameraDesejado.z, -185, 120);
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.ponteiroAtivo) return;
      const foiClique = !this.arrastou;
      this.ponteiroAtivo = false;
      if (foiClique && e.target === this.canvas) {
        this.processarCliqueCena(e.clientX, e.clientY);
      }
    });

    this.canvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.14 : -0.14;
        this.ajustarZoom(delta);
      },
      { passive: false }
    );
  }

  private processarCliqueCena(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera);

    const interMarcos = this.raycaster.intersectObjects(this.grupoMarcos.children, true);
    if (interMarcos.length > 0) {
      const tipo = interMarcos[0].object.userData?.tipoMarco as MarcoTipo | 'urna' | undefined;
      if (tipo) {
        sons.tocarClique();
        this.opcoes.aoClicarMarco(tipo);
        return;
      }
    }

    const alvosCasas: THREE.Object3D[] = [];
    if (this.paredeInstanced) alvosCasas.push(this.paredeInstanced);
    if (this.telhadoInstanced) alvosCasas.push(this.telhadoInstanced);

    const intersecoes = this.raycaster.intersectObjects(alvosCasas, false);
    if (intersecoes.length > 0 && typeof intersecoes[0].instanceId === 'number') {
      const casaIdx = intersecoes[0].instanceId;
      sons.tocarClique();
      this.selecionarCasa(casaIdx, false);
      return;
    }
  }

  private atualizarTransformacaoCamera(imediato = false) {
    const fator = imediato ? 1 : 0.12;
    this.alvoCamera.lerp(this.alvoCameraDesejado, fator);
    this.anguloAzimute += (this.anguloAzimuteDesejado - this.anguloAzimute) * fator;
    this.zoom += (this.zoomDesejado - this.zoom) * fator;

    const distHorizontal = this.raioCamera * Math.cos(INCLINACAO_ISOMETRICA_RAD);
    const alturaY = this.raioCamera * Math.sin(INCLINACAO_ISOMETRICA_RAD);

    this.camera.position.set(
      this.alvoCamera.x + Math.cos(this.anguloAzimute) * distHorizontal,
      alturaY,
      this.alvoCamera.z + Math.sin(this.anguloAzimute) * distHorizontal
    );
    this.camera.lookAt(this.alvoCamera);

    if (Math.abs(this.camera.zoom - this.zoom) > 0.001 || imediato) {
      this.camera.zoom = this.zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  private atualizarCicloDiaENoite(tempoSegundos: number): { progresso: number; ehNoite: boolean } {
    const progresso =
      this.overrideProgressoDia !== null
        ? this.overrideProgressoDia
        : ((Date.now() - this.inicioCicloMs) % DURACAO_CICLO_COMPLETO_MS) /
          DURACAO_CICLO_COMPLETO_MS;

    const ehNoite = progresso >= 0.58 && progresso <= 0.92;

    if (ehNoite !== this.eraNoiteAnterior) {
      if (ehNoite) {
        this.opcoes.aoEntrarNaNoite?.();
      }
      this.eraNoiteAnterior = ehNoite;
      this.dispararMetricasAgora(progresso, ehNoite);
    }

    const corCeu = new THREE.Color();
    if (progresso < 0.45) {
      corCeu.copy(COR_CEU_DIA);
    } else if (progresso < 0.58) {
      const t = (progresso - 0.45) / 0.13;
      corCeu.lerpColors(COR_CEU_DIA, COR_CEU_TARDE, Math.min(1, t * 1.4));
      if (t > 0.5) {
        corCeu.lerpColors(COR_CEU_TARDE, COR_NOITE_AZUL, (t - 0.5) * 2);
      }
    } else if (progresso <= 0.88) {
      corCeu.copy(COR_NOITE_AZUL);
    } else {
      const t = (progresso - 0.88) / 0.12;
      corCeu.lerpColors(COR_NOITE_AZUL, COR_CEU_DIA, t);
    }

    this.scene.background = corCeu;
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(corCeu);
    }

    if (this.matGrama) {
      this.matGrama.color.copy(ehNoite ? COR_GRAMA_NOITE : COR_GRAMA_DIA);
    }
    if (this.matAgua) {
      this.matAgua.color.copy(ehNoite ? COR_AGUA_NOITE : COR_AGUA_DIA);
    }

    const anguloAstro = progresso * Math.PI * 2;
    this.luzSolLua.position.set(
      Math.cos(anguloAstro) * 90,
      Math.max(25, Math.sin(anguloAstro) * 110 + 45),
      60
    );

    if (ehNoite) {
      this.matVerticeColorido.color.set('#93a8e8');
      this.luzSolLua.intensity = 0.25;
      this.luzSolLua.color.set('#5578ff');
      this.luzAmbiente.intensity = 0.28;
      this.luzFogueiraCentral.intensity = 3.8 + Math.sin(tempoSegundos * 11) * 0.5;
    } else {
      this.matVerticeColorido.color.set('#ffffff');
      this.luzSolLua.intensity = 1.25;
      this.luzSolLua.color.set('#fff6dc');
      this.luzAmbiente.intensity = 0.9;
      this.luzFogueiraCentral.intensity = 1.8 + Math.sin(tempoSegundos * 10) * 0.25;
    }

    if (this.vagalumesPoints) {
      this.vagalumesPoints.visible = ehNoite;
      this.vagalumesPoints.position.y = Math.sin(tempoSegundos * 1.8) * 0.35;
    }

    if (this.olhosCucuInstanced) {
      this.olhosCucuInstanced.visible = ehNoite && Math.sin(tempoSegundos * 2.4) > -0.7;
    }

    return { progresso, ehNoite };
  }

  private atualizarAnimacoesCena(tempoSegundos: number, dt: number) {
    this.chamasFogueira.forEach((chama, idx) => {
      const s = 0.92 + Math.sin(tempoSegundos * (10 + idx * 3)) * 0.14;
      chama.scale.set(1, s, 1);
    });

    if (this.aguaMesh) {
      this.aguaMesh.position.y = -0.55 + Math.sin(tempoSegundos * 1.5) * 0.04;
    }

    if (this.anelMinhaCasa.visible) {
      const estrela = this.anelMinhaCasa.getObjectByName('estrelaMinhaCasa');
      if (estrela) {
        estrela.rotation.y = tempoSegundos * 2.2;
        estrela.position.y = 4.5 + Math.sin(tempoSegundos * 3.5) * 0.25;
      }
    }

    if (this.iconeAssustada.visible) {
      this.iconeAssustada.position.y = Math.sin(tempoSegundos * 8) * 0.12;
    }

    if (this.aldeoesInstanced && this.layout) {
      const dummy = new THREE.Object3D();
      const aldeoes = this.layout.aldeoes;
      for (let i = 0; i < aldeoes.length; i++) {
        const ald = aldeoes[i];
        const angulo = ald.anguloInicial + tempoSegundos * ald.velocidade;
        const cx = ald.regiao === 1 ? CENTRO_ILHA_NORTE.x : 0;
        const cz = ald.regiao === 1 ? CENTRO_ILHA_NORTE.z : 0;
        const x = cx + Math.cos(angulo) * ald.raio;
        const z = cz + Math.sin(angulo) * ald.raio;
        const pulinho = Math.abs(Math.sin(tempoSegundos * 7 + i)) * 0.14;

        dummy.position.set(x, pulinho, z);
        dummy.rotation.set(0, -angulo + (ald.velocidade > 0 ? 0 : Math.PI), 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        this.aldeoesInstanced.setMatrixAt(i, dummy.matrix);
      }
      this.aldeoesInstanced.instanceMatrix.needsUpdate = true;
    }

    for (const [tipo, anim] of this.animacoesObra.entries()) {
      anim.progresso = Math.min(1, anim.progresso + dt * 1.4);
      const malha = this.malhasMarcos.get(tipo);
      const marco = this.layout?.marcos.find((m) => m.tipo === tipo);
      if (malha && marco) {
        const t = anim.progresso;
        const mola = t < 0.8 ? (t / 0.8) * 1.15 : 1.15 - ((t - 0.8) / 0.2) * 0.15;
        malha.scale.setScalar(marco.escala * mola);
      }
      if (anim.progresso >= 1) {
        this.animacoesObra.delete(tipo);
      }
    }

    if (this.tempoPoeiraRestante > 0 && this.poeiraObraPoints) {
      this.tempoPoeiraRestante -= dt;
      this.poeiraObraPoints.position.y += dt * 1.2;
      if (this.tempoPoeiraRestante <= 0) {
        this.poeiraObraPoints.visible = false;
        this.poeiraObraPoints.position.y = 0;
      }
    }
  }

  private projetarPontoParaTela(
    x: number,
    y: number,
    z: number
  ): { x: number; y: number; visivel: boolean } {
    const v = new THREE.Vector3(x, y, z);
    v.project(this.camera);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const telaX = (v.x * 0.5 + 0.5) * w;
    const telaY = (-(v.y * 0.5) + 0.5) * h;
    const visivel =
      v.z >= -1 && v.z <= 1 && telaX >= -80 && telaX <= w + 80 && telaY >= -80 && telaY <= h + 80;
    return { x: telaX, y: telaY, visivel };
  }

  private emitirPlacasProjetadas() {
    if (!this.layout) return;
    const placas: Placa3DProjetada[] = [];

    if (this.minhaCasaIdx !== null && this.moradores[this.minhaCasaIdx]) {
      const m = this.moradores[this.minhaCasaIdx];
      const pos = this.layout.posicoesCasas[this.minhaCasaIdx];
      if (pos) {
        const proj = this.projetarPontoParaTela(pos.x, 4.9, pos.z);
        placas.push({
          id: `minha-casa-${m.casa_idx}`,
          texto: `${m.nome.toUpperCase()} · ${m.profissao.toUpperCase()}`,
          subtitulo: `SUA CASA (#${m.casa_idx + 1})`,
          x: proj.x,
          y: proj.y,
          visivel: proj.visivel,
          destaque: 'minha_casa',
        });
      }
    }

    if (
      this.casaSelecionadaIdx !== null &&
      this.casaSelecionadaIdx !== this.minhaCasaIdx &&
      this.moradores[this.casaSelecionadaIdx]
    ) {
      const m = this.moradores[this.casaSelecionadaIdx];
      const pos = this.layout.posicoesCasas[this.casaSelecionadaIdx];
      if (pos) {
        const proj = this.projetarPontoParaTela(pos.x, 3.6, pos.z);
        placas.push({
          id: `selecionada-${m.casa_idx}`,
          texto: `${m.nome.toUpperCase()} · ${m.profissao.toUpperCase()}`,
          subtitulo: `CASA #${m.casa_idx + 1}${m.arroba ? ` · @${m.arroba}` : ''}`,
          x: proj.x,
          y: proj.y,
          visivel: proj.visivel,
          destaque: 'selecionada',
        });
      }
    }

    if (
      this.casaAssustadaIdx !== null &&
      this.casaAssustadaIdx !== this.casaSelecionadaIdx &&
      this.moradores[this.casaAssustadaIdx]
    ) {
      const m = this.moradores[this.casaAssustadaIdx];
      const pos = this.layout.posicoesCasas[this.casaAssustadaIdx];
      if (pos) {
        const proj = this.projetarPontoParaTela(pos.x, 4.2, pos.z);
        placas.push({
          id: `assustada-${m.casa_idx}`,
          texto: `CASA ASSUSTADA PELO CUCU!`,
          subtitulo: `${m.nome} (#${m.casa_idx + 1})`,
          x: proj.x,
          y: proj.y,
          visivel: proj.visivel,
          destaque: 'assustada',
        });
      }
    }

    const projUrna = this.projetarPontoParaTela(
      this.layout.urnaPosicao.x,
      2.6,
      this.layout.urnaPosicao.z
    );
    placas.push({
      id: 'marco-urna',
      texto: 'URNA DA VILA',
      subtitulo: 'Toque para votar',
      x: projUrna.x,
      y: projUrna.y,
      visivel: projUrna.visivel && this.zoom >= 0.65,
      destaque: 'marco',
    });

    this.opcoes.aoAtualizarPlacas(placas);
  }

  private ajustarQualidadeAutomatica(fpsMedido: number) {
    if (fpsMedido < 32 && this.qualidade === 'alta') {
      this.segundosFpsBaixo += 1;
      if (this.segundosFpsBaixo >= 2) {
        this.qualidade = 'economica';
        this.pixelRatioAtual = Math.min(this.pixelRatioAtual, 1);
        this.renderer.setPixelRatio(this.pixelRatioAtual);
      }
    } else {
      this.segundosFpsBaixo = 0;
    }
  }

  private dispararMetricasAgora(progresso: number, ehNoite: boolean) {
    this.opcoes.aoAtualizarMetricas({
      fps: this.fpsAtual,
      drawCalls: this.renderer.info.render.calls,
      casasVisiveis: this.moradores.length,
      qualidade: this.qualidade,
      pixelRatio: this.pixelRatioAtual,
      progressoCicloDia: progresso,
      ehNoite,
    });
  }

  private iniciarLoop() {
    let ultimoTempo = performance.now();

    const loop = (agora: number) => {
      if (this.destruido) return;
      this.animFrameId = requestAnimationFrame(loop);

      const dt = Math.min(0.1, (agora - ultimoTempo) / 1000);
      ultimoTempo = agora;
      const tempoSegundos = agora / 1000;

      const cameraMovendo =
        this.alvoCamera.distanceToSquared(this.alvoCameraDesejado) > 0.002 ||
        Math.abs(this.anguloAzimute - this.anguloAzimuteDesejado) > 0.002 ||
        Math.abs(this.zoom - this.zoomDesejado) > 0.002;

      this.atualizarTransformacaoCamera(false);
      const { progresso, ehNoite } = this.atualizarCicloDiaENoite(tempoSegundos);
      this.atualizarAnimacoesCena(tempoSegundos, dt);

      this.renderer.render(this.scene, this.camera);

      this.contadorFrames++;
      if (agora - this.ultimoTempoFps >= 1000) {
        this.fpsAtual = Math.round((this.contadorFrames * 1000) / (agora - this.ultimoTempoFps));
        this.contadorFrames = 0;
        this.ultimoTempoFps = agora;
        this.ajustarQualidadeAutomatica(this.fpsAtual);
        this.dispararMetricasAgora(progresso, ehNoite);
        this.emitirPlacasProjetadas();
      } else if (cameraMovendo && agora - this.ultimoDisparoMetricas >= 90) {
        this.ultimoDisparoMetricas = agora;
        this.emitirPlacasProjetadas();
      }
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public destruir() {
    this.destruido = true;
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
  }
}
