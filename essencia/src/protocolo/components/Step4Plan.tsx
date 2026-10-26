import { useState } from 'react';
import {
  type ClientProfile,
  type ClinicalHistory,
  type PhysicalAssessment,
  type Protocol,
  NICHES,
  CHRONIC_CONDITIONS,
  buildWhatsappText,
  ageFromBirth,
  formatYesNo,
} from '../lib/protocol';
import { Button } from './ui';
import {
  FileText,
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  RotateCcw,
  User,
  Stethoscope,
  ClipboardList,
  Droplets,
  CalendarHeart,
  AlertTriangle,
} from 'lucide-react';

interface Step4Props {
  profile: ClientProfile;
  history: ClinicalHistory;
  assessment: PhysicalAssessment;
  protocol: Protocol;
  onBack: () => void;
  onRestart: () => void;
}

export function Step4Plan({ profile, history, assessment, protocol, onBack, onRestart }: Step4Props) {
  const [copied, setCopied] = useState(false);
  const text = buildWhatsappText(profile, history, assessment, protocol);
  const niche = NICHES.find((n) => n.id === profile.niche);
  const age = ageFromBirth(profile.birthDate);
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const hasAlerts =
    history.pregnant === 'sim' ||
    history.allergies === 'sim' ||
    history.acidsMeds === 'sim' ||
    history.chronicConditions.length > 0 ||
    history.recentSurgery === 'sim';

  const handlePdf = () => window.print();
  const handleWhatsapp = () => {
    const digits = profile.phone.replace(/\D/g, '');
    const url = digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Export buttons */}
      <div className="no-print grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={handlePdf}
          className="group flex items-center gap-4 rounded-2xl border border-gold-400/40 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-luxe"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-wine text-gold-400">
            <FileText className="h-7 w-7" strokeWidth={2.2} />
          </span>
          <span>
            <span className="block text-lg font-extrabold text-wine-700">
              Gerar Ficha e Laudo em PDF
            </span>
            <span className="mt-0.5 block text-sm text-wine-700/60">
              Imprime ou salva como documento
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={handleWhatsapp}
          className="group flex items-center gap-4 rounded-2xl border border-gold-400/40 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-luxe"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white">
            <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
          </span>
          <span>
            <span className="block text-lg font-extrabold text-wine-700">
              Enviar Resumo via WhatsApp
            </span>
            <span className="mt-0.5 block text-sm text-wine-700/60">
              Plano de cuidados formatado para a cliente
            </span>
          </span>
        </button>
      </div>

      {/* Document */}
      <div className="print-area rounded-3xl border border-gold-400/40 bg-white p-7 shadow-luxe shadow-stone-200/50 sm:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gold-400/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
              Ficha de Anamnese & Plano de Cuidados
            </p>
            <h2 className="mt-1 font-protocol-display text-2xl font-extrabold text-wine-700 sm:text-3xl">
              {profile.establishment || 'Estabelecimento'}
            </h2>
            <p className="mt-1 text-sm text-wine-700/70">
              {profile.professionalName && `Profissional: ${profile.professionalName} · `}
              {today}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 ring-1 ring-gold-400/40">
            <Stethoscope className="h-6 w-6 text-gold-600" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                Especialidade
              </p>
              <p className="text-sm font-bold text-wine-700">{niche?.label}</p>
            </div>
          </div>
        </div>

        {/* Dados da cliente */}
        <Block icon={User} title="Dados da Cliente & Status Clínico">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCell label="Nome" value={profile.clientName || '—'} />
            <InfoCell label="Idade" value={age ? `${age} anos` : '—'} />
            <InfoCell label="Telefone" value={profile.phone || '—'} />
            <InfoCell label="E-mail" value={profile.email || '—'} />
          </div>
        </Block>

        {/* Anamnese & alertas */}
        <Block icon={Stethoscope} title="Resumo da Anamnese & Alertas de Segurança">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCell label="Gestante / Lactante" value={formatYesNo(history.pregnant)} />
            <InfoCell label="Alergias" value={formatYesNo(history.allergies)} />
            <InfoCell label="Ácidos / Medicações" value={formatYesNo(history.acidsMeds)} />
            <InfoCell label="Cirurgia recente" value={formatYesNo(history.recentSurgery)} />
          </div>
          {history.allergies === 'sim' && history.allergiesDetail && (
            <DetailLine label="Alergias detalhadas" value={history.allergiesDetail} />
          )}
          {history.acidsMeds === 'sim' && history.acidsMedsDetail && (
            <DetailLine label="Medicações detalhadas" value={history.acidsMedsDetail} />
          )}
          {history.recentSurgery === 'sim' && history.recentSurgeryDetail && (
            <DetailLine label="Cirurgia detalhada" value={history.recentSurgeryDetail} />
          )}
          {history.chronicConditions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {history.chronicConditions.map((id) => {
                const label = CHRONIC_CONDITIONS.find((c) => c.id === id)?.label ?? id;
                return (
                  <span
                    key={id}
                    className="rounded-full bg-wine-50 px-3 py-1 text-xs font-bold text-wine-400"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}
          {hasAlerts && (
            <div className="mt-4 rounded-2xl border border-wine-400/30 bg-wine-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-wine-700">
                <AlertTriangle className="h-5 w-5 text-wine-400" />
                Atenção: esta cliente possui alertas de segurança ativos.
              </div>
              <ul className="mt-2 space-y-1.5">
                {protocol.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-wine-700/80">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Block>

        {/* Protocolo executado */}
        <Block icon={ClipboardList} title="Protocolo Executado em Gabinete">
          <p className="mb-3 text-base text-wine-700/80">{protocol.diagnosis}</p>
          <ul className="space-y-2.5">
            {protocol.procedure.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-wine-700/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                {p}
              </li>
            ))}
          </ul>
        </Block>

        {/* Home care */}
        <Block icon={Droplets} title="Home Care Personalizado">
          <ul className="space-y-2.5">
            {protocol.homeCare.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-base text-wine-700/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wine-400" />
                {p}
              </li>
            ))}
          </ul>
          {assessment.notes && (
            <p className="mt-4 rounded-xl bg-cream-50 p-4 text-sm italic text-wine-700/70">
              Anotações da avaliação: &ldquo;{assessment.notes}&rdquo;
            </p>
          )}
        </Block>

        {/* Retorno */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl gradient-wine p-6 text-cream-50 shadow-luxe">
          <CalendarHeart className="h-9 w-9 shrink-0 text-gold-400" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-400/90">
              Retorno Recomendado
            </p>
            <p className="font-protocol-display text-2xl font-extrabold sm:text-3xl">
              {protocol.returnDate}
            </p>
          </div>
        </div>
      </div>

      {/* Copy preview */}
      <div className="no-print rounded-3xl border border-gold-400/40 bg-white p-6 shadow-luxe shadow-stone-200/50 sm:p-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-wine-700">Pré-visualização do WhatsApp</p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 px-4 py-2 text-xs font-bold text-wine-700 transition-all duration-300 hover:bg-gold-400/20"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copiar texto
              </>
            )}
          </button>
        </div>
        <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-stone-200 bg-cream-50/50 p-5 font-sans text-sm leading-relaxed text-wine-700/80 scrollbar-luxe">
          {text}
        </pre>
      </div>

      <div className="no-print flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          Voltar para Avaliação
        </Button>
        <Button variant="gold" onClick={onRestart}>
          <RotateCcw className="h-5 w-5" />
          Novo Atendimento
        </Button>
      </div>
    </div>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-wine-700">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <h3 className="font-protocol-display text-xl font-extrabold text-wine-700">{title}</h3>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-cream-50/30 p-5">
        {children}
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-cream-50/40 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        {label}
      </p>
      <p className="text-base font-bold text-wine-700">{value}</p>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="mt-2 text-sm text-wine-700/70">
      <span className="font-bold text-wine-700">{label}: </span>
      {value}
    </p>
  );
}
