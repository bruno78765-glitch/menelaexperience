import {
  Sparkles,
  Eye,
  Hand,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';

export type NicheId = 'limpeza' | 'sobrancelhas' | 'nail' | 'corporal';

export interface Niche {
  id: NicheId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const NICHES: Niche[] = [
  {
    id: 'limpeza',
    label: 'Limpeza Facial',
    description: 'Estética facial profunda e revitalização',
    icon: Sparkles,
  },
  {
    id: 'sobrancelhas',
    label: 'Design de Sobrancelhas',
    description: 'Arcadia, harmonização e design personalizado',
    icon: Eye,
  },
  {
    id: 'nail',
    label: 'Nail Designer',
    description: 'Manicure, alongamento e arte em unhas',
    icon: Hand,
  },
  {
    id: 'corporal',
    label: 'Estética Corporal',
    description: 'Tratamentos, modelagem e bem-estar corporal',
    icon: HeartPulse,
  },
];

export interface ClientProfile {
  clientName: string;
  phone: string;
  email: string;
  birthDate: string;
  professionalName: string;
  establishment: string;
  niche: NicheId | null;
}

export type YesNo = 'sim' | 'nao' | null;

export interface ClinicalHistory {
  pregnant: YesNo;
  allergies: YesNo;
  allergiesDetail: string;
  acidsMeds: YesNo;
  acidsMedsDetail: string;
  chronicConditions: string[];
  recentSurgery: YesNo;
  recentSurgeryDetail: string;
}

export const CHRONIC_CONDITIONS: { id: string; label: string }[] = [
  { id: 'queloide', label: 'Queloide' },
  { id: 'hipertensao', label: 'Hipertensão' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'cicatrizacao', label: 'Problemas de cicatrização' },
  { id: 'sensibilidade', label: 'Sensibilidade cutânea' },
  { id: 'lupus', label: 'Lúpus / autoimune' },
];

export interface PhysicalAssessment {
  complaints: string[];
  notes: string;
}

export interface Complaint {
  id: string;
  label: string;
  niches: NicheId[];
}

export const COMPLAINTS: Complaint[] = [
  { id: 'oleosidade', label: 'Oleosidade excessiva', niches: ['limpeza'] },
  { id: 'acne', label: 'Acne / Cravos', niches: ['limpeza'] },
  { id: 'manchas', label: 'Manchas e hiperpigmentação', niches: ['limpeza'] },
  { id: 'poros', label: 'Poros dilatados', niches: ['limpeza'] },
  { id: 'ressecamento', label: 'Pele ressecada', niches: ['limpeza'] },
  { id: 'flacidez', label: 'Flacidez facial', niches: ['limpeza'] },
  { id: 'finas', label: 'Sobrancelhas finas / falhas', niches: ['sobrancelhas'] },
  { id: 'assimetricas', label: 'Sobrancelhas assimétricas', niches: ['sobrancelhas'] },
  { id: 'excesso_pelos', label: 'Excesso de pelos', niches: ['sobrancelhas'] },
  { id: 'vermelhidao_o', label: 'Vermelhidão / irritação local', niches: ['sobrancelhas', 'limpeza'] },
  { id: 'unhas_fracas', label: 'Unhas fracas / quebradiças', niches: ['nail'] },
  { id: 'crescimento', label: 'Crescimento lento', niches: ['nail'] },
  { id: 'fungos', label: 'Suspeita de micose', niches: ['nail'] },
  { id: 'cuticulas', label: 'Cutículas ressecadas', niches: ['nail'] },
  { id: 'manchas_maos', label: 'Manchas nas mãos', niches: ['nail', 'corporal'] },
  { id: 'celulite', label: 'Celulite / Fibrose', niches: ['corporal'] },
  { id: 'gordura', label: 'Gordura localizada', niches: ['corporal'] },
  { id: 'retencao', label: 'Retenção de líquidos', niches: ['corporal'] },
  { id: 'estrias', label: 'Estrias', niches: ['corporal'] },
  { id: 'flacidez_corpo', label: 'Flacidez corporal', niches: ['corporal'] },
];

export interface Protocol {
  diagnosis: string;
  procedure: string[];
  homeCare: string[];
  returnDate: string;
  warnings: string[];
}

export function buildProtocol(
  profile: ClientProfile,
  history: ClinicalHistory,
  assessment: PhysicalAssessment,
): Protocol {
  const complaintLabels = assessment.complaints.map(
    (id) => COMPLAINTS.find((c) => c.id === id)?.label ?? id,
  );

  const diagnosisBase: Record<NicheId, string> = {
    limpeza:
      'Avaliação facial completa indica necessidade de renovação cutânea e reequilíbrio da barreira lipídica.',
    sobrancelhas:
      'Avaliação do desenho natural das sobrancelhas aponta oportunidade de harmonização e definição da moldura facial.',
    nail:
      'Avaliação da integridade ungueal revela necessidade de fortalecimento e cuidado estético das unhas e cutículas.',
    corporal:
      'Avaliação corporal identifica áreas para tonificação, modelagem e tratamentos estéticos direcionados.',
  };

  const procedures: Record<NicheId, string[]> = {
    limpeza: [
      'Limpeza profunda de pele com esfoliação enzimática controlada',
      'Extração suave de comedões com técnica asséptica',
      'Aplicação de máscara calmante e hidratante profissional',
      'Finalização com protetor físico e proteção solar',
    ],
    sobrancelhas: [
      'Mapeamento do desenho ideal conforme medida facial',
      'Henna profissional para definição e preenchimento',
      'Remoção precisa dos pelos com pinça e linha',
      'Sobrancelha finalizadora e fixação com gel profissional',
    ],
    nail: [
      'Preparação da unha e cutilagem profissional',
      'Aplicação de base fortalecedora e técnica escolhida',
      'Arte e acabamento com esmaltação premium',
      'Hidratação das cutículas com óleo nutritivo',
    ],
    corporal: [
      'Esfoliação corporal de infusão suave',
      'Aplicação de técnica direcionada ao objetivo do tratamento',
      'Massagem modeladora / drenante conforme avaliação',
      'Finalização com creme reparador e proteção térmica',
    ],
  };

  const homeCare: Record<NicheId, string[]> = {
    limpeza: [
      'Lavagem com sabonete adequado ao tipo de pele, 2x ao dia',
      'Uso diário de protetor solar FPS 50+',
      'Hidratante leve formulado para reequilíbrio da oleosidade',
      'Evitar exposição solar direta por 48h pós-procedimento',
    ],
    sobrancelhas: [
      'Não molhar a região por 6 horas após o procedimento',
      'Evitar esfoliantes e produtos com ácido na região por 3 dias',
      'Hidratação local com óleo específico, 1x ao dia',
      'Retornar para retoque de manutenção conforme indicado',
    ],
    nail: [
      'Uso de luvas em atividades com água e produtos químicos',
      'Hidratação diária das cutículas com óleo fortalecedor',
      'Evitar uso das unhas como ferramenta',
      'Renovação do procedimento a cada 21 dias',
    ],
    corporal: [
      'Hidratação com loção corporal 2x ao dia',
      'Ingestão mínima de 2 litros de água por dia',
      'Manter rotina de atividade física leve recomendada',
      'Evitar banho muito quente nas primeiras 24h',
    ],
  };

  const warnings: string[] = [];
  if (history.pregnant === 'sim')
    warnings.push('Cliente gestante/lactante: procedimentos e produtos devem ser liberados conforme protocolo de segurança materno.');
  if (history.allergies === 'sim')
    warnings.push(
      `Alergia registrada: ${history.allergiesDetail || 'não especificada'}. Conferir composição de todos os produtos antes da aplicação.`,
    );
  if (history.acidsMeds === 'sim')
    warnings.push(
      `Uso contínuo relatado: ${history.acidsMedsDetail || 'não especificado'}. Avaliar contraindicações e ajustar intensidade do procedimento.`,
    );
  if (history.chronicConditions.length)
    warnings.push(
      `Condições clínicas relevantes: ${history.chronicConditions
        .map((id) => CHRONIC_CONDITIONS.find((c) => c.id === id)?.label ?? id)
        .join(', ')}.`,
    );
  if (history.recentSurgery === 'sim')
    warnings.push(
      `Cirurgia recente: ${history.recentSurgeryDetail || 'região não especificada'}. Evitar manipulação na área até liberação médica.`,
    );
  if (assessment.complaints.includes('acne') || assessment.complaints.includes('fungos'))
    warnings.push('Acompanhar evolução do quadro e retornar antes do prazo caso haja piora.');
  if (assessment.complaints.includes('vermelhidao_o'))
    warnings.push('Suspender produtos ativos na região até a completa cicatrização.');

  const returnDays: Record<NicheId, number> = {
    limpeza: 30,
    sobrancelhas: 21,
    nail: 21,
    corporal: 15,
  };
  const today = new Date();
  const retDate = new Date(today.getTime() + returnDays[profile.niche!] * 86400000);
  const returnDate = retDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const diagnosis = `${diagnosisBase[profile.niche!]}${
    complaintLabels.length ? ` Queixas registradas: ${complaintLabels.join(', ')}.` : ''
  }`;

  return {
    diagnosis,
    procedure: procedures[profile.niche!],
    homeCare: homeCare[profile.niche!],
    returnDate,
    warnings,
  };
}

export function ageFromBirth(birthDate: string): string | null {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age >= 0 ? String(age) : null;
}

export function formatYesNo(v: YesNo): string {
  return v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : '—';
}

export function buildWhatsappText(
  profile: ClientProfile,
  history: ClinicalHistory,
  _assessment: PhysicalAssessment,
  protocol: Protocol,
): string {
  const niche = NICHES.find((n) => n.id === profile.niche);
  const lines: string[] = [];
  lines.push(`*${profile.establishment || 'Estabelecimento'}*`);
  if (profile.professionalName) lines.push(`Profissional: ${profile.professionalName}`);
  lines.push('');
  lines.push('*PLANO DE CUIDADOS PERSONALIZADO*');
  lines.push(`Cliente: ${profile.clientName || '-'}`);
  if (profile.phone) lines.push(`Contato: ${profile.phone}`);
  lines.push(`Especialidade: ${niche?.label ?? '-'}`);
  lines.push('');
  const alerts: string[] = [];
  if (history.allergies === 'sim') alerts.push('Alergias');
  if (history.pregnant === 'sim') alerts.push('Gestante/Lactante');
  if (history.acidsMeds === 'sim') alerts.push('Uso de ácidos/medicação');
  if (history.chronicConditions.length) alerts.push('Condições clínicas');
  if (history.recentSurgery === 'sim') alerts.push('Cirurgia recente');
  if (alerts.length) lines.push(`🩺 *Alertas:* ${alerts.join(', ')}`);
  lines.push('');
  lines.push('🌿 *Diagnóstico*');
  lines.push(protocol.diagnosis);
  lines.push('');
  lines.push('📋 *Procedimento em Gabinete*');
  protocol.procedure.forEach((p) => lines.push(`• ${p}`));
  lines.push('');
  lines.push('💧 *Home Care*');
  protocol.homeCare.forEach((p) => lines.push(`• ${p}`));
  if (protocol.warnings.length) {
    lines.push('');
    lines.push('⚠️ *Observações*');
    protocol.warnings.forEach((p) => lines.push(`• ${p}`));
  }
  lines.push('');
  lines.push(`📅 *Retorno:* ${protocol.returnDate}`);
  return lines.join('\n');
}
