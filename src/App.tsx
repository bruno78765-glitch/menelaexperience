import React, { useEffect, useMemo, useState } from 'react';
import {
  Compass,
  Coins,
  Flame,
  Hammer,
  Home,
  Moon,
  RotateCcw,
  RotateCw,
  Search,
  Share2,
  Shield,
  ShoppingBag,
  Sparkles,
  Sun,
  UserPlus,
  Vote,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { MetricasDesempenho, MotorCenaAsterion, Placa3DProjetada } from './cena/motorCena';
import { repositorioJogo, type EstadoJogo } from './dados/repositorioJogo';
import {
  NOMES_RECURSOS,
  TABELA_DEPENDENCIAS_PROFISSOES,
  criarEstoqueInicial,
  podeColetarRecurso,
} from '../regras/economia';
import type { RecursoTipo } from './tipos';
import { gerarCardStoryDataUrl } from './compartilhar/gerarCardStory';
import { LojaEmBreve } from '../loja/LojaEmBreve';
import { PainelAdmin } from './painel/PainelAdmin';
import { CENTRO_ILHA_NORTE, type MarcoTipo } from './vila/geradorVila';

type AbaModal =
  null | 'reivindicar' | 'obra' | 'votacao' | 'mercado' | 'compartilhar' | 'loja' | 'admin';

interface AppProps {
  motorCena: MotorCenaAsterion;
  placas: Placa3DProjetada[];
  metricas: MetricasDesempenho;
}

export const App: React.FC<AppProps> = ({ motorCena, placas, metricas }) => {
  const [estado, setEstado] = useState<EstadoJogo>(() => repositorioJogo.obterEstado());
  const [abaAtiva, setAbaAtiva] = useState<AbaModal>(() =>
    window.location.pathname === '/admin' ? 'admin' : null
  );
  const [busca, setBusca] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);
  const [modoNoiteManual, setModoNoiteManual] = useState(false);

  // Estados de formulários
  const [emailInput, setEmailInput] = useState('');
  const [arrobaInput, setArrobaInput] = useState('');
  const [reivindicacaoCriada, setReivindicacaoCriada] = useState<{
    id: string;
    arroba: string;
    codigo: string;
  } | null>(null);

  const [tipoVenda, setTipoVenda] = useState<RecursoTipo>('ferramentas');
  const [qtdVenda, setQtdVenda] = useState(1);
  const [precoVenda, setPrecoVenda] = useState(10);
  const [cardStoryUrl, setCardStoryUrl] = useState<string>('');

  const mostrarAviso = (msg: string) => {
    setAviso(msg);
    window.clearTimeout((window as unknown as { _timerAviso?: number })._timerAviso);
    (window as unknown as { _timerAviso?: number })._timerAviso = window.setTimeout(() => {
      setAviso(null);
    }, 5000);
  };

  useEffect(() => {
    const cancelar = repositorioJogo.inscrever((novoEstado) => {
      setEstado({ ...novoEstado });
      const marcosExtras: MarcoTipo[] = [];
      if (novoEstado.obraAtual.status === 'concluida') {
        marcosExtras.push(novoEstado.obraAtual.tipo as MarcoTipo);
      }
      motorCena.atualizarVila(novoEstado.moradores, {
        minhaCasaIdx: novoEstado.minhaCasaIdx,
        casaAssustadaIdx: novoEstado.casaAssustadaIdx,
        marcosConcluidosExtras: marcosExtras,
      });
    });

    const cancelarCena = repositorioJogo.inscreverEventosCena((ev) => {
      if (ev.tipo === 'voar_casa' && typeof ev.casaIdx === 'number') {
        motorCena.definirMinhaCasa(ev.casaIdx, true);
      } else if (ev.tipo === 'obra_concluida' && ev.marcoTipo) {
        motorCena.animarConstrucaoMarco(ev.marcoTipo as MarcoTipo);
        mostrarAviso('Obra concluída pela comunidade! Veja a construção subindo na vila!');
      } else if (ev.tipo === 'noite_cucu') {
        motorCena.definirCasaAssustada(ev.casaIdx ?? null);
        if (typeof ev.casaIdx === 'number') {
          motorCena.voarParaCasa(ev.casaIdx);
        }
      }
    });

    return () => {
      cancelar();
      cancelarCena();
    };
  }, [motorCena]);

  const moradorSelecionado = useMemo(() => {
    if (estado.casaSelecionadaIdx === null) return null;
    return estado.moradores.find((m) => m.casa_idx === estado.casaSelecionadaIdx) ?? null;
  }, [estado.casaSelecionadaIdx, estado.moradores]);

  const meuMorador = useMemo(() => {
    if (!estado.meuMoradorId) return null;
    return estado.moradores.find((m) => m.id === estado.meuMoradorId) ?? null;
  }, [estado.meuMoradorId, estado.moradores]);

  const meuEstoque = useMemo(() => {
    if (!meuMorador) return criarEstoqueInicial();
    return estado.estoquesPorMorador[meuMorador.id] ?? criarEstoqueInicial();
  }, [meuMorador, estado.estoquesPorMorador]);

  const meusAstros = useMemo(() => {
    if (!meuMorador) return 0;
    return estado.carteirasPorMorador[meuMorador.id] ?? 0;
  }, [meuMorador, estado.carteirasPorMorador]);

  const meuNivel = useMemo(() => {
    if (!meuMorador) return { morador_id: '', xp: 0, titulo: 'Aprendiz' as const };
    return (
      estado.niveisPorMorador[meuMorador.id] ?? {
        morador_id: meuMorador.id,
        xp: 20,
        titulo: 'Aprendiz' as const,
      }
    );
  }, [meuMorador, estado.niveisPorMorador]);

  const meuDever = useMemo(() => {
    if (!meuMorador) return null;
    return estado.deveresPorMorador[meuMorador.id] ?? null;
  }, [meuMorador, estado.deveresPorMorador]);

  const resultadosBusca = useMemo(() => {
    const t = busca.trim().toLowerCase().replace(/^@/, '');
    if (!t) return [];
    const num = Number.parseInt(t.replace(/^#/, ''), 10);
    return estado.moradores
      .filter(
        (m) =>
          m.nome.toLowerCase().includes(t) ||
          (m.arroba && m.arroba.toLowerCase().includes(t)) ||
          (Number.isFinite(num) && m.casa_idx + 1 === num)
      )
      .slice(0, 6);
  }, [busca, estado.moradores]);

  const handleAlternarDiaNoite = () => {
    const proximo = !modoNoiteManual;
    setModoNoiteManual(proximo);
    motorCena.definirHorarioManual(proximo ? 0.72 : null);
    if (proximo) {
      mostrarAviso('Noite ativada: veja os vagalumes e os olhos do Cucu piscando na mata!');
    } else {
      mostrarAviso('Ciclo solar diurno retomado.');
    }
  };

  const handleConvidarVizinho = (casaIdx: number) => {
    const url = `${window.location.origin}/?convite=${casaIdx}`;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(url);
    }
    mostrarAviso(
      `Link de vizinho copiado (${url})! Quem entrar por ele ganha a casa livre mais perto da Casa #${casaIdx + 1}.`
    );
  };

  const handleAbrirCompartilhar = () => {
    const alvo = meuMorador ?? moradorSelecionado ?? estado.moradores[0];
    if (!alvo) return;
    const nivel = estado.niveisPorMorador[alvo.id] ?? {
      morador_id: alvo.id,
      xp: 70,
      titulo: 'Artífice',
    };
    const dataUrl = gerarCardStoryDataUrl({
      morador: alvo,
      nivel,
      diaVila: estado.diaVila,
      totalMoradores: estado.moradores.length,
    });
    setCardStoryUrl(dataUrl);
    setAbaAtiva('compartilhar');
  };

  const statusColeta = meuMorador
    ? podeColetarRecurso(meuMorador.ultima_coleta_em)
    : { permitido: false, restanteMs: 0 };

  return (
    <div className="relative h-full w-full pointer-events-none select-none font-interface">
      {/* Placas 3D Projetadas (Nome · Profissão sobre as casas e Urna) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {placas
          .filter((p) => p.visivel)
          .map((placa) => (
            <div
              key={placa.id}
              data-testid={`placa-3d-${placa.destaque}`}
              style={{
                transform: `translate3d(${Math.round(placa.x)}px, ${Math.round(placa.y)}px, 0) translate(-50%, -100%)`,
              }}
              className={`absolute left-0 top-0 rounded-lg px-2.5 py-1 text-center shadow-lg border transition-transform duration-75 ${
                placa.destaque === 'minha_casa'
                  ? 'bg-[#0c1030]/95 border-[#f8d040] text-[#f8d040] ring-2 ring-[#f8d040]/50'
                  : placa.destaque === 'assustada'
                    ? 'bg-purple-950/95 border-purple-400 text-purple-200'
                    : placa.destaque === 'marco'
                      ? 'bg-[#0c1030]/85 border-[#f8d040]/60 text-[#f2ead8]'
                      : 'bg-[#0c1030]/90 border-white/40 text-[#f2ead8]'
              }`}
            >
              <div className="font-pixel text-[10px] sm:text-xs leading-tight whitespace-nowrap">
                {placa.texto}
              </div>
              {placa.subtitulo && (
                <div className="text-[10px] font-bold opacity-90 whitespace-nowrap">
                  {placa.subtitulo}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* BARRA SUPERIOR: DIA N · X MORADORES + Busca + FPS */}
      <header className="pointer-events-auto fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-2 p-2.5 sm:px-4">
        <div className="painel-vila flex items-center gap-3 rounded-2xl px-3.5 py-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#e2552e]" />
            <div>
              <h1
                data-testid="hud-topo-contador"
                className="font-pixel text-xs sm:text-sm text-[#f8d040] tracking-wide"
              >
                DIA {estado.diaVila} · {estado.moradores.length} MORADORES
              </h1>
              <p className="text-[11px] text-[#f2ead8]/80">
                Vila de Asterion (@mundoasterion) ·{' '}
                {estado.modoOffline ? 'Modo Demo Local' : 'Supabase Online'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAlternarDiaNoite}
            data-testid="botao-ciclo-dia-noite"
            className="botao-polegar flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f8d040] hover:bg-white/20"
            title="Alternar entre Dia e Noite do Cucu"
          >
            {metricas.ehNoite ? (
              <>
                <Moon className="h-4 w-4" /> Noite
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" /> Dia
              </>
            )}
          </button>
        </div>

        {/* Busca rápida por @arroba, nome ou número da casa */}
        <div className="relative flex-1 max-w-xs">
          <div className="painel-vila flex items-center gap-2 rounded-2xl px-3 py-1.5">
            <Search className="h-4 w-4 text-[#f8d040]" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar @arroba, nome ou #casa..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#f2ead8] placeholder-[#f2ead8]/50 focus:outline-none"
            />
          </div>
          {resultadosBusca.length > 0 && (
            <div className="painel-vila absolute left-0 right-0 top-12 z-30 rounded-xl p-1.5 space-y-1">
              {resultadosBusca.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    motorCena.selecionarCasa(m.casa_idx, true);
                    setBusca('');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white/15"
                >
                  <span>
                    <strong className="text-[#f8d040]">#{m.casa_idx + 1}</strong> {m.nome}{' '}
                    {m.arroba ? `(@${m.arroba})` : ''}
                  </span>
                  <span className="uppercase text-[10px] text-[#f8d040]">{m.profissao}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Medidor de FPS, Draw Calls e Carteira */}
        <div className="painel-vila flex items-center gap-3 rounded-2xl px-3 py-2 text-xs">
          <div data-testid="medidor-fps" className="flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                metricas.fps >= 30 ? 'bg-[#5f9e46]' : 'bg-[#e2552e]'
              }`}
            />
            <span className="font-mono font-bold text-[#f8d040]">{metricas.fps} FPS</span>
            <span className="hidden md:inline text-[#f2ead8]/70">
              · {metricas.casasVisiveis} casas · {metricas.drawCalls} calls ({metricas.qualidade})
            </span>
          </div>

          {meuMorador && (
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-2.5 text-[#f8d040] font-bold">
              <Coins className="h-4 w-4" />
              <span data-testid="saldo-astros">{meusAstros} Astros</span>
            </div>
          )}
        </div>
      </header>

      {/* AVISO FLUTUANTE (TOAST) */}
      {aviso && (
        <div
          role="status"
          className="pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-md rounded-2xl border-2 border-[#f8d040] bg-[#0c1030]/95 px-4 py-2.5 text-center text-xs sm:text-sm font-bold text-[#f8d040] shadow-2xl"
        >
          {aviso}
        </div>
      )}

      {/* PAINEL DA CASA SELECIONADA / MINHA CASA (CANTO INFERIOR ESQUERDO) */}
      {moradorSelecionado && (
        <aside
          data-testid="painel-casa-selecionada"
          className="pointer-events-auto fixed bottom-20 left-2.5 sm:bottom-24 sm:left-4 z-20 w-[calc(100vw-78px)] max-w-sm painel-vila rounded-2xl p-3 sm:p-3.5 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-[#f8d040] px-2 py-0.5 font-pixel text-[10px] text-[#0c1030]">
                  CASA #{moradorSelecionado.casa_idx + 1}
                </span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold text-[#f8d040]">
                  {moradorSelecionado.regiao === 1 ? 'Ilha Norte' : 'Vila Central'}
                </span>
                {moradorSelecionado.fundador && (
                  <span className="rounded bg-[#e2552e]/30 border border-[#e2552e] px-1.5 py-0.5 text-[10px] font-bold text-[#f8d040]">
                    FUNDADOR
                  </span>
                )}
              </div>
              <h2
                data-testid="nome-morador-selecionado"
                className="mt-1 font-pixel text-sm text-[#f2ead8]"
              >
                {moradorSelecionado.nome} ·{' '}
                {TABELA_DEPENDENCIAS_PROFISSOES[moradorSelecionado.profissao].nome.toUpperCase()}
              </h2>
              {moradorSelecionado.arroba && (
                <p className="text-xs text-[#8ec5ff]">@{moradorSelecionado.arroba}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => motorCena.voarParaCasa(moradorSelecionado.casa_idx)}
              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-[#f8d040] hover:bg-white/20"
            >
              Focar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-2 text-xs">
            <div>
              <span className="block text-[10px] text-[#f2ead8]/65">Objeto na porta:</span>
              <strong className="text-[#f8d040]">
                {TABELA_DEPENDENCIAS_PROFISSOES[moradorSelecionado.profissao].objetoPorta}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#f2ead8]/65">Produz a cada 4h:</span>
              <strong className="text-[#5f9e46]">
                +1{' '}
                {TABELA_DEPENDENCIAS_PROFISSOES[moradorSelecionado.profissao].nomeRecursoProduzido}
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {estado.minhaCasaIdx === moradorSelecionado.casa_idx ? (
              <button
                type="button"
                data-testid="botao-coletar-recurso"
                onClick={async () => {
                  try {
                    const res = await repositorioJogo.coletarRecursoDaMinhaCasa();
                    mostrarAviso(res.mensagem);
                  } catch (err) {
                    mostrarAviso(err instanceof Error ? err.message : 'Erro na coleta');
                  }
                }}
                className={`botao-polegar flex-1 rounded-xl px-3 py-2 text-xs font-bold ${
                  statusColeta.permitido
                    ? 'bg-[#5f9e46] text-white hover:bg-[#4e8538]'
                    : 'bg-white/15 text-[#f2ead8]/70'
                }`}
              >
                {statusColeta.permitido
                  ? `Coletar +1 ${TABELA_DEPENDENCIAS_PROFISSOES[moradorSelecionado.profissao].nomeRecursoProduzido}`
                  : `Em recarga (${Math.ceil(statusColeta.restanteMs / 60000)}m)`}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  data-testid="botao-reivindicar-esta-casa"
                  onClick={() => {
                    setArrobaInput(moradorSelecionado.arroba ?? '');
                    setAbaAtiva('reivindicar');
                  }}
                  className="botao-polegar flex-1 rounded-xl bg-[#f8d040] px-3 py-2 text-xs font-bold text-[#0c1030]"
                >
                  Essa casa é minha!
                </button>
                <button
                  type="button"
                  data-testid="botao-assumir-demo"
                  onClick={() => {
                    repositorioJogo.assumirCasaComoJogador(moradorSelecionado.casa_idx);
                    mostrarAviso(
                      `Você assumiu a Casa #${moradorSelecionado.casa_idx + 1} (${moradorSelecionado.nome})!`
                    );
                  }}
                  className="botao-polegar rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-[#f2ead8] hover:bg-white/25"
                  title="Testar imediatamente com esta casa no modo demo"
                >
                  Jogar nela
                </button>
              </>
            )}

            <button
              type="button"
              data-testid="botao-convidar-vizinho"
              onClick={() => handleConvidarVizinho(moradorSelecionado.casa_idx)}
              className="botao-polegar inline-flex items-center gap-1 rounded-xl bg-[#3a7ac8] px-3 py-2 text-xs font-bold text-white"
              title="Convidar amigo para morar na casa livre mais próxima"
            >
              <UserPlus className="h-4 w-4" /> Vizinho
            </button>

            <button
              type="button"
              data-testid="botao-compartilhar-story"
              onClick={handleAbrirCompartilhar}
              className="botao-polegar inline-flex items-center gap-1 rounded-xl bg-[#e2552e] px-3 py-2 text-xs font-bold text-white"
              title="Gerar card vertical 1080x1920 para Instagram Story"
            >
              <Share2 className="h-4 w-4" /> Story
            </button>
          </div>
        </aside>
      )}

      {/* CONTROLES DE CÂMERA ISOMÉTRICA (LADO DIREITO) */}
      <div className="pointer-events-auto fixed bottom-24 right-2.5 sm:right-4 z-20 flex flex-col gap-2">
        <div className="painel-vila flex flex-col gap-1.5 rounded-2xl p-1.5">
          <button
            type="button"
            onClick={() => motorCena.girarCameraPassos(-1)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#f8d040] hover:bg-white/20"
            title="Girar câmera -90°"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => motorCena.girarCameraPassos(1)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#f8d040] hover:bg-white/20"
            title="Girar câmera +90°"
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => motorCena.ajustarZoom(0.25)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#f2ead8] hover:bg-white/20"
            title="Aproximar Zoom"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => motorCena.ajustarZoom(-0.25)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#f2ead8] hover:bg-white/20"
            title="Afastar Zoom"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => motorCena.voarParaPonto(0, 0, 1.15)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#e2552e] hover:bg-white/20"
            title="Fogueira Central"
          >
            <Flame className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => motorCena.voarParaPonto(CENTRO_ILHA_NORTE.x, CENTRO_ILHA_NORTE.z, 1.35)}
            className="botao-polegar flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-[#3a7ac8] hover:bg-white/20"
            title="Ir para a Ilha Norte (Casas 790+)"
          >
            <Compass className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* BARRA INFERIOR DE AÇÕES GRANDES PARA O POLEGAR */}
      <nav className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center p-2.5">
        <div className="painel-vila flex w-full max-w-3xl items-center justify-around gap-1.5 rounded-2xl p-1.5 overflow-x-auto">
          <button
            type="button"
            data-testid="nav-minha-casa"
            onClick={() => {
              if (estado.minhaCasaIdx !== null) {
                motorCena.selecionarCasa(estado.minhaCasaIdx, true);
              } else {
                setAbaAtiva('reivindicar');
              }
            }}
            className={`botao-polegar flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'reivindicar'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <Home className="h-4 w-4 text-[#f8d040]" />
            <span>
              {estado.minhaCasaIdx !== null ? `Casa #${estado.minhaCasaIdx + 1}` : 'Minha Casa'}
            </span>
          </button>

          <button
            type="button"
            data-testid="nav-obra-semana"
            onClick={() => setAbaAtiva(abaAtiva === 'obra' ? null : 'obra')}
            className={`botao-polegar flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'obra'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <Hammer className="h-4 w-4 text-[#e2552e]" />
            <span>Obra</span>
          </button>

          <button
            type="button"
            data-testid="nav-votacao"
            onClick={() => setAbaAtiva(abaAtiva === 'votacao' ? null : 'votacao')}
            className={`botao-polegar flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'votacao'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <Vote className="h-4 w-4 text-[#8ec5ff]" />
            <span>Urna</span>
          </button>

          <button
            type="button"
            data-testid="nav-mercado"
            onClick={() => setAbaAtiva(abaAtiva === 'mercado' ? null : 'mercado')}
            className={`botao-polegar flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'mercado'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <ShoppingBag className="h-4 w-4 text-[#5f9e46]" />
            <span>Mercado</span>
          </button>

          <button
            type="button"
            data-testid="nav-loja"
            onClick={() => setAbaAtiva(abaAtiva === 'loja' ? null : 'loja')}
            className={`botao-polegar flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'loja'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#f8d040]" />
            <span className="hidden sm:inline">Loja</span>
          </button>

          <button
            type="button"
            data-testid="nav-admin"
            onClick={() => setAbaAtiva(abaAtiva === 'admin' ? null : 'admin')}
            className={`botao-polegar flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold ${
              abaAtiva === 'admin'
                ? 'bg-[#f8d040] text-[#0c1030]'
                : 'bg-white/10 text-[#f2ead8] hover:bg-white/20'
            }`}
          >
            <Shield className="h-4 w-4 text-[#f8d040]" />
            <span>/admin</span>
          </button>
        </div>
      </nav>

      {/* MODAIS DE FUNCIONALIDADES */}
      {abaAtiva && (
        <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3">
          <div className="painel-vila max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl p-5">
            {/* MODAL 1: MINHA CASA / LOGIN E REIVINDICAÇÃO */}
            {abaAtiva === 'reivindicar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
                  <h2 className="font-pixel text-base text-[#f8d040]">REIVINDICAR MINHA CASA</h2>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva(null)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                {estado.conviteVizinhoIdx !== null && (
                  <div className="rounded-xl border border-[#5f9e46] bg-[#5f9e46]/20 p-3 text-xs">
                    Você entrou por um convite da{' '}
                    <strong>Casa #{estado.conviteVizinhoIdx + 1}</strong>! Ao reivindicar um @arroba
                    novo, você ganhará a casa livre mais próxima dela.
                  </div>
                )}

                {/* Passo 1: E-mail (Link Mágico) */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await repositorioJogo.entrarComLinkMagico(emailInput);
                      mostrarAviso(res.mensagem);
                    } catch (err) {
                      mostrarAviso(err instanceof Error ? err.message : 'Erro no login');
                    }
                  }}
                  className="space-y-2 rounded-xl bg-black/30 p-3.5"
                >
                  <label className="block text-xs font-bold text-[#f8d040]">
                    1. Entrar com Link Mágico de E-mail
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="flex-1 rounded-xl border border-white/20 bg-[#0c1030] px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="botao-polegar rounded-xl bg-[#3a7ac8] px-4 py-2 text-xs font-bold text-white"
                    >
                      Enviar Link
                    </button>
                  </div>
                  {estado.emailUsuario && (
                    <p className="text-xs text-[#5f9e46]">
                      Conectado como: <strong>{estado.emailUsuario}</strong>
                    </p>
                  )}
                </form>

                {/* Passo 2: @arroba do Instagram e Código de Verificação */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    try {
                      const reiv = repositorioJogo.solicitarReivindicacaoCasa(arrobaInput);
                      setReivindicacaoCriada({
                        id: reiv.id,
                        arroba: reiv.arroba,
                        codigo: reiv.codigo,
                      });
                      mostrarAviso(
                        `Código ${reiv.codigo} gerado! Envie no direct da @mundoasterion ou aprove no /admin.`
                      );
                    } catch (err) {
                      mostrarAviso(err instanceof Error ? err.message : 'Erro ao gerar código');
                    }
                  }}
                  className="space-y-2.5 rounded-xl bg-black/30 p-3.5"
                >
                  <label className="block text-xs font-bold text-[#f8d040]">
                    2. Digite seu @ do Instagram para localizar sua casa dos vídeos
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      data-testid="input-arroba-reivindicar"
                      value={arrobaInput}
                      onChange={(e) => setArrobaInput(e.target.value)}
                      placeholder="@seu_arroba (ex: mundoasterion)"
                      className="flex-1 rounded-xl border border-white/20 bg-[#0c1030] px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      data-testid="botao-gerar-codigo"
                      className="botao-polegar rounded-xl bg-[#f8d040] px-4 py-2 text-xs font-bold text-[#0c1030]"
                    >
                      Gerar Código
                    </button>
                  </div>
                </form>

                {reivindicacaoCriada && (
                  <div
                    data-testid="caixa-codigo-reivindicacao"
                    className="rounded-xl border-2 border-[#f8d040] bg-[#f8d040]/10 p-4 space-y-2 text-center"
                  >
                    <p className="text-xs text-[#f2ead8]">
                      Envie este código por Direct (DM) no Instagram para{' '}
                      <strong className="text-[#f8d040]">@mundoasterion</strong>:
                    </p>
                    <div className="font-pixel text-xl text-[#f8d040] py-1">
                      {reivindicacaoCriada.codigo}
                    </div>
                    <p className="text-xs text-[#f2ead8]/75">
                      Assim que o criador aprovar no painel <code>/admin</code>, a câmera voará até
                      sua casa!
                    </p>
                    <button
                      type="button"
                      data-testid="botao-simular-aprovacao-imediata"
                      onClick={() => {
                        const m = repositorioJogo.aprovarReivindicacao(
                          reivindicacaoCriada.id,
                          true
                        );
                        mostrarAviso(
                          `Casa #${m.casa_idx + 1} (${m.nome}) reivindicada! Voando até sua casa...`
                        );
                        setAbaAtiva(null);
                      }}
                      className="mt-2 rounded-xl bg-[#5f9e46] px-4 py-2 text-xs font-bold text-white hover:bg-[#4e8538]"
                    >
                      Aprovar Agora (Atalho de Teste)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODAL 2: OBRA DA SEMANA (TEMPO REAL) */}
            {abaAtiva === 'obra' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#e2552e]">
                      SEMANA {estado.obraAtual.semana} · SINCRONIZADO EM TEMPO REAL
                    </span>
                    <h2 className="font-pixel text-base text-[#f8d040]">{estado.obraAtual.nome}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva(null)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                {!meuMorador && (
                  <div className="rounded-xl bg-white/10 p-3 text-xs text-[#f8d040]">
                    Dica: escolha ou reivindique uma casa para contribuir com seus recursos.{' '}
                    <button
                      type="button"
                      onClick={() => repositorioJogo.assumirCasaComoJogador(0)}
                      className="underline font-bold ml-1"
                    >
                      Assumir Casa #1 agora
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {Object.entries(estado.obraAtual.meta).map(([recursoKey, metaVal]) => {
                    const tipo = recursoKey as RecursoTipo;
                    const meta = metaVal ?? 1;
                    const atual = estado.obraAtual.progresso[tipo] ?? 0;
                    const pct = Math.min(100, Math.round((atual / meta) * 100));
                    const tenhoNoEstoque = meuEstoque[tipo] ?? 0;

                    return (
                      <div
                        key={tipo}
                        className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#f2ead8]">
                            {NOMES_RECURSOS[tipo]} (Seu estoque: {tenhoNoEstoque})
                          </span>
                          <span
                            data-testid={`progresso-obra-${tipo}`}
                            className="font-mono font-bold text-[#f8d040]"
                          >
                            {atual} / {meta} ({pct}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-[#5f9e46] to-[#f8d040] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            data-testid={`contribuir-${tipo}`}
                            disabled={atual >= meta || estado.obraAtual.status === 'concluida'}
                            onClick={async () => {
                              try {
                                await repositorioJogo.contribuirParaObra(tipo);
                                mostrarAviso(
                                  `Você contribuiu com +1 ${NOMES_RECURSOS[tipo]} para ${estado.obraAtual.nome}!`
                                );
                              } catch (err) {
                                mostrarAviso(
                                  err instanceof Error ? err.message : 'Erro ao contribuir'
                                );
                              }
                            }}
                            className="rounded-lg bg-[#5f9e46] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                          >
                            Contribuir +1 {NOMES_RECURSOS[tipo]}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {estado.obraAtual.status === 'concluida' && (
                  <div className="rounded-xl border-2 border-[#f8d040] bg-[#5f9e46]/25 p-3 text-center font-bold text-[#f8d040]">
                    OBRA CONCLUÍDA! A construção já está erguida na vila!
                  </div>
                )}
              </div>
            )}

            {/* MODAL 3: URNA DE VOTAÇÃO */}
            {abaAtiva === 'votacao' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#8ec5ff]">
                      URNA EM FRENTE AO SALÃO · 1 VOTO POR MORADOR
                    </span>
                    <h2 className="font-pixel text-sm sm:text-base text-[#f8d040]">
                      {estado.votacaoAtual.pergunta}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva(null)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                <div className="space-y-2.5">
                  {estado.votacaoAtual.opcoes.map((opcao) => {
                    const qtdVotos = estado.votacaoAtual.votos_por_opcao?.[opcao] ?? 0;
                    const meuVoto = estado.votos.find(
                      (v) =>
                        v.votacao_id === estado.votacaoAtual.id && v.morador_id === meuMorador?.id
                    );

                    return (
                      <div
                        key={opcao}
                        className={`flex items-center justify-between rounded-xl border p-3 ${
                          meuVoto?.opcao === opcao
                            ? 'border-[#f8d040] bg-[#f8d040]/15'
                            : 'border-white/15 bg-black/30'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-[#f2ead8]">{opcao}</div>
                          <div className="text-xs text-[#f8d040]">{qtdVotos} votos</div>
                        </div>
                        <button
                          type="button"
                          data-testid={`votar-${opcao}`}
                          onClick={() => {
                            try {
                              if (!meuMorador) {
                                repositorioJogo.assumirCasaComoJogador(0);
                              }
                              repositorioJogo.votarNaUrna(opcao);
                              mostrarAviso(`Voto registrado em "${opcao}"!`);
                            } catch (err) {
                              mostrarAviso(err instanceof Error ? err.message : 'Erro ao votar');
                            }
                          }}
                          className="botao-polegar rounded-xl bg-[#f8d040] px-4 py-2 text-xs font-bold text-[#0c1030]"
                        >
                          {meuVoto?.opcao === opcao ? 'Seu Voto' : 'Votar'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {estado.votacaoAtual.vencedora && (
                  <div className="rounded-xl border border-[#f8d040] bg-[#f8d040]/20 p-3 text-center text-xs font-bold text-[#f8d040]">
                    Votação encerrada! Vencedora: {estado.votacaoAtual.vencedora}
                  </div>
                )}
              </div>
            )}

            {/* MODAL 4: MERCADO ENTRE JOGADORES E DEVERES SEMANAIS */}
            {abaAtiva === 'mercado' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
                  <div>
                    <h2 className="font-pixel text-base text-[#f8d040]">
                      MERCADO DE ASTROS & DEVERES
                    </h2>
                    <p className="text-xs text-[#f2ead8]/75">
                      Ninguém produz tudo sozinho: troque recursos com outras profissões!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva(null)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                {/* Dever Semanal e Nível do Morador */}
                {meuMorador && meuDever && (
                  <div className="rounded-xl border border-[#f8d040]/50 bg-black/40 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f8d040]">
                        SEU NÍVEL: {meuNivel.titulo.toUpperCase()} ({meuNivel.xp} XP)
                      </span>
                      <span className="text-xs font-bold text-[#5f9e46]">
                        Saldo: {meusAstros} Astros
                      </span>
                    </div>
                    <p className="text-xs text-[#f2ead8]">{meuDever.descricao}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#f2ead8]/75">
                        Recompensa: +{meuDever.recompensa_astros} Astros e +{meuDever.recompensa_xp}{' '}
                        XP
                      </span>
                      <button
                        type="button"
                        data-testid="botao-cumprir-dever"
                        disabled={meuDever.cumprido}
                        onClick={() => {
                          try {
                            repositorioJogo.cumprirMeuDeverSemanal();
                            mostrarAviso('Dever semanal cumprido! Seu nível e Astros subiram!');
                          } catch (err) {
                            mostrarAviso(err instanceof Error ? err.message : 'Erro no dever');
                          }
                        }}
                        className="rounded-lg bg-[#5f9e46] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                      >
                        {meuDever.cumprido ? 'Dever Cumprido' : 'Cumprir Dever Semanal'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Ofertas Abertas no Mercado */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase text-[#f8d040]">
                    Ofertas Abertas na Vila
                  </h3>
                  {estado.ofertas
                    .filter((o) => o.status === 'aberta')
                    .map((oferta) => (
                      <div
                        key={oferta.id}
                        className="flex items-center justify-between rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs"
                      >
                        <div>
                          <strong className="text-[#f8d040]">
                            {oferta.qtd}x {NOMES_RECURSOS[oferta.tipo]}
                          </strong>{' '}
                          por{' '}
                          <span className="text-[#5f9e46] font-bold">{oferta.preco} Astros</span>
                          <span className="block text-[11px] text-[#f2ead8]/65">
                            Vendedor: {oferta.vendedor_nome ?? oferta.vendedor_id}
                          </span>
                        </div>
                        <button
                          type="button"
                          data-testid={`comprar-${oferta.id}`}
                          onClick={() => {
                            try {
                              if (!meuMorador) {
                                repositorioJogo.assumirCasaComoJogador(1);
                              }
                              repositorioJogo.comprarOfertaMercado(oferta.id);
                              mostrarAviso(
                                `Compra concluída: +${oferta.qtd} ${NOMES_RECURSOS[oferta.tipo]}!`
                              );
                            } catch (err) {
                              mostrarAviso(err instanceof Error ? err.message : 'Erro na compra');
                            }
                          }}
                          className="rounded-lg bg-[#f8d040] px-3 py-1.5 font-bold text-[#0c1030]"
                        >
                          Comprar ({oferta.preco} Astros)
                        </button>
                      </div>
                    ))}
                </div>

                {/* Publicar nova oferta */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    try {
                      if (!meuMorador) {
                        repositorioJogo.assumirCasaComoJogador(0);
                      }
                      repositorioJogo.criarOfertaMercado(tipoVenda, qtdVenda, precoVenda);
                      mostrarAviso('Oferta publicada no Mercado da Vila!');
                    } catch (err) {
                      mostrarAviso(err instanceof Error ? err.message : 'Erro ao anunciar');
                    }
                  }}
                  className="rounded-xl border border-white/15 bg-black/30 p-3 space-y-2"
                >
                  <h3 className="text-xs font-bold text-[#f8d040]">Anunciar Recurso para Venda</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <select
                      value={tipoVenda}
                      onChange={(e) => setTipoVenda(e.target.value as RecursoTipo)}
                      className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5"
                    >
                      {Object.entries(NOMES_RECURSOS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={qtdVenda}
                      onChange={(e) => setQtdVenda(Number(e.target.value))}
                      className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5"
                      title="Quantidade"
                    />
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={precoVenda}
                      onChange={(e) => setPrecoVenda(Number(e.target.value))}
                      className="rounded bg-[#0c1030] border border-white/20 px-2 py-1.5"
                      title="Preço em Astros"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#3a7ac8] py-1.5 text-xs font-bold text-white"
                  >
                    Anunciar no Mercado
                  </button>
                </form>
              </div>
            )}

            {/* MODAL 5: COMPARTILHAR CARD 1080x1920 PARA STORY */}
            {abaAtiva === 'compartilhar' && (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-between border-b border-[#f8d040]/30 pb-3">
                  <h2 className="font-pixel text-base text-[#f8d040]">
                    CARD PARA INSTAGRAM STORY (1080×1920)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva(null)}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold"
                  >
                    Fechar
                  </button>
                </div>

                {cardStoryUrl && (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={cardStoryUrl}
                      alt="Card vertical 1080x1920 para Instagram Story"
                      className="max-h-96 w-auto rounded-xl border-2 border-[#f8d040] shadow-xl"
                    />
                    <a
                      href={cardStoryUrl}
                      download="minha-casa-asterion-story.png"
                      className="botao-polegar inline-flex items-center gap-2 rounded-xl bg-[#f8d040] px-5 py-2.5 text-sm font-bold text-[#0c1030]"
                    >
                      <Share2 className="h-4 w-4" /> Baixar Imagem 1080×1920 para o Story
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* MODAL 6: LOJA DE COSMÉTICOS (EM BREVE) */}
            {abaAtiva === 'loja' && (
              <LojaEmBreve
                ehFundador={Boolean(meuMorador?.fundador ?? moradorSelecionado?.fundador)}
                aoFechar={() => setAbaAtiva(null)}
              />
            )}

            {/* MODAL 7: PAINEL DO CRIADOR (/ADMIN) */}
            {abaAtiva === 'admin' && (
              <PainelAdmin
                estado={estado}
                aoFechar={() => setAbaAtiva(null)}
                aoNotificar={mostrarAviso}
                aoAlternarNoiteCena={(forcarNoite) => {
                  setModoNoiteManual(forcarNoite);
                  motorCena.definirHorarioManual(forcarNoite ? 0.72 : null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
