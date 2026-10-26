# Método Essência

Área da mentorada: diagnóstico, calendário de 30 dias, estúdio, treinador de vendas, calculadora de preço, ficha de avaliação e suporte. Cada pessoa entra com o próprio e-mail e a própria senha. O diagnóstico e os cenários de preço ficam na conta dela.

Esta pasta substitui os zips do Bolt. A calculadora está em `src/calculadora` e a ficha de avaliação e protocolos em `src/protocolo`. As duas aparecem no menu, com a mesma conta. A pasta `calculadora/` na raiz do repositório continua abrindo a calculadora sozinha. A ficha não grava atendimento no banco: ela monta o plano na hora, imprime o laudo e abre o resumo no WhatsApp do telefone preenchido. O site da Menela Experience continua na raiz.

## O que você precisa fazer no Supabase

Hub e calculadora usam o mesmo projeto, `rbgpdetmnnspgcesneva` (`https://rbgpdetmnnspgcesneva.supabase.co`). A conta é uma só: o e-mail e a senha criados aqui entram na calculadora, e o contrário também. As tabelas continuam separadas (`essencia_diagnosticos` e `cenarios`), cada uma com o próprio RLS.

Daqui não há chave de administrador, então o SQL do diagnóstico ainda precisa ser colado no painel. Enquanto a tabela não existir nesse projeto, o login abre e salvar o diagnóstico pede o arquivo.

1. Abra o SQL Editor do projeto `rbgpdetmnnspgcesneva` e rode os dois arquivos desta pasta: [`supabase/migrations/20261023200000_cenarios.sql`](supabase/migrations/20261023200000_cenarios.sql) e [`supabase/migrations/20261024210000_diagnosticos_por_usuario.sql`](supabase/migrations/20261024210000_diagnosticos_por_usuario.sql). Pode rodar de novo. Um cuida dos cenários de preço e o outro do diagnóstico.
2. Em **Authentication → URL Configuration**, a **Site URL** aceita um endereço só; use a URL pública do hub. Em **Redirect URLs**, inclua a URL pública do hub, a URL pública da calculadora e `http://localhost:5173`. Sem a origem na lista, o link de redefinição de senha e o de confirmação de e-mail não voltam para a tela certa.
3. Em **Authentication → Providers → Email**, **Confirm email** está ligado neste projeto. Quem cria a conta pode precisar clicar no link do e-mail antes de entrar. A tela já avisa isso.
4. Em **Authentication → Emails**, o envio gratuito do Supabase, em vários projetos, só entrega para endereços autorizados da equipe. Para a recuperação chegar na caixa de qualquer mentorada, configure um SMTP próprio. Se o projeto recusar o endereço, a tela mostra essa limitação.

O projeto antigo do hub (`snfcecgcbueagtmssqgh`) deixa de receber este app. Diagnósticos e contas que estão só lá continuam só lá. Quando os dois apps estiverem gravando em `rbgpdetmnnspgcesneva`, pause o projeto antigo em **Project Settings** para devolver a vaga do plano gratuito.

## Variáveis

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://rbgpdetmnnspgcesneva.supabase.co` (o mesmo valor da calculadora) |
| `VITE_SUPABASE_ANON_KEY` | Chave pública `anon` desse projeto |

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
