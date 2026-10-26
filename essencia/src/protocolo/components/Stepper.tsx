import { Check } from 'lucide-react';

export interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  onStepClick: (id: number) => void;
  maxReached: number;
}

export function Stepper({ steps, current, onStepClick, maxReached }: StepperProps) {
  return (
    <nav className="no-print mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {steps.map((step, idx) => {
          const isDone = step.id < current;
          const isActive = step.id === current;
          const isReachable = step.id <= maxReached;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-3">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && onStepClick(step.id)}
                className={`group flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ease-in-out ${
                  isActive
                    ? 'border-gold-400 bg-white shadow-luxe-sm'
                    : isDone
                      ? 'border-gold-400/40 bg-white/70'
                      : 'border-stone-200 bg-white/50'
                } ${isReachable ? 'cursor-pointer hover:border-gold-400 hover:shadow-luxe-sm' : 'cursor-not-allowed opacity-60'}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-300 ${
                    isActive
                      ? 'gradient-wine text-cream-50'
                      : isDone
                        ? 'bg-gold-400 text-wine-700'
                        : 'bg-stone-100 text-wine-700/50'
                  }`}
                >
                  {isDone ? <Check className="h-5 w-5" strokeWidth={2.6} /> : step.id}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[11px] font-semibold uppercase tracking-wide ${
                      isActive ? 'text-gold-600' : 'text-stone-400'
                    }`}
                  >
                    Etapa {step.id}
                  </span>
                  <span
                    className={`block truncate text-sm font-bold sm:text-base ${
                      isActive ? 'text-wine-700' : 'text-wine-700/70'
                    }`}
                  >
                    {step.label}
                  </span>
                </span>
              </button>
              {idx < steps.length - 1 && (
                <span
                  className={`hidden h-px w-6 shrink-0 sm:block ${
                    isDone ? 'bg-gold-400' : 'bg-stone-200'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
