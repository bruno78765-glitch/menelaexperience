import { SectionHeader } from '@/components/ui';
import { Avaliacao } from '@/protocolo/Avaliacao';

export function Protocolos() {
  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Área da mentorada · Atendimento"
        titulo="Avaliação e protocolos"
        descricao="Ficha de anamnese e plano de cuidados deste atendimento. O PDF sai pela impressão, e o resumo abre no WhatsApp do telefone preenchido na ficha."
      />
      <Avaliacao />
    </div>
  );
}
