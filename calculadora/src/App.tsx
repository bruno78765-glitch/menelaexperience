import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { ApiError, getMe, logout } from '@/lib/api.ts';
import type { PublicUser } from '@/lib/types.ts';
import { AuthScreen } from '@/components/AuthScreen.tsx';
import { Calculator } from '@/components/Calculator.tsx';

export default function App() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getMe(controller.signal)
      .then((data) => {
        setUser(data.user);
        setBootError(null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setUser(null);
        setBootError(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível falar com o servidor. Na pasta calculadora, rode npm run dev.',
        );
        setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const onUnauthorized = useCallback(() => {
    setUser(null);
    setBootError('Sua sessão expirou. Entre de novo.');
  }, []);

  async function onLogout() {
    try {
      await logout();
    } catch {
      // A tela volta ao login mesmo se a rede falhar; o cookie expira no servidor quando a chamada chega.
    }
    setUser(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-white focus:px-3 focus:py-2 focus:rounded-lg"
      >
        Ir para o conteúdo
      </a>
      <header className="bg-essence-dark text-essence-cream border-b border-essence-gold/30 py-6 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-essence-gold font-semibold">Método Essence · Edna Mari</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calculadora de Precificação e Viabilidade</h1>
          </div>
          <div className="flex items-center justify-between gap-4 md:text-right">
            <div>
              <p className="text-sm text-essence-gold">Gestão com clareza e lucratividade</p>
              <p className="text-xs text-essence-cream/70">Versão profissional para mentoria</p>
            </div>
            {user ? (
              <button
                type="button"
                onClick={() => void onLogout()}
                className="no-print inline-flex items-center gap-2 text-sm font-semibold border border-essence-gold/40 rounded-xl px-3 py-2 hover:bg-white/5"
              >
                <LogOut size={16} aria-hidden="true" />
                Sair
                <span className="sr-only">da conta de {user.name}</span>
              </button>
            ) : null}
          </div>
        </div>
        {user ? (
          <p className="no-print max-w-6xl mx-auto mt-3 text-sm text-essence-cream/80">
            Olá, {user.name}. Você está em {user.email}.
          </p>
        ) : null}
      </header>

      <main id="conteudo" className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {loading ? <p className="text-sm text-essence-dark">Carregando sua sessão…</p> : null}
        {!loading && bootError && !user ? (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <p>{bootError}</p>
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
              className="mt-3 font-semibold underline"
            >
              Tentar de novo
            </button>
          </div>
        ) : null}
        {!loading && !user ? <AuthScreen onSuccess={setUser} /> : null}
        {user ? <Calculator onUnauthorized={onUnauthorized} /> : null}
      </main>

      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200 mt-auto px-4">
        Método Essence · Edna Mari · Ferramenta de precificação para mentoria. A senha não é armazenada em texto puro.
      </footer>
    </div>
  );
}
