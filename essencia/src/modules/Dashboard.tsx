import { useEffect, useState } from 'react';
import { Target, TrendingUp, Users, Clapperboard, Save, Check, Sparkles } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import { calcularConversao, DIAS_DO_CALENDARIO, VIEWS_POR_CONTEUDO, type DiagnosticoNegocio } from '@/lib/diagnostico';
import type { ControleDiagnostico } from '@/hooks/useDiagnostico';

function StatCard({
  icone: Icone,
  label,
  valor,
  hint,
  cor,
}: {
  icone: typeof Target;
  label: string;
  valor: string;
  hint: string;
  cor: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${cor}22`, color: cor }}>
          <Icone className="h-5 w-5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-creme-200/60">{label}</p>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-creme-50">{valor}</p>
      <p className="mt-1 text-xs text-creme-200/60">{hint}</p>
    </div>
  );
}

const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function Dashboard({
  diagnostico,
  onIrPara,
}: {
  diagnostico: ControleDiagnostico;
  onIrPara: (id: 'calendario' | 'estudio') => void;
}) {
  const { rascunho, editar, salvar, salvando, erro, aviso } = diagnostico;
  const [salvo, setSalvo] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);

  useEffect(() => {
    if (!salvo) return;
    const timer = window.setTimeout(() => setSalvo(false), 2500);
    return () => window.clearTimeout(timer);
  }, [salvo]);

  function atualizar<K extends keyof DiagnosticoNegocio>(chave: K, valor: DiagnosticoNegocio[K]) {
    editar({ ...rascunho, [chave]: valor });
    setSalvo(false);
    setFalha(null);
  }

  async function persistir(): Promise<boolean> {
    const resultado = await salvar(rascunho);
    if (!resultado.ok) {
      setFalha(resultado.mensagem);
      setSalvo(false);
      return false;
    }
    setFalha(null);
    setSalvo(true);
    return true;
  }

  async function ir(id: 'calendario' | 'estudio') {
    const gravou = await persistir();
    if (gravou) onIrPara(id);
  }

  const calc = calcularConversao(rascunho);
  const mensagem = falha ?? erro;

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Módulo 1 · Diagnóstico de Negócio"
        titulo="O ponto de partida do seu plano de receita"
        descricao="Preencha os dados do seu negócio. A conta usa a taxa de conversão que você escolher abaixo. O 25% é só o ponto de partida do controle."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void persistir();
            }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="diagnostico-nome" className="mb-1.5 block text-sm font-medium text-creme-50">
                Seu nome
              </label>
              <input
                id="diagnostico-nome"
                className="input-lux"
                placeholder="Ex: Mariana Souza"
                value={rascunho.nome}
                onChange={(event) => atualizar('nome', event.target.value)}
                required
                minLength={2}
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="diagnostico-nicho" className="mb-1.5 block text-sm font-medium text-creme-50">
                Nicho de atuação
              </label>
              <input
                id="diagnostico-nicho"
                className="input-lux"
                placeholder="Ex: decoração minimalista"
                value={rascunho.nicho}
                onChange={(event) => atualizar('nicho', event.target.value)}
                required
                minLength={2}
                maxLength={120}
              />
              <p className="mt-1.5 text-xs text-creme-200/55">
                O calendário e os roteiros usam este nicho na hora. Salvar grava o diagnóstico na sua conta.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="diagnostico-meta" className="mb-1.5 block text-sm font-medium text-creme-50">
                  Meta de faturamento
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-creme-200/60">
                    R$
                  </span>
                  <input
                    id="diagnostico-meta"
                    type="number"
                    min={1}
                    step={100}
                    className="input-lux pl-10"
                    value={rascunho.metaFaturamento}
                    onChange={(event) => atualizar('metaFaturamento', Number(event.target.value))}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="diagnostico-ticket" className="mb-1.5 block text-sm font-medium text-creme-50">
                  Ticket médio
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-creme-200/60">
                    R$
                  </span>
                  <input
                    id="diagnostico-ticket"
                    type="number"
                    min={1}
                    step={50}
                    className="input-lux pl-10"
                    value={rascunho.ticketMedio}
                    onChange={(event) => atualizar('ticketMedio', Number(event.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="diagnostico-taxa" className="mb-1.5 block text-sm font-medium text-creme-50">
                Taxa de conversão de leads (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="diagnostico-taxa"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={Number.isFinite(rascunho.taxaConversao) ? rascunho.taxaConversao : 25}
                  onChange={(event) => atualizar('taxaConversao', Number(event.target.value))}
                  className="flex-1 accent-champagne-500"
                />
                <span className="w-14 rounded-lg border border-essencia-500/50 bg-essencia-900/40 px-3 py-1.5 text-center font-medium text-champagne-500">
                  {rascunho.taxaConversao}%
                </span>
              </div>
              <p className="mt-1.5 text-xs text-creme-200/55">Ponto de partida: 25%. A conta usa o valor deste controle.</p>
            </div>
            {aviso && (
              <p role="status" className="rounded-xl border border-champagne-500/30 bg-champagne-500/10 px-3 py-2 text-sm text-creme-50">
                {aviso}
              </p>
            )}
            {mensagem && (
              <p role="alert" className="rounded-xl border border-red-300/40 bg-red-950/40 px-3 py-2 text-sm text-red-100">
                {mensagem}
              </p>
            )}
            <button type="submit" className="btn-gold w-full" disabled={salvando}>
              {salvando ? (
                <>
                  <Save className="h-4 w-4 animate-pulseSoft" /> Salvando…
                </>
              ) : salvo ? (
                <>
                  <Check className="h-4 w-4" /> Diagnóstico salvo
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Salvar diagnóstico
                </>
              )}
            </button>
          </form>
        </Card>

        <div className="lg:col-span-3">
          {calc.ok ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  icone={Target}
                  label="Meta mensal"
                  valor={formatBRL(calc.metaMensal)}
                  hint={`Ticket médio ${formatBRL(calc.ticketMedio)}`}
                  cor="#D9B07E"
                />
                <StatCard
                  icone={TrendingUp}
                  label="Vendas necessárias"
                  valor={String(calc.vendasNecessarias)}
                  hint="Para bater a meta"
                  cor="#E2C39A"
                />
                <StatCard
                  icone={Users}
                  label="Leads necessários"
                  valor={String(calc.leadsNecessarios)}
                  hint={`Conversão ${calc.taxaConversao}%`}
                  cor="#C85A80"
                />
              </div>
              <Card className="mt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-500/15 text-champagne-500">
                    <Clapperboard className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg text-creme-50">Conteúdos para gerar os leads</p>
                    <p className="text-xs text-creme-200/60">
                      {calc.viewsNecessarios.toLocaleString('pt-BR')} visualizações. 5% viram lead e cada conteúdo entra com cerca de {VIEWS_POR_CONTEUDO} visualizações.
                    </p>
                  </div>
                  <span className="ml-auto font-display text-3xl font-semibold gold-text">{calc.conteudoNecessario}</span>
                </div>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-essencia-900/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-champagne-700 via-champagne-500 to-champagne-300 transition-all duration-700"
                    style={{ width: `${Math.min(100, (calc.conteudoNecessario / DIAS_DO_CALENDARIO) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-creme-200/55">
                  {calc.cabeNoCalendario
                    ? `Cabe nos ${DIAS_DO_CALENDARIO} dias do calendário, com um conteúdo por dia.`
                    : `Passa dos ${DIAS_DO_CALENDARIO} dias. Publique mais de uma vez por dia ou ajuste meta, ticket e taxa.`}
                </p>
              </Card>
            </>
          ) : (
            <Card>
              <p className="font-display text-xl text-creme-50">A conta espera números válidos</p>
              <p className="mt-2 text-sm text-creme-200/70">{calc.motivo}</p>
            </Card>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => void ir('calendario')} className="btn-gold flex-1" disabled={salvando}>
              <Sparkles className="h-4 w-4" /> Ver calendário de 30 dias
            </button>
            <button type="button" onClick={() => void ir('estudio')} className="btn-ghost flex-1" disabled={salvando}>
              <Clapperboard className="h-4 w-4" /> Abrir estúdio de conteúdo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
