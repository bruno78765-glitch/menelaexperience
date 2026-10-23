import { useState, type FormEvent } from 'react';
import { ApiError, login, register } from '@/lib/api.ts';
import type { PublicUser } from '@/lib/types.ts';

type AuthScreenProps = {
  onSuccess: (user: PublicUser) => void;
};

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (mode === 'register' && password !== confirm) {
      setError('A confirmação da senha não confere.');
      return;
    }
    setPending(true);
    try {
      const result =
        mode === 'login'
          ? await login({ email, password })
          : await register({ name, email, password });
      onSuccess(result.user);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Não foi possível entrar.');
    } finally {
      setPending(false);
    }
  }

  const title = mode === 'login' ? 'Entrar' : 'Criar conta';

  return (
    <section className="max-w-md mx-auto bg-white border border-essence-gold/30 rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-essence-dark">{title}</h2>
      <p className="text-sm text-gray-600 mt-2 mb-5">
        Cada pessoa entra com o próprio e-mail e senha. Os cenários salvos ficam visíveis só para quem os gravou.
      </p>
      <div className="grid grid-cols-2 gap-2 mb-5" role="tablist" aria-label="Forma de acesso">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => {
            setMode('login');
            setError(null);
          }}
          className={`rounded-lg py-2 text-sm font-semibold ${mode === 'login' ? 'bg-essence-dark text-essence-cream' : 'border border-gray-200 text-gray-600'}`}
        >
          Entrar
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          onClick={() => {
            setMode('register');
            setError(null);
          }}
          className={`rounded-lg py-2 text-sm font-semibold ${mode === 'register' ? 'bg-essence-dark text-essence-cream' : 'border border-gray-200 text-gray-600'}`}
        >
          Criar conta
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'register' ? (
          <div>
            <label htmlFor="nome" className="block text-xs font-semibold mb-1">
              Nome
            </label>
            <input
              id="nome"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={80}
              className="w-full border border-essence-gold/50 rounded-lg px-3 py-2.5 text-sm bg-essence-cream/50"
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold mb-1">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            data-testid="auth-email"
            className="w-full border border-essence-gold/50 rounded-lg px-3 py-2.5 text-sm bg-essence-cream/50"
          />
        </div>
        <div>
          <label htmlFor="senha" className="block text-xs font-semibold mb-1">
            Senha
          </label>
          <input
            id="senha"
            name="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={72}
            data-testid="auth-password"
            className="w-full border border-essence-gold/50 rounded-lg px-3 py-2.5 text-sm bg-essence-cream/50"
          />
          {mode === 'register' ? (
            <p className="text-[11px] text-gray-600 mt-1">De 8 a 72 caracteres. A senha é guardada só como hash.</p>
          ) : null}
        </div>
        {mode === 'register' ? (
          <div>
            <label htmlFor="confirmar" className="block text-xs font-semibold mb-1">
              Confirmar senha
            </label>
            <input
              id="confirmar"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
              minLength={8}
              maxLength={72}
              className="w-full border border-essence-gold/50 rounded-lg px-3 py-2.5 text-sm bg-essence-cream/50"
            />
          </div>
        ) : null}
        {error ? (
          <p role="alert" className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-essence-wine text-white font-semibold rounded-xl py-3 text-sm disabled:opacity-60"
        >
          {pending ? 'Aguarde…' : title}
        </button>
      </form>
    </section>
  );
}
