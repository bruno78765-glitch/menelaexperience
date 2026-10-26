export type PublicUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

export type ErroAuth = {
  message?: string;
  status?: number;
  code?: string | null;
};

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Olhe a caixa de entrada e o spam.',
  user_already_exists: 'Já existe uma conta com este e-mail. Entre ou redefina a senha.',
  email_exists: 'Já existe uma conta com este e-mail. Entre ou redefina a senha.',
  weak_password: 'A senha precisa ter de 8 a 72 caracteres.',
  email_address_invalid: 'Este e-mail não é válido.',
  email_address_not_authorized:
    'O Supabase ainda não envia e-mail para este endereço. No painel, configure um SMTP próprio em Authentication → Emails, ou autorize o endereço no projeto.',
  signup_disabled: 'O cadastro de novas contas está desativado neste projeto.',
  over_email_send_rate_limit: 'Muitos e-mails em pouco tempo. Aguarde alguns minutos e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.',
  validation_failed: 'Confira o e-mail e a senha.',
  session_expired: 'Sua sessão expirou. Entre de novo.',
  session_not_found: 'Sua sessão expirou. Entre de novo.',
  user_banned: 'Esta conta está bloqueada.',
  same_password: 'Escolha uma senha diferente da atual.',
};

const AUTH_PATTERNS: [RegExp, string][] = [
  [/invalid login credentials/i, AUTH_MESSAGES.invalid_credentials],
  [/email not confirmed/i, AUTH_MESSAGES.email_not_confirmed],
  [/already (been )?registered|already exists/i, AUTH_MESSAGES.user_already_exists],
  [/password should be at least|password is too weak|weak password|at least 6 characters/i, AUTH_MESSAGES.weak_password],
  [/same password/i, AUTH_MESSAGES.same_password],
  [/rate limit/i, AUTH_MESSAGES.over_request_rate_limit],
  [/not authorized/i, AUTH_MESSAGES.email_address_not_authorized],
  [/redirect|not allowed/i, 'Este endereço do site ainda não está na lista de Redirect URLs do Supabase. Abra Authentication → URL Configuration e inclua a URL desta página.'],
  [/unable to validate email|invalid email|is invalid/i, AUTH_MESSAGES.email_address_invalid],
  [/otp expired|expired|invalid flow state|flow state/i, 'Este link de redefinição expirou ou já foi usado. Peça um novo.'],
  [/fetch|network|failed to fetch|load failed/i, 'Sem conexão com o Supabase. Confira a internet e tente de novo.'],
];

export function traduzirErroAuth(error: ErroAuth | null | undefined, fallback: string): string {
  const code = error?.code ?? null;
  if (code && AUTH_MESSAGES[code]) return AUTH_MESSAGES[code];
  const message = error?.message ?? '';
  for (const [pattern, text] of AUTH_PATTERNS) {
    if (pattern.test(message)) return text;
  }
  return fallback;
}

export function traduzirErroLink(description: string | null): string {
  const text = description ?? '';
  if (/expired|otp/i.test(text)) return 'Este link de redefinição expirou. Peça um novo.';
  if (/redirect|not allowed/i.test(text)) {
    return 'O Supabase recusou o retorno deste link. Inclua a URL do site em Authentication → URL Configuration → Redirect URLs.';
  }
  return 'Não foi possível abrir o link de redefinição. Peça um novo.';
}

export function limparNome(value: string): string | null {
  const name = value.trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80) return null;
  return name;
}

export function limparEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function limparSenha(value: string): string | null {
  if (value.length < 8 || value.length > 72) return null;
  return value;
}

export function paraUsuarioPublico(user: AuthUserLike | null | undefined): PublicUser | null {
  if (!user?.id) return null;
  const email = user.email?.trim().toLowerCase() ?? '';
  const metadataName = user.user_metadata?.name;
  const name =
    typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : email.split('@')[0] || 'você';
  return { id: user.id, email, name };
}
