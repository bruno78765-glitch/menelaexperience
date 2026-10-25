import { useState, type FormEvent, type ReactNode } from 'react';
import { Crown } from 'lucide-react';

type Modo = 'entrar' | 'criar' | 'esqueci';

function Aviso({ tipo, children }: { tipo: 'erro' | 'ok'; children: ReactNode }) {
  const classe =
    tipo === 'erro'
      ? 'border-red-300/40 bg-red-950/40 text-red-100'
      : 'border-champagne-500/40 bg-champagne-500/10 text-creme-50';
  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-xl border px-3 py-2 text-sm ${classe}`}>
      {children}
    </p>
  );
}

function Marca() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-champagne-500/40 bg-champagne-500/10 text-champagne-500">
        <Crown className="h-6 w-6" />
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-creme-50">
          Método <span className="gold-text">Essência</span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-creme-200/55">Área da mentorada</p>
      </div>
    </div>
  );
}

export function AuthScreen({
  erroLink,
  onEntrar,
  onCadastrar,
  onPedirRedefinicao,
}: {
  erroLink: string | null;
  onEntrar: (email: string, senha: string) => Promise<string | null>;
  onCadastrar: (nome: string, email: string, senha: string) => Promise<{ erro: string | null; confirmarEmail: boolean }>;
  onPedirRedefinicao: (email: string) => Promise<string | null>;
}) {
  const [modo, setModo] = useState<Modo>('entrar');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(erroLink);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function trocar(proximo: Modo) {
    setModo(proximo);
    setErro(null);
    setAviso(null);
  }

  async function enviar(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setAviso(null);
    if (modo !== 'esqueci' && senha !== confirmacao && modo === 'criar') {
      setErro('A confirmação da senha não confere.');
      return;
    }
    setEnviando(true);
    try {
      if (modo === 'entrar') {
        setErro(await onEntrar(email, senha));
        return;
      }
      if (modo === 'esqueci') {
        const falha = await onPedirRedefinicao(email);
        if (falha) setErro(falha);
        else {
          setAviso(
            'Se existir uma conta com este e-mail, o link de redefinição foi enviado. Olhe também o spam. O link abre esta mesma página para você escolher a nova senha.',
          );
        }
        return;
      }
      const resultado = await onCadastrar(nome, email, senha);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      if (resultado.confirmarEmail) {
        setModo('entrar');
        setSenha('');
        setConfirmacao('');
        setAviso(`Conta criada. Confirme o e-mail ${email.trim()} e depois entre com a senha.`);
      }
    } finally {
      setEnviando(false);
    }
  }

  const titulo = modo === 'entrar' ? 'Entrar' : modo === 'criar' ? 'Criar conta' : 'Redefinir senha';

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <Marca />
      <section className="glass rounded-2xl p-6 shadow-card">
        <h1 className="font-display text-3xl text-creme-50">{titulo}</h1>
        <p className="mt-2 text-sm text-creme-200/70">
          Uma conta abre o diagnóstico, o calendário, o estúdio, as vendas e a calculadora de preço. O que você gravar fica só na sua conta.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2" role="tablist" aria-label="Forma de acesso">
          {(
            [
              ['entrar', 'Entrar'],
              ['criar', 'Criar conta'],
              ['esqueci', 'Esqueci a senha'],
            ] as const
          ).map(([id, rotulo]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={modo === id}
              onClick={() => trocar(id)}
              className={`rounded-lg px-2 py-2 text-xs font-semibold ${
                modo === id ? 'bg-champagne-500 text-essencia-900' : 'glass-soft text-creme-200/80'
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>
        <form onSubmit={enviar} className="mt-5 space-y-4">
          {modo === 'criar' && (
            <div>
              <label htmlFor="auth-nome" className="mb-1.5 block text-sm font-medium text-creme-50">
                Nome
              </label>
              <input
                id="auth-nome"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                className="input-lux"
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-creme-50">
              E-mail
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-lux"
            />
          </div>
          {modo !== 'esqueci' && (
            <div>
              <label htmlFor="auth-senha" className="mb-1.5 block text-sm font-medium text-creme-50">
                Senha
              </label>
              <input
                id="auth-senha"
                name="password"
                type="password"
                autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                maxLength={72}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="input-lux"
              />
              {modo === 'criar' && (
                <p className="mt-1.5 text-xs text-creme-200/55">De 8 a 72 caracteres. A senha fica só como hash no Supabase.</p>
              )}
            </div>
          )}
          {modo === 'criar' && (
            <div>
              <label htmlFor="auth-confirmacao" className="mb-1.5 block text-sm font-medium text-creme-50">
                Confirmar senha
              </label>
              <input
                id="auth-confirmacao"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={confirmacao}
                onChange={(event) => setConfirmacao(event.target.value)}
                className="input-lux"
              />
            </div>
          )}
          {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <button type="submit" className="btn-gold w-full" disabled={enviando}>
            {enviando ? 'Aguarde…' : titulo}
          </button>
        </form>
      </section>
    </main>
  );
}

export function RedefinirSenha({
  onDefinir,
  onSair,
}: {
  onDefinir: (senha: string) => Promise<string | null>;
  onSair: () => Promise<void>;
}) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(event: FormEvent) {
    event.preventDefault();
    if (senha !== confirmacao) {
      setErro('A confirmação da senha não confere.');
      return;
    }
    setEnviando(true);
    setErro(await onDefinir(senha));
    setEnviando(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <Marca />
      <section className="glass rounded-2xl p-6 shadow-card">
        <h1 className="font-display text-3xl text-creme-50">Nova senha</h1>
        <p className="mt-2 text-sm text-creme-200/70">
          O link de recuperação abriu a sua conta. Escolha a nova senha para continuar.
        </p>
        <form onSubmit={enviar} className="mt-5 space-y-4">
          <div>
            <label htmlFor="nova-senha" className="mb-1.5 block text-sm font-medium text-creme-50">
              Nova senha
            </label>
            <input
              id="nova-senha"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="input-lux"
            />
          </div>
          <div>
            <label htmlFor="nova-confirmacao" className="mb-1.5 block text-sm font-medium text-creme-50">
              Confirmar nova senha
            </label>
            <input
              id="nova-confirmacao"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={confirmacao}
              onChange={(event) => setConfirmacao(event.target.value)}
              className="input-lux"
            />
          </div>
          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          <button type="submit" className="btn-gold w-full" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Salvar nova senha'}
          </button>
          <button type="button" onClick={() => void onSair()} className="btn-ghost w-full">
            Cancelar e sair
          </button>
        </form>
      </section>
    </main>
  );
}
