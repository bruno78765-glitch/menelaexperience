import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Check, X } from 'lucide-react';
import type { YesNo } from '../lib/protocol';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-gold-400/40 bg-white p-6 shadow-luxe shadow-stone-200/50 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <h2 className="font-protocol-display text-2xl font-extrabold leading-tight text-wine-700 sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-base text-wine-700/70">{subtitle}</p>}
    </div>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Field({ label, hint, className = '', ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-wine-700">{label}</span>
      <input
        {...props}
        className={`w-full rounded-2xl border border-gold-400/50 bg-cream-50/40 px-4 py-3.5 text-base font-medium text-wine-800 outline-none transition-all duration-300 placeholder:text-stone-400 focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/20 ${className}`}
      />
      {hint && <span className="mt-1.5 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-wine-700">{label}</span>
      <textarea
        {...props}
        className={`w-full resize-y rounded-2xl border border-gold-400/50 bg-cream-50/40 px-4 py-3.5 text-base font-medium text-wine-800 outline-none transition-all duration-300 placeholder:text-stone-400 focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/20 ${className}`}
      />
    </label>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'gold';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary:
      'gradient-wine text-cream-50 shadow-luxe hover:-translate-y-0.5 hover:shadow-xl hover:shadow-wine-700/30 ring-1 ring-gold-400/30',
    gold: 'bg-gold-400 text-wine-700 hover:-translate-y-0.5 hover:bg-gold-300 hover:shadow-luxe-sm',
    ghost:
      'border border-wine-700/20 bg-white text-wine-700 hover:border-wine-700/40 hover:bg-cream-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function YesNoToggle({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  const opts: { v: YesNo; label: string; icon: typeof Check }[] = [
    { v: 'sim', label: 'Sim', icon: Check },
    { v: 'nao', label: 'Não', icon: X },
  ];
  return (
    <div className="inline-flex gap-2">
      {opts.map((o) => {
        const Icon = o.icon;
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
              active
                ? o.v === 'sim'
                  ? 'bg-wine-400 text-cream-50 shadow-luxe-sm'
                  : 'bg-stone-200 text-wine-700'
                : 'border border-stone-200 bg-white text-wine-700/60 hover:border-gold-400/60'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.4} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-stone-100 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base font-semibold text-wine-700">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
