import { useCallback, useEffect, useState } from 'react';
import {
  limparEmail,
  limparNome,
  limparSenha,
  paraUsuarioPublico,
  traduzirErroAuth,
  traduzirErroLink,
  type PublicUser,
} from '@/lib/auth';
import { SUPABASE_CONFIG_ERROR, supabase } from '@/lib/supabase';

const CHAVE_RECUPERACAO = 'essencia:recuperando-senha';

function enderecoDeRetorno(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function lerHashInicial(): { recuperando: boolean; erro: string | null } {
  if (typeof window === 'undefined') return { recuperando: false, erro: null };
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const query = new URLSearchParams(window.location.search);
  const erroBruto = hash.get('error_description') || query.get('error_description');
  const temErro = Boolean(hash.get('error') || query.get('error'));
  const recuperando = hash.get('type') === 'recovery' || query.get('type') === 'recovery';
  return {
    recuperando,
    erro: temErro ? traduzirErroLink(erroBruto) : null,
  };
}

const LINK_INICIAL = lerHashInicial();

export function useAuth() {
  const [usuario, setUsuario] = useState<PublicUser | null>(null);
  const [carregando, setCarregando] = useState(SUPABASE_CONFIG_ERROR == null);
  const [recuperando, setRecuperando] = useState(LINK_INICIAL.recuperando);
  const [erroLink, setErroLink] = useState<string | null>(LINK_INICIAL.erro);

  const marcarRecuperacao = useCallback((ativo: boolean) => {
    setRecuperando(ativo);
    try {
      if (ativo) sessionStorage.setItem(CHAVE_RECUPERACAO, '1');
      else sessionStorage.removeItem(CHAVE_RECUPERACAO);
    } catch {
      // O modo de recuperação continua valendo nesta montagem da tela.
    }
  }, []);

  useEffect(() => {
    if (SUPABASE_CONFIG_ERROR) return;
    let ativo = true;
    try {
      if (sessionStorage.getItem(CHAVE_RECUPERACAO) === '1') setRecuperando(true);
    } catch {
      // Sem sessionStorage, o hash type=recovery ainda cobre o primeiro acesso.
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!ativo) return;
      if (error) setErroLink(traduzirErroAuth(error, 'Não foi possível recuperar sua sessão.'));
      setUsuario(paraUsuarioPublico(data.session?.user));
      setCarregando(false);
      window.history.replaceState({}, '', window.location.pathname);
    });

    const { data } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (!ativo) return;
      if (evento === 'PASSWORD_RECOVERY') marcarRecuperacao(true);
      setUsuario(paraUsuarioPublico(sessao?.user));
      setCarregando(false);
      window.history.replaceState({}, '', window.location.pathname);
    });

    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, [marcarRecuperacao]);

  async function entrar(email: string, senha: string): Promise<string | null> {
    const emailLimpo = limparEmail(email);
    if (!emailLimpo || !senha) return 'Informe e-mail e senha.';
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailLimpo, password: senha });
    if (error) return traduzirErroAuth(error, 'Não foi possível entrar.');
    setUsuario(paraUsuarioPublico(data.user));
    return null;
  }

  async function cadastrar(nome: string, email: string, senha: string): Promise<{ erro: string | null; confirmarEmail: boolean }> {
    const nomeLimpo = limparNome(nome);
    const emailLimpo = limparEmail(email);
    const senhaLimpa = limparSenha(senha);
    if (!nomeLimpo || !emailLimpo || !senhaLimpa) {
      return { erro: 'Use um nome, um e-mail válido e uma senha de 8 a 72 caracteres.', confirmarEmail: false };
    }
    const { data, error } = await supabase.auth.signUp({
      email: emailLimpo,
      password: senhaLimpa,
      options: { data: { name: nomeLimpo }, emailRedirectTo: enderecoDeRetorno() },
    });
    if (error) return { erro: traduzirErroAuth(error, 'Não foi possível criar a conta.'), confirmarEmail: false };
    if (!data.user) return { erro: 'Não foi possível criar a conta.', confirmarEmail: false };
    if (!data.session && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return { erro: 'Já existe uma conta com este e-mail. Entre ou redefina a senha.', confirmarEmail: false };
    }
    setUsuario(paraUsuarioPublico(data.user));
    return { erro: null, confirmarEmail: !data.session };
  }

  async function pedirRedefinicao(email: string): Promise<string | null> {
    const emailLimpo = limparEmail(email);
    if (!emailLimpo) return 'Informe o e-mail da conta.';
    const { error } = await supabase.auth.resetPasswordForEmail(emailLimpo, { redirectTo: enderecoDeRetorno() });
    if (error) return traduzirErroAuth(error, 'Não foi possível enviar o link de redefinição.');
    return null;
  }

  async function definirSenha(senha: string): Promise<string | null> {
    const senhaLimpa = limparSenha(senha);
    if (!senhaLimpa) return 'A nova senha precisa ter de 8 a 72 caracteres.';
    const { data, error } = await supabase.auth.updateUser({ password: senhaLimpa });
    if (error) return traduzirErroAuth(error, 'Não foi possível trocar a senha.');
    setUsuario(paraUsuarioPublico(data.user));
    marcarRecuperacao(false);
    return null;
  }

  async function sair(): Promise<void> {
    marcarRecuperacao(false);
    const { error } = await supabase.auth.signOut();
    setUsuario(null);
    if (error) setErroLink(traduzirErroAuth(error, 'Não foi possível sair.'));
  }

  return {
    usuario,
    carregando,
    recuperando,
    erroLink,
    entrar,
    cadastrar,
    pedirRedefinicao,
    definirSenha,
    sair,
  };
}
