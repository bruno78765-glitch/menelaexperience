import seedMoradoresJson from '../../seed/moradores.json';
import type {
  ContribuicaoObra,
  DeverSemanal,
  EstoqueRecursos,
  EventoVila,
  Morador,
  NivelMorador,
  ObraSemanal,
  OfertaMercado,
  ProfissaoId,
  RecursoTipo,
  ReivindicacaoCasa,
  VotacaoVila,
  VotoMorador,
} from '../tipos';
import {
  criarEstoqueInicial,
  cumprirDeverSemanal,
  executarColetaProfissao,
  executarTrocaMercadoAtomica,
  gerarDeverSemanal,
} from '../../regras/economia';
import { apurarContagemVotos, encerrarVotacao, registrarVotoUrna } from '../../regras/votacao';
import { resolverNoiteDoCucu } from '../../regras/cucu';
import { encontrarCasaLivreMaisProxima } from '../vila/geradorVila';
import { supabase, temSupabaseConfigurado } from './supabaseCliente';
import { converterEstadoParaMoradores, type MoradorBrutoVideo } from './importadorNavegador';

const CHAVE_STORAGE = 'asterion_estado_v1';
const CANAL_BROADCAST = 'asterion_sincronia_abas';

export interface EstadoJogo {
  modoOffline: boolean;
  diaVila: number;
  semanaVila: number;
  emailUsuario: string | null;
  userId: string | null;
  meuMoradorId: string | null;
  minhaCasaIdx: number | null;
  casaSelecionadaIdx: number | null;
  casaAssustadaIdx: number | null;
  conviteVizinhoIdx: number | null;
  moradores: Morador[];
  estoquesPorMorador: Record<string, EstoqueRecursos>;
  carteirasPorMorador: Record<string, number>;
  niveisPorMorador: Record<string, NivelMorador>;
  deveresPorMorador: Record<string, DeverSemanal>;
  ofertas: OfertaMercado[];
  obraAtual: ObraSemanal;
  contribuicoes: ContribuicaoObra[];
  votacaoAtual: VotacaoVila;
  votos: VotoMorador[];
  reivindicacoes: ReivindicacaoCasa[];
  eventos: EventoVila[];
}

function criarEstadoInicialPadrao(): EstadoJogo {
  const moradoresIniciais = (seedMoradoresJson as Morador[]).map((m) => ({
    ...m,
    ultima_coleta_em: null,
  }));

  const estoquesPorMorador: Record<string, EstoqueRecursos> = {};
  const carteirasPorMorador: Record<string, number> = {};
  const niveisPorMorador: Record<string, NivelMorador> = {};
  const deveresPorMorador: Record<string, DeverSemanal> = {};

  for (let i = 0; i < Math.min(moradoresIniciais.length, 25); i++) {
    const m = moradoresIniciais[i];
    estoquesPorMorador[m.id] = {
      ferramentas: m.profissao === 'ferreiro' ? 3 : 1,
      comida: m.profissao === 'fazendeiro' ? 3 : 1,
      madeira: m.profissao === 'lenhador' ? 3 : 1,
      alegria: m.profissao === 'bardo' ? 2 : 1,
      protecao: m.profissao === 'mago' ? 2 : 1,
      tecido: m.profissao === 'costureira' ? 2 : 1,
      moedas: m.profissao === 'mercador' ? 3 : 1,
    };
    carteirasPorMorador[m.id] = 25;
    niveisPorMorador[m.id] = {
      morador_id: m.id,
      xp: m.fundador ? 70 : 20,
      titulo: m.fundador ? 'Artífice' : 'Aprendiz',
    };
    deveresPorMorador[m.id] = gerarDeverSemanal(m.id, m.profissao, 1);
  }

  const mFerreiro =
    moradoresIniciais.find((m) => m.profissao === 'ferreiro') ?? moradoresIniciais[0];
  const mFazendeiro =
    moradoresIniciais.find((m) => m.profissao === 'fazendeiro') ?? moradoresIniciais[1];
  const mLenhador =
    moradoresIniciais.find((m) => m.profissao === 'lenhador') ?? moradoresIniciais[2];

  const ofertasIniciais: OfertaMercado[] = [
    {
      id: 'of-inicial-1',
      vendedor_id: mFerreiro.id,
      vendedor_nome: mFerreiro.nome,
      tipo: 'ferramentas',
      qtd: 1,
      preco: 10,
      status: 'aberta',
      comprador_id: null,
      criado_em: new Date(Date.now() - 1800_000).toISOString(),
    },
    {
      id: 'of-inicial-2',
      vendedor_id: mFazendeiro.id,
      vendedor_nome: mFazendeiro.nome,
      tipo: 'comida',
      qtd: 2,
      preco: 12,
      status: 'aberta',
      comprador_id: null,
      criado_em: new Date(Date.now() - 1200_000).toISOString(),
    },
    {
      id: 'of-inicial-3',
      vendedor_id: mLenhador.id,
      vendedor_nome: mLenhador.nome,
      tipo: 'madeira',
      qtd: 2,
      preco: 11,
      status: 'aberta',
      comprador_id: null,
      criado_em: new Date(Date.now() - 900_000).toISOString(),
    },
  ];

  const obraAtual: ObraSemanal = {
    id: 'obra-muralha-s1',
    nome: 'Muralha Protetora de Asterion',
    tipo: 'muralha',
    meta: {
      madeira: 12,
      ferramentas: 8,
      comida: 8,
      protecao: 6,
    },
    progresso: {
      madeira: 9,
      ferramentas: 6,
      comida: 7,
      protecao: 5,
    },
    status: 'em_andamento',
    semana: 1,
  };

  const votacaoAtual: VotacaoVila = {
    id: 'votacao-semana-1',
    pergunta: 'Qual deve ser o próximo marco construído pela vila de Asterion?',
    opcoes: [
      'Farol Místico da Ilha Norte',
      'Grande Biblioteca dos Magos',
      'Anfiteatro dos Bardos na Fogueira',
    ],
    abre_em: new Date(Date.now() - 86400_000).toISOString(),
    fecha_em: new Date(Date.now() + 7 * 86400_000).toISOString(),
    vencedora: null,
    votos_por_opcao: {
      'Farol Místico da Ilha Norte': 18,
      'Grande Biblioteca dos Magos': 14,
      'Anfiteatro dos Bardos na Fogueira': 11,
    },
  };

  const votosIniciais: VotoMorador[] = [];
  for (let i = 0; i < 43 && i < moradoresIniciais.length; i++) {
    const opIdx = i < 18 ? 0 : i < 32 ? 1 : 2;
    votosIniciais.push({
      votacao_id: votacaoAtual.id,
      morador_id: moradoresIniciais[i].id,
      opcao: votacaoAtual.opcoes[opIdx],
    });
  }

  return {
    modoOffline: !temSupabaseConfigurado,
    diaVila: 32,
    semanaVila: 1,
    emailUsuario: null,
    userId: null,
    meuMoradorId: null,
    minhaCasaIdx: null,
    casaSelecionadaIdx: 0,
    casaAssustadaIdx: null,
    conviteVizinhoIdx: lerParametroConviteUrl(),
    moradores: moradoresIniciais,
    estoquesPorMorador,
    carteirasPorMorador,
    niveisPorMorador,
    deveresPorMorador,
    ofertas: ofertasIniciais,
    obraAtual,
    contribuicoes: [],
    votacaoAtual,
    votos: votosIniciais,
    reivindicacoes: [
      {
        id: 'reiv-exemplo-1',
        user_id: 'usr-demo-1',
        email: 'seguidor@asterion.gg',
        arroba: moradoresIniciais[1]?.arroba ?? 'helena_do_vale_2',
        codigo: 'AST-7421',
        status: 'pendente',
        criado_em: new Date(Date.now() - 600_000).toISOString(),
      },
    ],
    eventos: [
      {
        id: 'evt-inicial-1',
        tipo: 'novo_morador',
        dados: {
          resumo: 'A vila alcançou 800 moradores! A ponte para a Ilha Norte foi aberta.',
        },
        criado_em: new Date(Date.now() - 3600_000).toISOString(),
      },
    ],
  };
}

function lerParametroConviteUrl(): number | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const convite = params.get('convite');
  if (!convite) return null;
  const idx = Number.parseInt(convite, 10);
  return Number.isFinite(idx) && idx >= 0 ? idx : null;
}

type OuvinteEstado = (estado: EstadoJogo) => void;
type OuvinteEventoCena = (evento: {
  tipo: 'voar_casa' | 'obra_concluida' | 'noite_cucu';
  casaIdx?: number;
  marcoTipo?: string;
}) => void;

export class RepositorioJogo {
  private estado: EstadoJogo;
  private ouvintes = new Set<OuvinteEstado>();
  private ouvintesCena = new Set<OuvinteEventoCena>();
  private canalAbas: BroadcastChannel | null = null;

  constructor() {
    this.estado = this.carregarEstadoSalvo();
    this.configurarSincroniaEmTempoReal();
  }

  private carregarEstadoSalvo(): EstadoJogo {
    const padrao = criarEstadoInicialPadrao();
    if (typeof window === 'undefined') return padrao;

    try {
      const salvo = window.localStorage.getItem(CHAVE_STORAGE);
      if (!salvo) return padrao;
      const parsed = JSON.parse(salvo) as Partial<EstadoJogo>;
      if (!parsed.moradores || parsed.moradores.length < 100) {
        return padrao;
      }
      return {
        ...padrao,
        ...parsed,
        conviteVizinhoIdx: lerParametroConviteUrl() ?? parsed.conviteVizinhoIdx ?? null,
      };
    } catch {
      return padrao;
    }
  }

  private salvarEstado(transmitirParaAbas = true) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(this.estado));
      if (transmitirParaAbas && this.canalAbas) {
        this.canalAbas.postMessage({
          tipo: 'ATUALIZACAO_ESTADO',
          obraAtual: this.estado.obraAtual,
          contribuicoes: this.estado.contribuicoes,
          votacaoAtual: this.estado.votacaoAtual,
          votos: this.estado.votos,
          ofertas: this.estado.ofertas,
          eventos: this.estado.eventos,
          reivindicacoes: this.estado.reivindicacoes,
        });
      }
    } catch {
      // Ignora falha de quota em modo privado
    }
    this.notificar();
  }

  private configurarSincroniaEmTempoReal() {
    if (typeof window === 'undefined') return;

    if ('BroadcastChannel' in window) {
      this.canalAbas = new BroadcastChannel(CANAL_BROADCAST);
      this.canalAbas.onmessage = (ev) => {
        const msg = ev.data;
        if (msg?.tipo === 'ATUALIZACAO_ESTADO') {
          const estavaEmAndamento = this.estado.obraAtual.status === 'em_andamento';
          this.estado = {
            ...this.estado,
            obraAtual: msg.obraAtual ?? this.estado.obraAtual,
            contribuicoes: msg.contribuicoes ?? this.estado.contribuicoes,
            votacaoAtual: msg.votacaoAtual ?? this.estado.votacaoAtual,
            votos: msg.votos ?? this.estado.votos,
            ofertas: msg.ofertas ?? this.estado.ofertas,
            eventos: msg.eventos ?? this.estado.eventos,
            reivindicacoes: msg.reivindicacoes ?? this.estado.reivindicacoes,
          };
          if (estavaEmAndamento && this.estado.obraAtual.status === 'concluida') {
            this.emitirEventoCena({
              tipo: 'obra_concluida',
              marcoTipo: this.estado.obraAtual.tipo,
            });
          }
          this.notificar();
        }
      };
    }

    window.addEventListener('storage', (ev) => {
      if (ev.key === CHAVE_STORAGE && ev.newValue) {
        try {
          const novo = JSON.parse(ev.newValue) as EstadoJogo;
          this.estado = {
            ...this.estado,
            obraAtual: novo.obraAtual,
            contribuicoes: novo.contribuicoes,
            votacaoAtual: novo.votacaoAtual,
            votos: novo.votos,
            ofertas: novo.ofertas,
            eventos: novo.eventos,
            reivindicacoes: novo.reivindicacoes,
          };
          this.notificar();
        } catch {
          // Ignora JSON inválido
        }
      }
    });

    // Se Supabase estiver configurado, assina canal Realtime para obras, contribuições e votações
    if (supabase) {
      supabase
        .channel('asterion-vila-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'obras' }, (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const novaObra = payload.new as ObraSemanal;
            const concluiuAgora =
              this.estado.obraAtual.status !== 'concluida' && novaObra.status === 'concluida';
            this.estado = { ...this.estado, obraAtual: novaObra };
            if (concluiuAgora) {
              this.emitirEventoCena({ tipo: 'obra_concluida', marcoTipo: novaObra.tipo });
            }
            this.notificar();
          }
        })
        .subscribe();
    }
  }

  public obterEstado(): EstadoJogo {
    return this.estado;
  }

  public inscrever(ouvinte: OuvinteEstado): () => void {
    this.ouvintes.add(ouvinte);
    return () => this.ouvintes.delete(ouvinte);
  }

  public inscreverEventosCena(ouvinte: OuvinteEventoCena): () => void {
    this.ouvintesCena.add(ouvinte);
    return () => this.ouvintesCena.delete(ouvinte);
  }

  private notificar() {
    for (const ouvinte of this.ouvintes) {
      ouvinte(this.estado);
    }
  }

  private emitirEventoCena(ev: {
    tipo: 'voar_casa' | 'obra_concluida' | 'noite_cucu';
    casaIdx?: number;
    marcoTipo?: string;
  }) {
    for (const fn of this.ouvintesCena) {
      fn(ev);
    }
  }

  public selecionarCasa(casaIdx: number | null) {
    this.estado = { ...this.estado, casaSelecionadaIdx: casaIdx };
    this.notificar();
  }

  public garantirDadosMorador(morador: Morador) {
    if (!this.estado.estoquesPorMorador[morador.id]) {
      this.estado.estoquesPorMorador[morador.id] = {
        ...criarEstoqueInicial(),
        ferramentas: 1,
        comida: 1,
        madeira: 1,
      };
    }
    if (this.estado.carteirasPorMorador[morador.id] === undefined) {
      this.estado.carteirasPorMorador[morador.id] = 25;
    }
    if (!this.estado.niveisPorMorador[morador.id]) {
      this.estado.niveisPorMorador[morador.id] = {
        morador_id: morador.id,
        xp: morador.fundador ? 70 : 15,
        titulo: morador.fundador ? 'Artífice' : 'Aprendiz',
      };
    }
    if (!this.estado.deveresPorMorador[morador.id]) {
      this.estado.deveresPorMorador[morador.id] = gerarDeverSemanal(
        morador.id,
        morador.profissao,
        this.estado.semanaVila
      );
    }
  }

  /**
   * Login por link mágico de e-mail (Supabase Auth signInWithOtp ou simulação instantânea no modo offline)
   */
  public async entrarComLinkMagico(
    email: string
  ): Promise<{ mensagem: string; modoOffline: boolean }> {
    const emailLimpo = email.trim().toLowerCase();
    if (!emailLimpo || !emailLimpo.includes('@')) {
      throw new Error('Digite um e-mail válido para receber o link mágico.');
    }

    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailLimpo,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        throw new Error(`Erro ao enviar link mágico: ${error.message}`);
      }
    }

    const userId = `usr-${emailLimpo.replace(/[^a-z0-9]/g, '')}`;
    this.estado = {
      ...this.estado,
      emailUsuario: emailLimpo,
      userId,
    };
    this.salvarEstado();

    return {
      mensagem: temSupabaseConfigurado
        ? `Link mágico enviado para ${emailLimpo}! Verifique sua caixa de entrada.`
        : `Sessão iniciada com ${emailLimpo} (Modo Demo Local). Agora reivindique sua casa!`,
      modoOffline: !temSupabaseConfigurado,
    };
  }

  /**
   * Jogador solicita reivindicação de casa digitando seu @arroba do Instagram
   */
  public solicitarReivindicacaoCasa(arrobaEntrada: string): ReivindicacaoCasa {
    const arroba = arrobaEntrada.replace(/^@+/, '').trim().toLowerCase();
    if (!arroba) {
      throw new Error('Digite seu @arroba do Instagram.');
    }

    const sufixo = Math.floor(1000 + Math.random() * 9000);
    const codigo = `AST-${sufixo}`;
    const reivindicacao: ReivindicacaoCasa = {
      id: `reiv-${Date.now()}`,
      user_id: this.estado.userId ?? 'usr-visitante',
      email: this.estado.emailUsuario ?? 'visitante@asterion.gg',
      arroba,
      codigo,
      status: 'pendente',
      criado_em: new Date().toISOString(),
    };

    this.estado = {
      ...this.estado,
      reivindicacoes: [reivindicacao, ...this.estado.reivindicacoes],
    };
    this.salvarEstado();
    return reivindicacao;
  }

  /**
   * Admin aprova a reivindicação de casa.
   * Se o @arroba já está no seed dos vídeos, vincula àquela casa.
   * Caso contrário, aloca a próxima casa livre (ou a casa mais perto de quem convidou!).
   */
  public aprovarReivindicacao(reivindicacaoId: string, tornarMinhaCasaNaSessao = true): Morador {
    const reiv = this.estado.reivindicacoes.find((r) => r.id === reivindicacaoId);
    if (!reiv) {
      throw new Error('Reivindicação não encontrada.');
    }

    let morador = this.estado.moradores.find(
      (m) => m.arroba?.toLowerCase() === reiv.arroba.toLowerCase()
    );

    if (!morador) {
      const ocupadas = new Set(this.estado.moradores.map((m) => m.casa_idx));
      let novoCasaIdx = this.estado.moradores.length;

      if (this.estado.conviteVizinhoIdx !== null) {
        const vagaVizinha = encontrarCasaLivreMaisProxima(
          this.estado.conviteVizinhoIdx,
          ocupadas,
          this.estado.moradores.length + 25
        );
        novoCasaIdx = vagaVizinha.casa_idx;
      }

      const profissoes: ProfissaoId[] = [
        'ferreiro',
        'fazendeiro',
        'lenhador',
        'bardo',
        'mago',
        'costureira',
        'mercador',
      ];
      morador = {
        id: `morador-${novoCasaIdx + 1}`,
        user_id: reiv.user_id,
        nome: reiv.arroba.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        arroba: reiv.arroba,
        profissao: profissoes[novoCasaIdx % profissoes.length],
        casa_idx: novoCasaIdx,
        regiao: novoCasaIdx >= 790 ? 1 : 0,
        cor_parede: '#f2ead8',
        cor_telhado: '#e2552e',
        fundador: false,
        segue_verificado: true,
        criado_em: new Date().toISOString(),
        ultima_coleta_em: null,
      };
      this.estado.moradores = [...this.estado.moradores, morador];
    } else {
      morador = { ...morador, user_id: reiv.user_id, segue_verificado: true };
      this.estado.moradores = this.estado.moradores.map((m) =>
        m.id === morador!.id ? morador! : m
      );
    }

    this.garantirDadosMorador(morador);

    const novasReiv = this.estado.reivindicacoes.map((r) =>
      r.id === reivindicacaoId
        ? { ...r, status: 'aprovada' as const, casa_idx_atribuida: morador!.casa_idx }
        : r
    );

    this.estado = {
      ...this.estado,
      reivindicacoes: novasReiv,
      meuMoradorId: tornarMinhaCasaNaSessao ? morador.id : this.estado.meuMoradorId,
      minhaCasaIdx: tornarMinhaCasaNaSessao ? morador.casa_idx : this.estado.minhaCasaIdx,
      casaSelecionadaIdx: morador.casa_idx,
    };

    this.salvarEstado();
    this.emitirEventoCena({ tipo: 'voar_casa', casaIdx: morador.casa_idx });
    return morador;
  }

  /**
   * Atalho para assumir imediatamente uma casa no modo demo ou após aprovação
   */
  public assumirCasaComoJogador(casaIdx: number) {
    const morador = this.estado.moradores.find((m) => m.casa_idx === casaIdx);
    if (!morador) return;
    this.garantirDadosMorador(morador);
    this.estado = {
      ...this.estado,
      meuMoradorId: morador.id,
      minhaCasaIdx: morador.casa_idx,
      casaSelecionadaIdx: morador.casa_idx,
      emailUsuario: this.estado.emailUsuario ?? `${morador.arroba ?? 'jogador'}@asterion.gg`,
    };
    this.salvarEstado();
    this.emitirEventoCena({ tipo: 'voar_casa', casaIdx: morador.casa_idx });
  }

  /**
   * Coleta recurso da profissão (a cada 4h) via Edge Function ou validador local
   */
  public async coletarRecursoDaMinhaCasa(): Promise<{ mensagem: string }> {
    const morador = this.obterMeuMorador();
    if (!morador) {
      throw new Error('Reivindique ou escolha sua casa primeiro para coletar recursos.');
    }
    this.garantirDadosMorador(morador);

    if (supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('coletar-recurso', {
          body: { morador_id: morador.id },
        });
        if (error) throw error;
        if (data?.erro) throw new Error(data.erro);
      } catch {
        // Fallback para regra validada localmente se Edge Function ainda não estiver publicada
      }
    }

    const estoqueAtual = this.estado.estoquesPorMorador[morador.id];
    const astrosAtuais = this.estado.carteirasPorMorador[morador.id] ?? 0;

    const resultado = executarColetaProfissao({
      profissao: morador.profissao,
      estoqueAtual,
      astrosAtuais,
      ultimaColetaIso: morador.ultima_coleta_em,
    });

    if (!resultado.sucesso) {
      throw new Error(resultado.erro ?? 'Ainda não é possível coletar.');
    }

    const moradoresAtualizados = this.estado.moradores.map((m) =>
      m.id === morador.id ? { ...m, ultima_coleta_em: resultado.novaUltimaColetaIso } : m
    );

    this.estado = {
      ...this.estado,
      moradores: moradoresAtualizados,
      estoquesPorMorador: {
        ...this.estado.estoquesPorMorador,
        [morador.id]: resultado.novoEstoque,
      },
      carteirasPorMorador: {
        ...this.estado.carteirasPorMorador,
        [morador.id]: resultado.novosAstros,
      },
    };
    this.salvarEstado();

    return {
      mensagem: `+1 ${resultado.recurso} e +${resultado.astrosGanhos} Astros coletados com sucesso!`,
    };
  }

  /**
   * Contribuir 1 unidade de um recurso para a Obra da Semana (sincroniza em tempo real entre abas!)
   */
  public async contribuirParaObra(tipoRecurso: RecursoTipo): Promise<{ concluiuObra: boolean }> {
    const morador = this.obterMeuMorador();
    if (!morador) {
      throw new Error('Reivindique sua casa antes de contribuir na Obra da Semana.');
    }
    this.garantirDadosMorador(morador);

    const obra = this.estado.obraAtual;
    if (obra.status === 'concluida') {
      throw new Error('A obra desta semana já foi concluída pela comunidade!');
    }

    const estoque = this.estado.estoquesPorMorador[morador.id];
    if ((estoque[tipoRecurso] ?? 0) < 1) {
      throw new Error(`Você não possui ${tipoRecurso} suficiente no estoque.`);
    }

    const metaRecurso = obra.meta[tipoRecurso] ?? 0;
    const progAtual = obra.progresso[tipoRecurso] ?? 0;
    if (progAtual >= metaRecurso) {
      throw new Error('Este recurso já atingiu 100% da meta na obra atual!');
    }

    const novoProgresso = {
      ...obra.progresso,
      [tipoRecurso]: progAtual + 1,
    };

    const concluiuObra = Object.entries(obra.meta).every(
      ([rec, meta]) => (novoProgresso[rec as RecursoTipo] ?? 0) >= (meta ?? 0)
    );

    const novaObra: ObraSemanal = {
      ...obra,
      progresso: novoProgresso,
      status: concluiuObra ? 'concluida' : 'em_andamento',
    };

    const novaContribuicao: ContribuicaoObra = {
      id: `contrib-${Date.now()}`,
      obra_id: obra.id,
      morador_id: morador.id,
      morador_nome: morador.nome,
      tipo: tipoRecurso,
      qtd: 1,
      criado_em: new Date().toISOString(),
    };

    const novosEventos = concluiuObra
      ? [
          {
            id: `evt-obra-${Date.now()}`,
            tipo: 'obra_pronta' as const,
            dados: {
              obraNome: obra.nome,
              resumo: `A comunidade concluiu a obra "${obra.nome}"!`,
            },
            criado_em: new Date().toISOString(),
          },
          ...this.estado.eventos,
        ]
      : this.estado.eventos;

    this.estado = {
      ...this.estado,
      obraAtual: novaObra,
      contribuicoes: [novaContribuicao, ...this.estado.contribuicoes.slice(0, 29)],
      estoquesPorMorador: {
        ...this.estado.estoquesPorMorador,
        [morador.id]: {
          ...estoque,
          [tipoRecurso]: estoque[tipoRecurso] - 1,
        },
      },
      carteirasPorMorador: {
        ...this.estado.carteirasPorMorador,
        [morador.id]: (this.estado.carteirasPorMorador[morador.id] ?? 0) + 4,
      },
      eventos: novosEventos,
    };

    this.salvarEstado(true);
    if (concluiuObra) {
      this.emitirEventoCena({ tipo: 'obra_concluida', marcoTipo: obra.tipo });
    }
    return { concluiuObra };
  }

  /**
   * Votar na Urna em frente ao Salão
   */
  public votarNaUrna(opcao: string) {
    const morador = this.obterMeuMorador();
    if (!morador) {
      throw new Error('Reivindique sua casa para votar na Urna da Vila.');
    }

    const resultado = registrarVotoUrna({
      votacao: this.estado.votacaoAtual,
      votosAtuais: this.estado.votos,
      moradorId: morador.id,
      opcaoEscolhida: opcao,
    });

    if (!resultado.sucesso) {
      throw new Error(resultado.erro ?? 'Não foi possível registrar o voto.');
    }

    this.estado = {
      ...this.estado,
      votos: resultado.votosRegistrados,
      votacaoAtual: {
        ...this.estado.votacaoAtual,
        votos_por_opcao: resultado.contagem,
      },
    };
    this.salvarEstado(true);
  }

  /**
   * Criar oferta de venda no Mercado da Vila
   */
  public criarOfertaMercado(tipo: RecursoTipo, qtd: number, preco: number) {
    const morador = this.obterMeuMorador();
    if (!morador) {
      throw new Error('Reivindique sua casa antes de anunciar no mercado.');
    }
    this.garantirDadosMorador(morador);

    const estoque = this.estado.estoquesPorMorador[morador.id];
    if ((estoque[tipo] ?? 0) < qtd) {
      throw new Error('Você não possui essa quantidade no seu estoque.');
    }

    const novaOferta: OfertaMercado = {
      id: `of-${Date.now()}`,
      vendedor_id: morador.id,
      vendedor_nome: morador.nome,
      tipo,
      qtd,
      preco,
      status: 'aberta',
      comprador_id: null,
      criado_em: new Date().toISOString(),
    };

    this.estado = {
      ...this.estado,
      ofertas: [novaOferta, ...this.estado.ofertas],
    };
    this.salvarEstado(true);
  }

  /**
   * Comprar oferta no Mercado de Astros (troca atômica)
   */
  public comprarOfertaMercado(ofertaId: string) {
    const comprador = this.obterMeuMorador();
    if (!comprador) {
      throw new Error('Reivindique sua casa para negociar no Mercado da Vila.');
    }
    this.garantirDadosMorador(comprador);

    const oferta = this.estado.ofertas.find((o) => o.id === ofertaId);
    if (!oferta) {
      throw new Error('Oferta não encontrada.');
    }

    const vendedorMorador = this.estado.moradores.find((m) => m.id === oferta.vendedor_id);
    if (vendedorMorador) {
      this.garantirDadosMorador(vendedorMorador);
    }

    const resultado = executarTrocaMercadoAtomica({
      oferta,
      vendedor: {
        morador_id: oferta.vendedor_id,
        astros: this.estado.carteirasPorMorador[oferta.vendedor_id] ?? 20,
        estoque: this.estado.estoquesPorMorador[oferta.vendedor_id] ?? {
          ...criarEstoqueInicial(),
          [oferta.tipo]: oferta.qtd,
        },
      },
      comprador: {
        morador_id: comprador.id,
        astros: this.estado.carteirasPorMorador[comprador.id] ?? 0,
        estoque: this.estado.estoquesPorMorador[comprador.id],
      },
    });

    if (!resultado.sucesso) {
      throw new Error(resultado.erro ?? 'Falha na negociação.');
    }

    this.estado = {
      ...this.estado,
      ofertas: this.estado.ofertas.map((o) => (o.id === ofertaId ? resultado.ofertaAtualizada : o)),
      estoquesPorMorador: {
        ...this.estado.estoquesPorMorador,
        [resultado.vendedor.morador_id]: resultado.vendedor.estoque,
        [resultado.comprador.morador_id]: resultado.comprador.estoque,
      },
      carteirasPorMorador: {
        ...this.estado.carteirasPorMorador,
        [resultado.vendedor.morador_id]: resultado.vendedor.astros,
        [resultado.comprador.morador_id]: resultado.comprador.astros,
      },
    };
    this.salvarEstado(true);
  }

  /**
   * Cumprir dever semanal da profissão para subir nível (Aprendiz -> Mestre)
   */
  public cumprirMeuDeverSemanal() {
    const morador = this.obterMeuMorador();
    if (!morador) {
      throw new Error('Reivindique sua casa primeiro.');
    }
    this.garantirDadosMorador(morador);

    const resultado = cumprirDeverSemanal({
      dever: this.estado.deveresPorMorador[morador.id],
      estoque: this.estado.estoquesPorMorador[morador.id],
      astros: this.estado.carteirasPorMorador[morador.id],
      nivel: this.estado.niveisPorMorador[morador.id],
    });

    if (!resultado.sucesso) {
      throw new Error(resultado.erro ?? 'Não foi possível cumprir o dever.');
    }

    this.estado = {
      ...this.estado,
      deveresPorMorador: {
        ...this.estado.deveresPorMorador,
        [morador.id]: resultado.dever,
      },
      estoquesPorMorador: {
        ...this.estado.estoquesPorMorador,
        [morador.id]: resultado.estoque,
      },
      carteirasPorMorador: {
        ...this.estado.carteirasPorMorador,
        [morador.id]: resultado.astros,
      },
      niveisPorMorador: {
        ...this.estado.niveisPorMorador,
        [morador.id]: resultado.nivel,
      },
    };
    this.salvarEstado();
  }

  /**
   * Dispara e grava o evento da Noite do Cucu na tabela eventos
   */
  public dispararNoiteDoCucu(forcarAmeacaAlta = false): EventoVila {
    const muralhaPronta =
      this.estado.obraAtual.tipo === 'muralha' && this.estado.obraAtual.status === 'concluida';
    const protecaoExtra = forcarAmeacaAlta
      ? 0
      : (this.estado.obraAtual.progresso.protecao ?? 0) * 4;

    const resultado = resolverNoiteDoCucu({
      dia: this.estado.diaVila,
      moradores: this.estado.moradores,
      muralhaConstruida: forcarAmeacaAlta ? false : muralhaPronta,
      protecaoMagicaExtra: protecaoExtra,
    });

    this.estado = {
      ...this.estado,
      diaVila: this.estado.diaVila + 1,
      casaAssustadaIdx: resultado.casaAssustadaIdx,
      eventos: [resultado.evento, ...this.estado.eventos.slice(0, 39)],
    };
    this.salvarEstado(true);
    this.emitirEventoCena({
      tipo: 'noite_cucu',
      casaIdx: resultado.casaAssustadaIdx ?? undefined,
    });
    return resultado.evento;
  }

  /**
   * Painel Admin: criar nova Obra da Semana
   */
  public adminCriarObra(nome: string, tipo: string, metaMadeira: number, metaFerramentas: number) {
    const novaObra: ObraSemanal = {
      id: `obra-${Date.now()}`,
      nome,
      tipo,
      meta: {
        madeira: metaMadeira,
        ferramentas: metaFerramentas,
      },
      progresso: {
        madeira: 0,
        ferramentas: 0,
      },
      status: 'em_andamento',
      semana: this.estado.semanaVila + 1,
    };

    this.estado = {
      ...this.estado,
      semanaVila: this.estado.semanaVila + 1,
      obraAtual: novaObra,
    };
    this.salvarEstado(true);
  }

  /**
   * Painel Admin: criar ou encerrar Votação
   */
  public adminCriarVotacao(pergunta: string, opcoes: string[]) {
    const opcoesLimpas = opcoes.map((o) => o.trim()).filter(Boolean);
    if (opcoesLimpas.length < 2) {
      throw new Error('Informe pelo menos 2 opções para a votação.');
    }

    const novaVotacao: VotacaoVila = {
      id: `vot-${Date.now()}`,
      pergunta,
      opcoes: opcoesLimpas,
      abre_em: new Date().toISOString(),
      fecha_em: new Date(Date.now() + 7 * 86400_000).toISOString(),
      vencedora: null,
      votos_por_opcao: Object.fromEntries(opcoesLimpas.map((o) => [o, 0])),
    };

    this.estado = {
      ...this.estado,
      votacaoAtual: novaVotacao,
      votos: [],
    };
    this.salvarEstado(true);
  }

  public adminEncerrarVotacaoAtual() {
    const encerrada = encerrarVotacao(this.estado.votacaoAtual, this.estado.votos);
    this.estado = {
      ...this.estado,
      votacaoAtual: {
        ...encerrada,
        votos_por_opcao: apurarContagemVotos(this.estado.votacaoAtual, this.estado.votos),
      },
    };
    this.salvarEstado(true);
  }

  /**
   * Painel Admin: exportar JSON completo do estado para o app dos vídeos ler
   */
  public exportarEstadoParaAppVideos(): string {
    const payload = {
      exportado_em: new Date().toISOString(),
      dia: this.estado.diaVila,
      semana: this.estado.semanaVila,
      total_moradores: this.estado.moradores.length,
      obra_atual: this.estado.obraAtual,
      votacao_atual: this.estado.votacaoAtual,
      casa_assustada_idx: this.estado.casaAssustadaIdx,
      ultimos_eventos: this.estado.eventos.slice(0, 15),
      moradores: this.estado.moradores,
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Painel Admin: importar seguidores/moradores novos de um JSON
   */
  public importarMoradoresDeJson(textoJson: string): number {
    const parsed = JSON.parse(textoJson) as
      MoradorBrutoVideo[] | { moradores?: MoradorBrutoVideo[]; seguidores?: MoradorBrutoVideo[] };
    const importados = converterEstadoParaMoradores(parsed);
    if (importados.length === 0) {
      throw new Error('Nenhum morador encontrado no JSON enviado.');
    }

    const mapaPorCasa = new Map<number, Morador>();
    for (const m of this.estado.moradores) {
      mapaPorCasa.set(m.casa_idx, m);
    }
    for (const novo of importados) {
      mapaPorCasa.set(novo.casa_idx, novo);
    }

    const listaFinal = Array.from(mapaPorCasa.values()).sort((a, b) => a.casa_idx - b.casa_idx);
    this.estado = {
      ...this.estado,
      moradores: listaFinal,
    };
    this.salvarEstado(true);
    return importados.length;
  }

  public obterMeuMorador(): Morador | null {
    if (!this.estado.meuMoradorId) return null;
    return this.estado.moradores.find((m) => m.id === this.estado.meuMoradorId) ?? null;
  }
}

export const repositorioJogo = new RepositorioJogo();
