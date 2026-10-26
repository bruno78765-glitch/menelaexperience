import { useState } from 'react';
import { clampNumber, readNumberInput } from '../lib/pricing.ts';

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | null;
  min: number;
  max: number;
  help: string;
  error?: string | null;
  onChange: (value: number | null) => void;
};

export function NumberField({ id, label, value, min, max, help, error, onChange }: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const helpId = `${id}-ajuda`;
  const errorId = `${id}-erro`;
  const shown = draft !== null ? draft : value === null ? '' : String(value);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-creme-50">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={shown}
        aria-describedby={error ? `${helpId} ${errorId}` : helpId}
        aria-invalid={error ? true : undefined}
        onFocus={() => setDraft(value === null ? '' : String(value))}
        onBlur={() => setDraft(null)}
        onWheel={(event) => event.currentTarget.blur()}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const parsed = readNumberInput(raw);
          if (parsed === 'partial') return;
          onChange(parsed === null ? null : clampNumber(parsed, min, max));
        }}
        className="input-lux"
      />
      <p id={helpId} className="mt-1.5 text-xs leading-snug text-creme-200/55">
        {help}
      </p>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  help: string;
  onChange: (value: string) => void;
};

export function TextField({ id, label, value, maxLength, help, onChange }: TextFieldProps) {
  const helpId = `${id}-ajuda`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-creme-50">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        aria-describedby={helpId}
        onChange={(event) => onChange(event.target.value)}
        className="input-lux"
      />
      <p id={helpId} className="mt-1.5 text-xs leading-snug text-creme-200/55">
        {help}
      </p>
    </div>
  );
}
