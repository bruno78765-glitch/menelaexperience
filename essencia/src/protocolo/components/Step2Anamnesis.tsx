import { CHRONIC_CONDITIONS, type ClinicalHistory } from '../lib/protocol';
import { Card, Field, SectionTitle, Button, YesNoToggle, QuestionRow } from './ui';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

interface Step2Props {
  history: ClinicalHistory;
  onChange: (patch: Partial<ClinicalHistory>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Anamnesis({ history, onChange, onBack, onNext }: Step2Props) {
  const toggleChronic = (id: string) => {
    const has = history.chronicConditions.includes(id);
    onChange({
      chronicConditions: has
        ? history.chronicConditions.filter((c) => c !== id)
        : [...history.chronicConditions, id],
    });
  };

  return (
    <Card className="animate-fade-in">
      <SectionTitle
        eyebrow="Etapa 2 · Anamnese & Histórico Clínico"
        title="Histórico Clínico & Segurança"
        subtitle="Informações essenciais para segurança jurídica e técnica do atendimento."
      />

      <div className="flex items-start gap-3 rounded-2xl border border-wine-400/30 bg-wine-50 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-wine-400" />
        <p className="text-sm text-wine-700/80">
          Os dados desta etapa geram alertas automáticos no laudo. Responda com
          precisão — qualquer &quot;Sim&quot; exige atenção redobrada antes do
          procedimento.
        </p>
      </div>

      <div className="mt-4">
        <QuestionRow label="Gestante ou Lactante?">
          <YesNoToggle
            value={history.pregnant}
            onChange={(v) => onChange({ pregnant: v })}
          />
        </QuestionRow>

        <QuestionRow label="Possui alergias conhecidas a cosméticos ou medicamentos?">
          <YesNoToggle
            value={history.allergies}
            onChange={(v) => onChange({ allergies: v })}
          />
        </QuestionRow>
        {history.allergies === 'sim' && (
          <div className="pb-5">
            <Field
              label="Quais alergias?"
              placeholder="Descreva os produtos/substâncias"
              value={history.allergiesDetail}
              onChange={(e) => onChange({ allergiesDetail: e.target.value })}
            />
          </div>
        )}

        <QuestionRow label="Faz uso de ácidos ou medicações contínuas (ex: Roacutan, Retinol)?">
          <YesNoToggle
            value={history.acidsMeds}
            onChange={(v) => onChange({ acidsMeds: v })}
          />
        </QuestionRow>
        {history.acidsMeds === 'sim' && (
          <div className="pb-5">
            <Field
              label="Quais medicamentos/ativos?"
              placeholder="Ex.: Roacutan, Retinol, Isotretinoína..."
              value={history.acidsMedsDetail}
              onChange={(e) => onChange({ acidsMedsDetail: e.target.value })}
            />
          </div>
        )}

        <div className="py-5">
          <p className="mb-3 text-base font-semibold text-wine-700">
            Possui histórico de alguma das condições abaixo?
          </p>
          <div className="flex flex-wrap gap-3">
            {CHRONIC_CONDITIONS.map((c) => {
              const active = history.chronicConditions.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleChronic(c.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'gradient-wine text-cream-50 shadow-luxe-sm ring-1 ring-gold-400/50'
                      : 'border border-gold-400/40 bg-white text-wine-700 hover:border-gold-400 hover:bg-cream-50'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <QuestionRow label="Passou por procedimentos cirúrgicos recentes na região?">
          <YesNoToggle
            value={history.recentSurgery}
            onChange={(v) => onChange({ recentSurgery: v })}
          />
        </QuestionRow>
        {history.recentSurgery === 'sim' && (
          <div className="pb-5">
            <Field
              label="Qual procedimento e região?"
              placeholder="Ex.: Blefaroplastia há 2 meses"
              value={history.recentSurgeryDetail}
              onChange={(e) => onChange({ recentSurgeryDetail: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Button>
        <Button onClick={onNext}>
          Avançar para Avaliação
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
