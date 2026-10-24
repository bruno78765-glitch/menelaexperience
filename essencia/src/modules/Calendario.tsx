import { useMemo, useState } from 'react';
import {
  ChevronDown,
  BookOpen,
  Lightbulb,
  ListChecks,
  MessageCircle,
  CalendarDays,
} from 'lucide-react';
import { SectionHeader, EmptyState, PilarTag } from '@/components/ui';
import { PILARES, gerarCalendario, type Pilar, type DiaCalendario } from '@/data/calendario';
import { PILAR_ICONES } from '@/data/modulos';

function DiaCard({
  dia,
  pilarMeta,
  nicho,
}: {
  dia: DiaCalendario;
  pilarMeta: (typeof PILARES)[number];
  nicho: string;
}) {
  const [aberto, setAberto] = useState(false);
  const Icone = PILAR_ICONES[pilarMeta.nome] ?? BookOpen;

  return (
    <div
      className="glass rounded-2xl transition-all duration-300 ease-in-out"
      style={{ borderColor: `${pilarMeta.cor}33` }}
    >
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-4 px-4 py-4 text-left"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-semibold"
          style={{ background: `${pilarMeta.cor}22`, color: pilarMeta.cor }}
        >
          {dia.dia}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <PilarTag
              nome={dia.pilar}
              cor={pilarMeta.cor}
              corTexto={pilarMeta.corTexto}
              icone={<Icone className="h-3.5 w-3.5" />}
            />
            <span className="text-xs text-creme-200/50">{dia.formato}</span>
          </div>
          <p className="truncate text-sm font-medium text-creme-50">
            {dia.tema}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-creme-200/60 transition-transform duration-300 ${
            aberto ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          aberto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-essencia-500/30 px-4 py-4">
            <p className="mb-3 text-sm text-creme-200/80">
              <span className="font-semibold text-champagne-500">Gancho: </span>
              {dia.gancho}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-soft rounded-xl p-4">
                <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-champagne-500">
                  <Lightbulb className="h-4 w-4" /> Objetivo
                </p>
                <p className="text-sm text-creme-200/80">{dia.guia.objetivo}</p>
              </div>
              <div className="glass-soft rounded-xl p-4">
                <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-champagne-500">
                  <MessageCircle className="h-4 w-4" /> CTA
                </p>
                <p className="text-sm text-creme-200/80">{dia.guia.cta}</p>
              </div>
            </div>

            <div className="mt-3 glass-soft rounded-xl p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-champagne-500">
                <ListChecks className="h-4 w-4" /> Estrutura de execução
              </p>
              <ol className="space-y-2">
                {dia.guia.estrutura.map((passo, i) => (
                  <li key={i} className="flex gap-3 text-sm text-creme-200/85">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                      style={{ background: `${pilarMeta.cor}22`, color: pilarMeta.cor }}
                    >
                      {i + 1}
                    </span>
                    {passo}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-3 rounded-xl border border-champagne-500/30 bg-champagne-500/10 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-champagne-500">
                Roteiro base
              </p>
              <p className="text-sm leading-relaxed text-creme-50/90">
                {dia.guia.roteiroBase}
              </p>
              {nicho && (
                <p className="mt-2 text-xs text-creme-200/55">
                  Adaptado ao nicho: <span className="text-champagne-400">{nicho}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Calendario({
  nicho,
  onConfigurar,
}: {
  nicho: string;
  onConfigurar: () => void;
}) {
  const [filtro, setFiltro] = useState<Pilar | 'Todos'>('Todos');

  const nichoLimpo = nicho.trim();
  const dias = useMemo(() => gerarCalendario(nichoLimpo || 'seu nicho'), [nichoLimpo]);

  const diasFiltrados =
    filtro === 'Todos' ? dias : dias.filter((d) => d.pilar === filtro);

  const contarPilar = (p: Pilar) => dias.filter((d) => d.pilar === p).length;

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Módulo 2 · Calendário Editorial Inteligente"
        titulo="Seus 30 dias de conteúdo no sistema certo"
        descricao="Cada dia segue um dos 5 pilares do Método Essência. O tema se adapta ao seu nicho. Clique em um dia para abrir o Guia de Execução Real."
      />

      {!nichoLimpo ? (
        <EmptyState
          titulo="Defina seu nicho para personalizar o calendário"
          descricao="Vá ao Dashboard e preencha o nicho de atuação. O calendário se adapta automaticamente."
          acao={
            <button onClick={onConfigurar} className="btn-gold">
              <CalendarDays className="h-4 w-4" /> Ir para o diagnóstico
            </button>
          }
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <button
              onClick={() => setFiltro('Todos')}
              className={`glass-soft rounded-xl p-3 text-left transition-all duration-300 ${
                filtro === 'Todos'
                  ? 'ring-1 ring-champagne-500'
                  : 'hover:border-champagne-500/40'
              }`}
            >
              <p className="font-display text-xl text-creme-50">30</p>
              <p className="text-xs text-creme-200/60">Todos os pilares</p>
            </button>
            {PILARES.map((p) => {
              const Icone = PILAR_ICONES[p.nome] ?? BookOpen;
              const ativo = filtro === p.nome;
              return (
                <button
                  key={p.nome}
                  onClick={() => setFiltro(p.nome)}
                  className={`glass-soft rounded-xl p-3 text-left transition-all duration-300 ${
                    ativo ? 'ring-1 ring-champagne-500' : 'hover:border-champagne-500/40'
                  }`}
                  style={{ borderColor: ativo ? `${p.cor}66` : undefined }}
                >
                  <div className="flex items-center gap-2">
                    <Icone className="h-4 w-4" style={{ color: p.cor }} />
                    <span className="text-xs font-medium" style={{ color: p.corTexto }}>
                      {p.nome}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-xl text-creme-50">
                    {contarPilar(p.nome)}
                  </p>
                  <p className="text-xs text-creme-200/55">dias no mês</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {diasFiltrados.map((dia) => {
              const meta = PILARES.find((p) => p.nome === dia.pilar)!;
              return (
                <DiaCard
                  key={dia.dia}
                  dia={dia}
                  pilarMeta={meta}
                  nicho={nichoLimpo}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
