import { COMPLAINTS, type NicheId, type PhysicalAssessment } from '../lib/protocol';
import { Card, TextArea, SectionTitle, Button } from './ui';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Step3Props {
  assessment: PhysicalAssessment;
  niche: NicheId | null;
  onChange: (patch: Partial<PhysicalAssessment>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3Assessment({ assessment, niche, onChange, onBack, onNext }: Step3Props) {
  const filtered = niche
    ? COMPLAINTS.filter((c) => c.niches.includes(niche))
    : COMPLAINTS;

  const toggle = (id: string) => {
    const has = assessment.complaints.includes(id);
    onChange({
      complaints: has
        ? assessment.complaints.filter((c) => c !== id)
        : [...assessment.complaints, id],
    });
  };

  return (
    <Card className="animate-fade-in">
      <SectionTitle
        eyebrow="Etapa 3 · Queixa & Avaliação Física"
        title="Queixa Principal & Exame Físico"
        subtitle="Selecione as queixas e registre o mapeamento técnico da avaliação."
      />

      <div className="mb-6">
        <p className="mb-3 text-sm font-bold text-wine-700">
          Queixas Específicas{' '}
          <span className="font-medium text-stone-400">
            ({assessment.complaints.length} selecionadas)
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          {filtered.map((c) => {
            const active = assessment.complaints.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ease-in-out ${
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

      <TextArea
        label="Anotações Técnicas & Mapeamento Físico"
        rows={6}
        placeholder="Registre observações do exame: textura da pele, simetria, pontos de atenção, fotos anexadas, medidas..."
        value={assessment.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Button>
        <Button onClick={onNext}>
          Gerar Plano de Cuidados
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
