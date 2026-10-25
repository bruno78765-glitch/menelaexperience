import { useEffect, useState } from 'react';
import { Menu, X, Crown, ChevronRight, LogOut } from 'lucide-react';
import { MODULOS, moduloValido, type ModuleId } from '@/data/modulos';
import { useDiagnostico } from '@/hooks/useDiagnostico';
import { useAuth } from '@/hooks/useAuth';
import { SUPABASE_CONFIG_ERROR } from '@/lib/supabase';
import { Dashboard } from '@/modules/Dashboard';
import { Calendario } from '@/modules/Calendario';
import { Estudio } from '@/modules/Estudio';
import { Vendas } from '@/modules/Vendas';
import { Suporte } from '@/modules/Suporte';
import { Precificacao } from '@/modules/Precificacao';
import { AuthScreen, RedefinirSenha } from '@/modules/Auth';

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-champagne-500/40 bg-champagne-500/10 text-champagne-500">
        <Crown className="h-6 w-6" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold text-creme-50">
          Método <span className="gold-text">Essência</span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-creme-200/55">Área da mentorada</p>
      </div>
    </div>
  );
}

function TelaSimples({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
      <Brand />
      <section className="glass mt-6 rounded-2xl p-6">
        <h1 className="font-display text-3xl text-creme-50">{titulo}</h1>
        <p className="mt-3 text-sm leading-relaxed text-creme-200/75">{texto}</p>
      </section>
    </main>
  );
}

export default function App() {
  const auth = useAuth();
  const contaAtiva = auth.usuario && !auth.recuperando ? auth.usuario : null;
  const diagnostico = useDiagnostico(contaAtiva?.id ?? null, contaAtiva?.name ?? '');
  const [modulo, setModulo] = useState<ModuleId>('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  const nicho = diagnostico.rascunho.nicho.trim();

  useEffect(() => {
    if (!menuAberto) return;
    function fechar(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuAberto(false);
    }
    const desktop = window.matchMedia('(min-width: 1024px)');
    function aoRedimensionar() {
      if (desktop.matches) setMenuAberto(false);
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fechar);
    desktop.addEventListener('change', aoRedimensionar);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', fechar);
      desktop.removeEventListener('change', aoRedimensionar);
    };
  }, [menuAberto]);

  function navegar(id: string) {
    if (!moduloValido(id)) return;
    setModulo(id);
    setMenuAberto(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (SUPABASE_CONFIG_ERROR) {
    return <TelaSimples titulo="Supabase não configurado" texto={SUPABASE_CONFIG_ERROR} />;
  }
  if (auth.carregando) {
    return <TelaSimples titulo="Abrindo o Método Essência" texto="Conferindo a sua sessão." />;
  }
  if (auth.recuperando) {
    return <RedefinirSenha onDefinir={auth.definirSenha} onSair={auth.sair} />;
  }
  if (!auth.usuario) {
    return (
      <AuthScreen
        erroLink={auth.erroLink}
        onEntrar={auth.entrar}
        onCadastrar={auth.cadastrar}
        onPedirRedefinicao={auth.pedirRedefinicao}
      />
    );
  }

  const moduloAtual = MODULOS.find((item) => item.id === modulo) ?? MODULOS[0];

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-essencia-500/30 bg-essencia-900/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-essencia-500/50 text-creme-50"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`no-print fixed inset-y-0 left-0 z-50 w-72 transform border-r border-essencia-500/30 bg-essencia-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
            menuAberto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="hidden p-5 lg:block">
              <Brand />
            </div>
            <div className="gold-line mx-5 h-px" />
            <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-lux" aria-label="Módulos">
              {MODULOS.map((item) => {
                const Icone = item.icone;
                const ativo = modulo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navegar(item.id)}
                    className={`nav-item w-full ${ativo ? 'nav-item-active' : ''}`}
                    aria-current={ativo ? 'page' : undefined}
                  >
                    <Icone className={`h-5 w-5 shrink-0 ${ativo ? 'text-champagne-500' : 'text-creme-200/70'}`} />
                    <span className="flex-1 text-left">
                      <span className="block leading-tight">{item.label}</span>
                      <span className="block text-[11px] text-creme-200/45">{item.sublabel}</span>
                    </span>
                    {ativo && <ChevronRight className="h-4 w-4 text-champagne-500" />}
                  </button>
                );
              })}
            </nav>
            <div className="space-y-3 p-4">
              {nicho && (
                <p className="px-1 text-center text-[11px] text-creme-200/45">
                  Nicho ativo: <span className="text-champagne-500">{nicho}</span>
                </p>
              )}
              <div className="flex items-center justify-between gap-3 px-1">
                <p className="truncate text-[11px] text-creme-200/55">{auth.usuario.email}</p>
                <button type="button" onClick={() => void auth.sair()} className="btn-ghost px-3 py-2 text-xs">
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </aside>

        {menuAberto && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
          />
        )}

        <main className="min-h-screen flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="no-print mb-6 hidden items-center gap-2 text-xs text-creme-200/50 sm:flex">
              <span>Método Essência</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-champagne-500">{moduloAtual.label}</span>
            </div>
            {modulo === 'dashboard' && <Dashboard diagnostico={diagnostico} onIrPara={navegar} />}
            {modulo === 'calendario' && <Calendario nicho={nicho} onConfigurar={() => navegar('dashboard')} />}
            {modulo === 'estudio' && <Estudio nicho={nicho} />}
            {modulo === 'vendas' && <Vendas nicho={nicho} />}
            {modulo === 'precificacao' && <Precificacao onSair={() => void auth.sair()} />}
            {modulo === 'suporte' && <Suporte onNavegar={navegar} />}
            <footer className="no-print mt-12 border-t border-essencia-500/20 pt-6 text-center text-xs text-creme-200/40">
              Método Essência · Área da mentorada
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
