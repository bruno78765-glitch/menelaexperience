import { type ReactNode } from 'react';

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl p-5 shadow-card transition-all duration-300 ease-in-out ${
        hover ? 'hover:-translate-y-1 hover:shadow-card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  titulo,
  descricao,
  acao,
}: {
  eyebrow?: string;
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-title text-balance">{titulo}</h2>
        {descricao && (
          <p className="mt-3 text-sm leading-relaxed text-creme-200/70">
            {descricao}
          </p>
        )}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  );
}

export function PilarTag({
  nome,
  cor,
  corTexto,
  icone,
}: {
  nome: string;
  cor: string;
  corTexto: string;
  icone?: ReactNode;
}) {
  return (
    <span
      className="chip"
      style={{
        borderColor: `${cor}55`,
        color: corTexto,
        background: `${cor}1a`,
      }}
    >
      {icone}
      {nome}
    </span>
  );
}

export function EmptyState({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}) {
  return (
    <div className="glass-soft flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
      <p className="font-display text-xl text-creme-50">{titulo}</p>
      <p className="mt-2 max-w-md text-sm text-creme-200/70">{descricao}</p>
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
