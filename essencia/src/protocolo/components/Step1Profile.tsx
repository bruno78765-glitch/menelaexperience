import { NICHES, type ClientProfile, type NicheId } from '../lib/protocol';
import { Card, Field, SectionTitle, Button } from './ui';
import { ArrowRight } from 'lucide-react';

interface Step1Props {
  profile: ClientProfile;
  onChange: (patch: Partial<ClientProfile>) => void;
  onNext: () => void;
}

export function Step1Profile({ profile, onChange, onNext }: Step1Props) {
  const canProceed = profile.clientName.trim() && profile.niche;

  return (
    <Card className="animate-fade-in">
      <SectionTitle
        eyebrow="Etapa 1 · Dados & Perfil"
        title="Identificação da Cliente & Estabelecimento"
        subtitle="Registre as informações para personalizar o documento e facilitar o contato."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nome Completo da Cliente"
          placeholder="Ex.: Maria Silva"
          value={profile.clientName}
          onChange={(e) => onChange({ clientName: e.target.value })}
        />
        <Field
          label="Telefone / WhatsApp"
          placeholder="(00) 00000-0000"
          value={profile.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
        <Field
          label="E-mail"
          type="email"
          placeholder="cliente@email.com"
          value={profile.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <Field
          label="Data de Nascimento"
          type="date"
          value={profile.birthDate}
          onChange={(e) => onChange({ birthDate: e.target.value })}
        />
        <Field
          label="Nome da Profissional / Clínica"
          placeholder="Ex.: Ana Beatriz · Clínica Aura"
          value={profile.professionalName}
          onChange={(e) => onChange({ professionalName: e.target.value })}
        />
        <Field
          label="Nome do Estabelecimento"
          placeholder="Ex.: Clínica Aura Estética"
          value={profile.establishment}
          onChange={(e) => onChange({ establishment: e.target.value })}
          hint="Aparece no cabeçalho do laudo."
        />
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm font-bold text-wine-700">Selecione a Especialidade</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const active = profile.niche === niche.id;
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => onChange({ niche: niche.id as NicheId })}
                className={`group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-300 ease-in-out ${
                  active
                    ? 'border-gold-400 bg-cream-50 shadow-luxe-sm ring-2 ring-gold-400/50'
                    : 'border-stone-200 bg-white hover:border-gold-400/60 hover:-translate-y-0.5 hover:shadow-luxe-sm'
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                    active ? 'gradient-wine text-gold-400' : 'bg-cream-100 text-wine-700'
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <span>
                  <span className="block text-base font-extrabold text-wine-700">
                    {niche.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-wine-700/60">
                    {niche.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onNext} disabled={!canProceed}>
          Avançar para Anamnese
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
