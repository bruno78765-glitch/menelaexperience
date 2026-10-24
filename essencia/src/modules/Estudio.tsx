import { useState } from 'react';
import {
  Video,
  Layers,
  PenLine,
  Film,
  ChevronRight,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import {
  ROTEIROS_REEL,
  MODELOS_CARROSSEL,
  ANATOMIA_LEGENDA,
  type RoteiroReel,
} from '@/data/estudio';
import { WHATSAPP_URL } from '@/data/whatsapp';
import { personalizarValor } from '@/lib/nicho';

type Aba = 'reels' | 'carrossel' | 'legenda';

const ABAS: { id: Aba; label: string; icone: typeof Video }[] = [
  { id: 'reels', label: 'Vídeos Curtos', icone: Video },
  { id: 'carrossel', label: 'Carrosséis', icone: Layers },
  { id: 'legenda', label: 'Legenda Perfeita', icone: PenLine },
];

function RoteiroCard({ roteiro }: { roteiro: RoteiroReel }) {
  return (
    <Card hover>
      <div className="flex items-center gap-3">
        <span
          className="chip"
          style={{
            borderColor: `${roteiro.cor}55`,
            color: roteiro.cor,
            background: `${roteiro.cor}1a`,
          }}
        >
          {roteiro.tipo}
        </span>
        <h3 className="font-display text-lg text-creme-50">{roteiro.titulo}</h3>
      </div>
      <p className="mt-3 text-sm text-creme-200/75">{roteiro.quandoUsar}</p>

      <div className="mt-4 space-y-3">
        {roteiro.passos.map((p) => (
          <div key={p.passo} className="glass-soft rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                style={{ background: `${roteiro.cor}22`, color: roteiro.cor }}
              >
                {p.passo}
              </span>
              <p className="text-sm font-semibold text-creme-50">{p.nome}</p>
            </div>
            <p className="mt-2 text-sm text-creme-200/75">{p.instrucao}</p>
            <div className="mt-3 rounded-lg border border-champagne-500/25 bg-champagne-500/10 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-champagne-500">
                Exemplo
              </p>
              <p className="mt-1 text-sm italic text-creme-50/90">{p.exemplo}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CarrosselView({ modelos }: { modelos: typeof MODELOS_CARROSSEL }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {modelos.map((modelo) => (
        <Card key={modelo.id} hover>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${modelo.cor}22`, color: modelo.cor }}
            >
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg text-creme-50">{modelo.nome}</h3>
              <p className="text-xs text-creme-200/60">{modelo.objetivo}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-lux">
            {modelo.slides.map((slide, i) => (
              <div
                key={i}
                className="min-w-[170px] shrink-0 rounded-xl border border-essencia-500/40 bg-essencia-900/50 p-3"
                style={{ borderColor: `${modelo.cor}33` }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: modelo.cor }}
                >
                  {slide.titulo}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-creme-200/80">
                  {slide.conteudo}
                </p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function LegendaView({ partes }: { partes: typeof ANATOMIA_LEGENDA }) {
  return (
    <Card>
      <p className="mb-5 text-sm text-creme-200/75">
        A legenda ideal segue 4 blocos encadeados. Cada um tem uma função específica —
        pular um quebra o fluxo de conversão.
      </p>
      <div className="space-y-3">
        {partes.map((parte, i) => (
          <div key={parte.nome} className="relative">
            <div
              className="glass-soft rounded-xl p-4 pl-5"
              style={{ borderLeft: `4px solid ${parte.cor}` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold"
                    style={{ background: `${parte.cor}22`, color: parte.cor }}
                  >
                    {i + 1}
                  </span>
                  <h4 className="font-display text-base text-creme-50">
                    {parte.nome}
                  </h4>
                </div>
                {i < partes.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-creme-200/40" />
                )}
              </div>
              <p className="mt-2 text-sm text-creme-200/75">{parte.funcao}</p>
              <div className="mt-3 rounded-lg border border-champagne-500/20 bg-champagne-500/10 px-3 py-2">
                <p className="text-sm italic text-creme-50/90">{parte.exemplo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-start gap-3 rounded-xl border border-champagne-500/30 bg-champagne-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-creme-50">
          <Lightbulb className="h-4 w-4 text-champagne-500" />
          Quer revisão de legenda com um mentor?
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-gold">
          Enviar legenda no WhatsApp
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

export function Estudio({ nicho }: { nicho: string }) {
  const [aba, setAba] = useState<Aba>('reels');
  const roteiros = personalizarValor(ROTEIROS_REEL, nicho);
  const carrosseis = personalizarValor(MODELOS_CARROSSEL, nicho);
  const legendas = personalizarValor(ANATOMIA_LEGENDA, nicho);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Módulo 3 · Estúdio de Conteúdo Prático"
        titulo="O ouro da mentoria: sistemas prontos para criar"
        descricao="Roteiros validados de Reels, modelos de carrosséis que geram salvamentos e a anatomia da legenda perfeita. Os exemplos entram com o nicho do diagnóstico."
      />

      {!nicho && (
        <p className="mb-4 rounded-xl border border-champagne-500/25 bg-champagne-500/10 px-4 py-3 text-sm text-creme-50/90">
          Defina o nicho no diagnóstico para trocar “seu nicho” pelo seu mercado.
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {ABAS.map((a) => {
          const Icone = a.icone;
          const ativo = aba === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                ativo
                  ? 'bg-champagne-500 text-essencia-900 shadow-glow'
                  : 'glass-soft text-creme-50 hover:text-champagne-500'
              }`}
            >
              <Icone className="h-4 w-4" />
              {a.label}
            </button>
          );
        })}
      </div>

      {aba === 'reels' && (
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-champagne-500/25 bg-champagne-500/10 px-4 py-3">
            <Film className="h-5 w-5 shrink-0 text-champagne-500" />
            <p className="text-sm text-creme-50/90">
              <span className="font-semibold text-champagne-500">Estrutura de 4 passos: </span>
              Gancho com pergunta real → Explicação sem termos técnicos → Direção prática → Convite elegante para o WhatsApp.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {roteiros.map((r) => (
              <RoteiroCard key={r.tipo} roteiro={r} />
            ))}
          </div>
        </div>
      )}

      {aba === 'carrossel' && <CarrosselView modelos={carrosseis} />}
      {aba === 'legenda' && <LegendaView partes={legendas} />}
    </div>
  );
}
