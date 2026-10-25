import { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { ApiError, type Api } from '../lib/api.ts';
import { calculationCsv, historyCsv } from '../lib/csv.ts';
import {
  EXAMPLE_INPUT,
  LIMITS,
  calculatePricing,
  findError,
  formatBRL,
  isCompletePricingInput,
  type PricingFields,
} from '../lib/pricing.ts';
import type { ScenarioDTO } from '../lib/types.ts';
import { Diagnosis } from './Diagnosis.tsx';
import { NumberField, TextField } from './Fields.tsx';
import { ScenarioHistory } from './ScenarioHistory.tsx';

type CalculatorProps = {
  api: Api;
  onUnauthorized: () => void;
};

function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slug(value: string): string {
  const base = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'cenario';
}

export function Calculator({ api, onUnauthorized }: CalculatorProps) {
  const [nome, setNome] = useState('');
  const [input, setInput] = useState<PricingFields>(EXAMPLE_INPUT);
  const [scenarios, setScenarios] = useState<ScenarioDTO[]>([]);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const result = useMemo(() => calculatePricing(input), [input]);
  const failure = result.ok ? null : result;

  useEffect(() => {
    let cancelled = false;
    api
      .listScenarios()
      .then((data) => {
        if (!cancelled) setScenarios(data);
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        if (caught instanceof ApiError && caught.status === 401) {
          onUnauthorized();
          return;
        }
        setError(caught instanceof Error ? caught.message : 'Não foi possível carregar o histórico.');
      });
    return () => {
      cancelled = true;
    };
  }, [api, onUnauthorized]);

  function setField(key: keyof PricingFields) {
    return (value: number | null) => {
      setInput((current) => ({ ...current, [key]: value }));
    };
  }

  const compared = scenarios.find((scenario) => scenario.id === compareId) ?? null;
  const comparedResult = compared ? calculatePricing(compared.inputs) : null;
  const comparison =
    compared && comparedResult?.ok ? { nome: compared.nomeProcedimento, result: comparedResult } : null;

  async function onSave() {
    setError(null);
    setStatus(null);
    if (!isCompletePricingInput(input) || !result.ok) {
      setError('Corrija os campos antes de salvar. O histórico só guarda cenários com preço viável.');
      return;
    }
    if (nome.trim().length === 0) {
      setError('Dê um nome ao procedimento para salvar o cenário.');
      return;
    }
    setSaving(true);
    try {
      const scenario = await api.saveScenario({ nomeProcedimento: nome.trim(), inputs: input });
      setScenarios((current) => [scenario, ...current]);
      setStatus(`Cenário “${scenario.nomeProcedimento}” salvo no seu histórico.`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        onUnauthorized();
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      await api.deleteScenario(id);
      setScenarios((current) => current.filter((scenario) => scenario.id !== id));
      if (compareId === id) setCompareId(null);
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        onUnauthorized();
        return;
      }
      setError(caught instanceof Error ? caught.message : 'Não foi possível excluir.');
    }
  }

  function onExportCalculation() {
    if (!result.ok || !isCompletePricingInput(input)) return;
    downloadText(`${slug(nome || 'cenario')}.csv`, calculationCsv(nome.trim(), input, result));
  }

  const discountPrice = result.ok ? formatBRL(result.precoComDesconto) : '—';
  const discountUnhealthy = result.ok && result.temDesconto && (result.abaixoDoCusto || result.margemEfetivaNegativa);

  return (
    <div className="space-y-6">
      <section className="bg-white border border-essence-gold/30 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-semibold text-essence-dark flex items-center gap-2">
          <Info size={16} aria-hidden="true" className="text-essence-wine" />
          Pró-labore e margem não são a mesma coisa
        </h2>
        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
          A remuneração mensal desejada vira a hora técnica e entra no custo do atendimento como pró-labore, junto com
          produtos e despesas fixas. A margem de lucro é aplicada depois, por cima desse custo. O pró-labore paga o seu
          tempo; a margem é o lucro do negócio.
        </p>
      </section>

      <div className="calc-layout grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print lg:col-span-2 space-y-6 order-2 lg:order-1">
          <section className="no-print bg-white rounded-xl p-6 shadow-sm border border-essence-gold/20">
            <h2 className="text-lg font-semibold text-essence-dark mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-essence-gold" aria-hidden="true" />
              1. Procedimento, custos e tempo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <TextField
                  id="nomeProcedimento"
                  label="Nome do procedimento"
                  value={nome}
                  maxLength={120}
                  help="Identifica o cenário no seu histórico e no relatório. Só você vê o que salvar."
                  onChange={setNome}
                />
              </div>
              <NumberField
                id="custoMaterial"
                label="Custo de produtos e descartáveis (R$)"
                value={input.custoMaterial}
                min={0}
                max={LIMITS.moneyMax}
                help="Materiais, produtos e descartáveis usados neste atendimento."
                error={input.custoMaterial === null ? 'Informe um número válido.' : null}
                onChange={setField('custoMaterial')}
              />
              <NumberField
                id="custoFixo"
                label="Rateio de despesas fixas por atendimento (R$)"
                value={input.custoFixo}
                min={0}
                max={LIMITS.moneyMax}
                help="Aluguel, energia, internet e outras despesas do mês, divididas pelo número de atendimentos."
                error={input.custoFixo === null ? 'Informe um número válido.' : null}
                onChange={setField('custoFixo')}
              />
              <NumberField
                id="taxasVariaveis"
                label="Taxas de cartão / impostos variáveis (%)"
                value={input.taxasVariaveis}
                min={0}
                max={LIMITS.percentMax}
                help="O que sai do preço para maquininha, marketplace e impostos variáveis. De 0 a 100."
                error={
                  input.taxasVariaveis === null
                    ? 'Informe um número válido.'
                    : failure && findError(failure, 'divisor_inviavel')
                      ? 'Taxas + margem precisam ficar abaixo de 100%.'
                      : null
                }
                onChange={setField('taxasVariaveis')}
              />
              <NumberField
                id="margemLucro"
                label="Margem de lucro desejada (%)"
                value={input.margemLucro}
                min={0}
                max={LIMITS.percentMax}
                help="Lucro do negócio sobre o preço, depois de cobrir custo e taxas. De 0 a 100. Somada às taxas, precisa ficar abaixo de 100."
                error={
                  input.margemLucro === null
                    ? 'Informe um número válido.'
                    : failure && findError(failure, 'divisor_inviavel')
                      ? 'Taxas + margem precisam ficar abaixo de 100%.'
                      : null
                }
                onChange={setField('margemLucro')}
              />
            </div>
            {input.taxasVariaveis !== null && input.margemLucro !== null ? (
              <p className="text-xs text-gray-600 mt-3">
                Taxas + margem = {(input.taxasVariaveis + input.margemLucro).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%.
              </p>
            ) : null}
          </section>

          <section className="no-print bg-white rounded-xl p-6 shadow-sm border border-essence-gold/20">
            <h2 className="text-lg font-semibold text-essence-dark mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-essence-gold" aria-hidden="true" />
              2. Remuneração e tempo de execução
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberField
                id="remuneracaoDesejada"
                label="Remuneração mensal desejada (R$)"
                value={input.remuneracaoDesejada}
                min={0}
                max={LIMITS.moneyMax}
                help="Quanto você quer retirar no mês pelo seu trabalho (pró-labore), antes da margem de lucro."
                error={input.remuneracaoDesejada === null ? 'Informe um número válido.' : null}
                onChange={setField('remuneracaoDesejada')}
              />
              <NumberField
                id="horasProdutivas"
                label="Horas produtivas no mês"
                value={input.horasProdutivas}
                min={0}
                max={LIMITS.hoursMax}
                help="Horas em que você realmente atende. Vazio ou zero não vira 1 — o cálculo para e avisa."
                error={failure ? findError(failure, 'horas_produtivas') : null}
                onChange={setField('horasProdutivas')}
              />
              <NumberField
                id="tempoProcedimento"
                label="Tempo do procedimento (horas)"
                value={input.tempoProcedimento}
                min={0}
                max={LIMITS.hoursMax}
                help="Duração deste atendimento. Ex.: 1,5 hora pode ser digitada como 1,5 ou 1.5."
                error={input.tempoProcedimento === null ? 'Informe um número válido.' : null}
                onChange={setField('tempoProcedimento')}
              />
            </div>
          </section>

          <section className="no-print bg-white rounded-xl p-6 shadow-sm border border-essence-gold/20">
            <h2 className="text-lg font-semibold text-essence-dark mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-essence-gold" aria-hidden="true" />
              3. Simulador de defesa de preço
            </h2>
            <p className="text-xs text-gray-600 mb-4">Teste o desconto antes de ceder. O limite deste simulador é 50%.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <NumberField
                id="percentualDesconto"
                label="Aplicar desconto (%)"
                value={input.percentualDesconto}
                min={0}
                max={LIMITS.discountMax}
                help="De 0 a 50. Se o preço com desconto ficar abaixo do custo, o alerta deixa de tratar o valor como saudável."
                error={input.percentualDesconto === null ? 'Informe um número válido.' : null}
                onChange={setField('percentualDesconto')}
              />
              <div
                className={`p-3 rounded-lg border ${discountUnhealthy ? 'bg-red-50 border-red-400' : 'bg-essence-cream border-essence-gold/40'}`}
              >
                <span className="text-xs text-gray-700 block">Preço com desconto</span>
                <span data-testid="discount-price" className={`text-lg font-bold ${discountUnhealthy ? 'text-red-900' : 'text-essence-dark'}`}>
                  {discountPrice}
                </span>
                {discountUnhealthy ? (
                  <p className="text-xs font-semibold text-red-900 mt-2">
                    Este valor não é um preço saudável. O diagnóstico explica a margem efetiva.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onSave()}
                disabled={saving}
                className="bg-essence-dark text-essence-cream text-sm font-semibold rounded-xl px-4 py-2.5 disabled:opacity-50"
              >
                {saving ? 'Salvando…' : 'Salvar cenário'}
              </button>
              <button
                type="button"
                onClick={() => setInput(EXAMPLE_INPUT)}
                className="text-sm font-semibold rounded-xl px-4 py-2.5 border border-essence-gold text-essence-dark"
              >
                Restaurar valores de exemplo
              </button>
            </div>
            {status ? (
              <p role="status" className="text-sm text-essence-wine mt-3">
                {status}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-red-800 mt-3">
                {error}
              </p>
            ) : null}
          </section>

          <ScenarioHistory
            scenarios={scenarios}
            compareId={compareId}
            onLoad={(scenario) => {
              setNome(scenario.nomeProcedimento);
              setInput(scenario.inputs);
              setStatus(`Cenário “${scenario.nomeProcedimento}” carregado.`);
            }}
            onCompare={(scenario) => setCompareId((current) => (current === scenario.id ? null : scenario.id))}
            onDelete={(id) => void onDelete(id)}
            onExport={() => downloadText('historico-precificacao.csv', historyCsv(scenarios))}
          />
        </div>

        <div className="order-1 lg:order-2">
          <Diagnosis
            nome={nome}
            input={input}
            result={result}
            comparison={comparison}
            onExport={onExportCalculation}
          />
        </div>
      </div>
    </div>
  );
}
