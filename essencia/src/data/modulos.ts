import {
  LayoutDashboard,
  CalendarDays,
  Clapperboard,
  MessageSquareText,
  LifeBuoy,
  Calculator,
  ClipboardCheck,
  type LucideIcon,
  GraduationCap,
  Award,
  HeartHandshake,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';

export type ModuleId =
  | 'dashboard'
  | 'calendario'
  | 'estudio'
  | 'vendas'
  | 'precificacao'
  | 'protocolos'
  | 'suporte';

export interface ModuloNav {
  id: ModuleId;
  label: string;
  sublabel: string;
  icone: LucideIcon;
}

export const MODULOS: ModuloNav[] = [
  { id: 'dashboard', label: 'Dashboard', sublabel: 'Diagnóstico de Negócio', icone: LayoutDashboard },
  { id: 'calendario', label: 'Calendário Editorial', sublabel: '30 dias · 5 pilares', icone: CalendarDays },
  { id: 'estudio', label: 'Estúdio de Conteúdo', sublabel: 'Reels · Carrosséis · Legenda', icone: Clapperboard },
  { id: 'vendas', label: 'Treinador de Vendas', sublabel: 'Método C.L.A.R.A.', icone: MessageSquareText },
  { id: 'precificacao', label: 'Calculadora', sublabel: 'Preço e viabilidade', icone: Calculator },
  { id: 'protocolos', label: 'Protocolos', sublabel: 'Anamnese e plano', icone: ClipboardCheck },
  { id: 'suporte', label: 'Suporte & Atendimento', sublabel: 'Dúvidas do sistema', icone: LifeBuoy },
];

export const PILAR_ICONES: Record<string, LucideIcon> = {
  Educação: GraduationCap,
  Autoridade: Award,
  Conexão: HeartHandshake,
  Prova: BadgeCheck,
  Convite: Sparkles,
};

export function moduloValido(id: string): id is ModuleId {
  return MODULOS.some((modulo) => modulo.id === id);
}
