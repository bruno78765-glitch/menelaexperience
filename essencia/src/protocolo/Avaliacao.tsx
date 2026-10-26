import { useMemo, useState } from 'react';
import { Stepper, type Step } from './components/Stepper';
import { Step1Profile } from './components/Step1Profile';
import { Step2Anamnesis } from './components/Step2Anamnesis';
import { Step3Assessment } from './components/Step3Assessment';
import { Step4Plan } from './components/Step4Plan';
import {
  buildProtocol,
  type ClientProfile,
  type ClinicalHistory,
  type PhysicalAssessment,
} from './lib/protocol';

const STEPS: Step[] = [
  { id: 1, label: 'Dados & Perfil' },
  { id: 2, label: 'Anamnese & Histórico' },
  { id: 3, label: 'Queixa & Avaliação' },
  { id: 4, label: 'Plano de Cuidados' },
];

const emptyProfile: ClientProfile = {
  clientName: '',
  phone: '',
  email: '',
  birthDate: '',
  professionalName: '',
  establishment: '',
  niche: null,
};

const emptyHistory: ClinicalHistory = {
  pregnant: null,
  allergies: null,
  allergiesDetail: '',
  acidsMeds: null,
  acidsMedsDetail: '',
  chronicConditions: [],
  recentSurgery: null,
  recentSurgeryDetail: '',
};

const emptyAssessment: PhysicalAssessment = {
  complaints: [],
  notes: '',
};

export function Avaliacao() {
  const [current, setCurrent] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [profile, setProfile] = useState<ClientProfile>(emptyProfile);
  const [history, setHistory] = useState<ClinicalHistory>(emptyHistory);
  const [assessment, setAssessment] = useState<PhysicalAssessment>(emptyAssessment);

  const protocol = useMemo(
    () => (profile.niche ? buildProtocol(profile, history, assessment) : null),
    [profile, history, assessment],
  );

  const goTo = (id: number) => {
    setCurrent(id);
    setMaxReached((m) => Math.max(m, id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const patchProfile = (patch: Partial<ClientProfile>) =>
    setProfile((p) => ({ ...p, ...patch }));
  const patchHistory = (patch: Partial<ClinicalHistory>) =>
    setHistory((h) => ({ ...h, ...patch }));
  const patchAssessment = (patch: Partial<PhysicalAssessment>) =>
    setAssessment((a) => ({ ...a, ...patch }));

  const restart = () => {
    setProfile(emptyProfile);
    setHistory(emptyHistory);
    setAssessment(emptyAssessment);
    setMaxReached(1);
    goTo(1);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-cream-50 font-protocol text-wine-800">
      <Stepper steps={STEPS} current={current} maxReached={maxReached} onStepClick={goTo} />

      <div className="px-4 py-8 sm:px-6">
        {current === 1 && (
          <Step1Profile profile={profile} onChange={patchProfile} onNext={() => goTo(2)} />
        )}
        {current === 2 && (
          <Step2Anamnesis
            history={history}
            onChange={patchHistory}
            onBack={() => goTo(1)}
            onNext={() => goTo(3)}
          />
        )}
        {current === 3 && (
          <Step3Assessment
            assessment={assessment}
            niche={profile.niche}
            onChange={patchAssessment}
            onBack={() => goTo(2)}
            onNext={() => goTo(4)}
          />
        )}
        {current === 4 && protocol && (
          <Step4Plan
            profile={profile}
            history={history}
            assessment={assessment}
            protocol={protocol}
            onBack={() => goTo(3)}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
