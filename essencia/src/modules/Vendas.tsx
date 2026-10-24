import { useState } from 'react';
import {
  MessageSquareText,
  RotateCcw,
  Check,
  ChevronRight,
  AlertCircle,
  HandCoins,
} from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import { CLARA_PASSOS, CASOS_OBJECAO, type ObjeçãoCaso } from '@/data/clara';
import { personalizarTexto } from '@/lib/nicho';

function PassoCard({
  passo,
  resposta,
  nicho,
  ativo,
  concluido,
  onClick,
}: {
  passo: (typeof CLARA_PASSOS)[number];
  resposta?: string;
  nicho: string;
  ativo: boolean;
  concluido: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ease-in-out ${
        ativo
          ? 'glass shadow-glow'
          : concluido
            ? 'glass-soft border-champagne-500/40'
            : 'glass-soft hover:border-champagne-500/30'
      }`}
      style={ativo ? { borderColor: `${passo.cor}77` } : undefined}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-base font-semibold"
          style={{
            background: concluido ? `${passo.cor}30` : `${passo.cor}1f`,
            color: passo.cor,
            border: concluido ? `1px solid ${passo.cor}` : 'none',
          }}
        >
          {concluido ? <Check className="h-4 w-4" /> : passo.letra}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base text-creme-50">{passo.nome}</p>
          <p className="truncate text-xs text-creme-200/60">{passo.descricao}</p>
        </div>
        {ativo && <ChevronRight className="h-4 w-4 text-champagne-500" />}
      </div>

      {ativo && (
        <div className="mt-4 animate-fadeIn space-y-3">
          <div className="rounded-lg border border-essencia-500/30 bg-essencia-900/40 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-champagne-500">
              O que fazer
            </p>
            <p className="mt-1 text-sm text-creme-200/85">{passo.descricao}</p>
          </div>
          <div className="rounded-lg border border-champagne-500/25 bg-champagne-500/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-champagne-500">
              Exemplo
            </p>
            <p className="mt-1 text-sm italic text-creme-50/90">{personalizarTexto(passo.exemplo, nicho)}</p>
          </div>
          {resposta && (
            <div
              className="rounded-lg p-3"
              style={{ background: `${passo.cor}14`, border: `1px solid ${passo.cor}40` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: passo.cor }}>
                Resposta ideal para esta objeção
              </p>
              <p className="mt-1 text-sm text-creme-50/95">{resposta}</p>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

function Simulador({ caso, nicho }: { caso: ObjeçãoCaso; nicho: string }) {
  const [passoAtivo, setPassoAtivo] = useState(-1);
  const passosKeys = ['compreenda', 'ligue', 'apresente', 'responda', 'avance'] as const;
  const concluido = passoAtivo >= CLARA_PASSOS.length;

  function reiniciar() {
    setPassoAtivo(-1);
  }

  return (
    <Card>
      <div className="rounded-xl border border-essencia-500/40 bg-essencia-900/50 p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-essencia-700/60 text-creme-200">
            <MessageSquareText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-creme-200/60">
              A aluna diz
            </p>
            <p className="mt-0.5 font-display text-lg text-creme-50">{caso.fala}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-essencia-700/30 px-3 py-2">
            <p className="text-xs text-creme-200/55">Contexto</p>
            <p className="text-sm text-creme-200/85">{caso.contexto}</p>
          </div>
          <div className="rounded-lg bg-essencia-700/30 px-3 py-2">
            <p className="text-xs text-creme-200/55">Emoção por trás</p>
            <p className="text-sm text-creme-200/85">{caso.emocao}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {CLARA_PASSOS.map((passo, i) => (
          <PassoCard
            key={passo.nome}
            passo={passo}
            nicho={nicho}
            resposta={personalizarTexto(caso.respostaIdeal[passosKeys[i]], nicho)}
            ativo={passoAtivo === i}
            concluido={passoAtivo > i}
            onClick={() => setPassoAtivo(i)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={reiniciar} className="btn-ghost">
          <RotateCcw className="h-4 w-4" /> Recomeçar
        </button>
        {passoAtivo < 0 ? (
          <button type="button" onClick={() => setPassoAtivo(0)} className="btn-gold">
            Iniciar simulação
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : passoAtivo < CLARA_PASSOS.length - 1 ? (
          <button type="button" onClick={() => setPassoAtivo((passo) => passo + 1)} className="btn-gold">
            Próximo passo
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : !concluido ? (
          <button type="button" onClick={() => setPassoAtivo(CLARA_PASSOS.length)} className="btn-gold">
            Concluir
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl border border-champagne-500/40 bg-champagne-500/10 px-4 py-3 text-sm font-medium text-champagne-500">
            <Check className="h-4 w-4" /> Resposta completa
          </span>
        )}
      </div>
    </Card>
  );
}

export function Vendas({ nicho }: { nicho: string }) {
  const [casoAtivo, setCasoAtivo] = useState<string>(CASOS_OBJECAO[0].id);
  const caso = CASOS_OBJECAO.find((c) => c.id === casoAtivo) ?? CASOS_OBJECAO[0];

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Módulo 4 · Treinador de Vendas & Quebra de Objeções"
        titulo="Método C.L.A.R.A. — venda sem dar desconto impulsivo"
        descricao="Treine como responder às objeções mais comuns aplicando os 5 passos: Compreenda, Ligue, Apresente, Responda e Avance. Escolha uma objeção e percorra a resposta ideal passo a passo."
      />

      <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {CASOS_OBJECAO.map((c) => {
          const ativo = c.id === casoAtivo;
          return (
            <button
              key={c.id}
              onClick={() => setCasoAtivo(c.id)}
              className={`glass-soft rounded-xl p-4 text-left transition-all duration-300 ease-in-out ${
                ativo ? 'ring-1 ring-champagne-500' : 'hover:border-champagne-500/30'
              }`}
            >
              <div className="flex items-start gap-2">
                <HandCoins className={`mt-0.5 h-4 w-4 shrink-0 ${ativo ? 'text-champagne-500' : 'text-creme-200/50'}`} />
                <p className="text-sm font-medium text-creme-50">{c.fala}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <p className="eyebrow mb-3">Os 5 passos</p>
          <div className="space-y-2">
            {CLARA_PASSOS.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-essencia-500/30 bg-essencia-900/30 px-3 py-2.5"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-semibold"
                  style={{ background: `${p.cor}22`, color: p.cor }}
                >
                  {p.letra}
                </span>
                <div>
                  <p className="text-sm font-semibold text-creme-50">{p.nome}</p>
                  <p className="text-xs text-creme-200/60">{p.descricao}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-champagne-500/25 bg-champagne-500/10 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-champagne-500" />
            <p className="text-xs text-creme-200/80">
              Nunca pule o “Compreenda”. Validar a emoção antes de defender é o que mantém a conversa aberta.
            </p>
          </div>
        </Card>

        <div className="lg:col-span-3">
          <Simulador key={caso.id} caso={caso} nicho={nicho} />
        </div>
      </div>
    </div>
  );
}
