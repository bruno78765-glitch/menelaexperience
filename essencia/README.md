# Método Essência

Hub da mentorada: diagnóstico, calendário de 30 dias, estúdio, treinador de vendas e suporte. Cada pessoa entra com o próprio e-mail e a própria senha. O diagnóstico fica numa linha da conta dela.

O site da Menela Experience continua na raiz do repositório. A calculadora de precificação continua em `calculadora/`. Esta pasta é o hub.

## O que você precisa fazer no Supabase

O código desta pasta fala com o projeto `snfcecgcbueagtmssqgh`. Daqui não há chave de administrador, então a migração não foi aplicada no banco. Enquanto isso, o login funciona, mas salvar o diagnóstico responde pedindo o SQL.

1. Abra o SQL Editor desse projeto e rode [`supabase/migrations/20261024210000_diagnosticos_por_usuario.sql`](supabase/migrations/20261024210000_diagnosticos_por_usuario.sql). Pode rodar de novo. O arquivo apaga diagnósticos antigos sem dono, deixa uma linha por conta e fecha a tabela para quem não está logado.
2. Em **Authentication → URL Configuration**, coloque a URL pública do hub em **Site URL** e a mesma URL em **Redirect URLs**. Inclua também `http://localhost:5173` para o ambiente local. Sem isso, o link de redefinição de senha não volta para esta tela.
3. Em **Authentication → Emails**, confirme que o envio está ativo. O e-mail gratuito do Supabase, em vários projetos, só entrega para endereços autorizados da equipe. Para a recuperação chegar na caixa de qualquer mentorada, configure um SMTP próprio. Se o projeto recusar o endereço, a tela mostra essa limitação em vez de fingir que o e-mail saiu.

O cadastro deste projeto está com confirmação automática de e-mail: a pessoa entra logo depois de criar a conta. A redefinição de senha continua dependendo do e-mail.

## Variáveis

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto |
| `VITE_SUPABASE_ANON_KEY` | Chave pública `anon` |

As duas estão em [`.env.example`](.env.example). A chave `anon` vai para o navegador. A proteção é o RLS, não o sigilo dessa chave. Não coloque a `service_role` aqui.

```bash
cd essencia
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`.

Na Netlify, use **Base directory** `essencia`. O `netlify.toml` desta pasta publica `dist` e devolve `index.html` em qualquer rota, para o link de senha abrir o app.

## Conta

- Criar conta, entrar e sair.
- Esqueci a senha envia o link do Supabase. O link abre esta mesma origem e pede a nova senha. O fluxo é o implícito de propósito: o link funciona no navegador que abrir o e-mail, não só naquele que pediu a redefinição.
- A sessão fica no navegador. Cada diagnóstico é gravado com `user_id = auth.uid()`.

## Checagens

```bash
npm test
npm run typecheck
npm run lint
npm run build
```
