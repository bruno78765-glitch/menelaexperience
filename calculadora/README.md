# Calculadora de Precificação — Método Essence

Ferramenta de mentoria (Edna Mari) para formar o preço de um atendimento. O pró-labore entra no custo; a margem de lucro é aplicada por cima. Cada pessoa cria a própria conta e só vê os próprios cenários.

A partir desta versão o site é **100% estático**: login e cenários ficam no **Supabase** (Auth + Postgres com Row Level Security). Não existe mais API Node nem SQLite, então o `dist` pode ser publicado direto no Bolt, na Netlify ou em qualquer hospedagem de arquivos estáticos.

O site da Menela Experience continua na raiz deste repositório. Esta pasta é a calculadora. O hub em [`essencia/`](../essencia/README.md) usa este mesmo projeto Supabase e também abre esta calculadora no menu, na mesma conta. O diagnóstico fica na tabela `essencia_diagnosticos`.

## Passo a passo para colocar no ar

1. **Criar as tabelas no projeto `rbgpdetmnnspgcesneva` (uma vez).** No painel, abra **SQL Editor → New query**. Cole [`supabase/migrations/20261023200000_cenarios.sql`](supabase/migrations/20261023200000_cenarios.sql) (também está no fim deste README) e clique em **Run**. No mesmo editor, cole [`../essencia/supabase/migrations/20261024210000_diagnosticos_por_usuario.sql`](../essencia/supabase/migrations/20261024210000_diagnosticos_por_usuario.sql). Os dois arquivos podem rodar de novo e cada um cuida só da própria tabela.
2. **Decidir sobre a confirmação de e-mail.** Neste projeto, **Confirm email** está ligado: a pessoa clica num link antes do primeiro login. A calculadora e o hub já tratam isso. Se preferir entrar na hora, desligue em **Authentication → Providers → Email → Confirm email**. A mudança vale para os dois apps, porque o login é o mesmo.
3. **Ajustar as URLs do Auth.** Em **Authentication → URL Configuration**, a **Site URL** aceita um endereço. Em **Redirect URLs**, inclua a URL pública da calculadora, a URL pública do hub e `http://localhost:5173`. Sem a origem na lista, o link de confirmação não volta para o app certo.
4. **Publicar** com as duas variáveis de ambiente abaixo (seção “Publicar no Bolt ou na Netlify”).

## Variáveis de ambiente

| Variável | Valor | Uso |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `https://rbgpdetmnnspgcesneva.supabase.co` | Endereço do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | chave `anon` do projeto (está em `.env.example`) | Chave pública usada pelo navegador |

Os dois valores estão preenchidos em [`.env.example`](.env.example). A chave `anon` é pública por definição: ela vai para o navegador de qualquer pessoa que abrir o site. A proteção dos dados vem do **RLS** no banco, não do sigilo dessa chave. **Nunca** use aqui a chave `service_role` nem a senha do banco.

Para rodar localmente, copie o exemplo:

```bash
cp .env.example .env
```

O `.env` está no `.gitignore`. Se as variáveis faltarem no build, a tela mostra “Supabase não configurado” em vez de quebrar.

Para encontrar os valores no painel: **Project Settings → API** (campos *Project URL* e *anon public*).

## Publicar no Bolt ou na Netlify

### Netlify

1. **Add new site → Import an existing project** e escolha este repositório.
2. **Base directory:** `calculadora` · **Build command:** `npm run build` · **Publish directory:** `calculadora/dist` (o `netlify.toml` desta pasta já traz isso e o redirecionamento para `index.html`).
3. **Site configuration → Environment variables → Add a variable:** crie `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores acima. Marque para todos os contextos (Production e Deploy Previews).
4. **Deploy site.** Depois, volte ao Supabase e coloque a URL do site em **Authentication → URL Configuration** (passo 3 acima).

Mudou uma variável? Rode um novo deploy (**Deploys → Trigger deploy → Clear cache and deploy site**): o Vite embute os valores no build.

### Bolt

1. Abra o projeto no Bolt (a pasta `calculadora` é a raiz do app).
2. Em **Settings → Environment variables** (ícone de engrenagem) cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Se o Bolt oferecer a integração nativa com Supabase, ela cria essas mesmas variáveis; confira os nomes.
3. Use **Deploy** (o Bolt publica na Netlify por baixo). O comando é `npm run build` e a pasta publicada é `dist`.
4. Cadastre a URL gerada no Supabase (passo 3 do passo a passo).

### Qualquer outra hospedagem estática

```bash
npm install
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run build
```

Publique a pasta `dist`. É só HTML, CSS e JS.

## Desenvolvimento

Requisitos: Node.js 22.5 ou mais recente e npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173`. O front fala direto com o Supabase; não há servidor local.

Os valores de exemplo (material R$ 20, fixo R$ 25, taxas 8%, margem 20%, remuneração R$ 4.000, 100 horas, 1 hora) produzem preço sugerido de **R$ 118,06**.

## Testes e checagens

```bash
npm test            # cálculo, CSV e camada de dados (com cliente Supabase simulado)
npm run typecheck
npm run lint
npm run build
```

O teste da camada de dados (`src/lib/api.test.ts`) usa um cliente Supabase falso em memória para cobrir cadastro, “verifique seu e-mail”, tradução de erros, conversão de centavos e as regras que impedem salvar cenário inviável. Ele **não** prova o RLS; a prova do RLS é o SQL abaixo rodando no Postgres (as políticas foram verificadas num Postgres local com dois usuários: um não lê, não altera e não apaga o cenário do outro, e o papel `anon` não acessa a tabela).

## Autenticação e dados

- Cadastro e entrada com e-mail e senha pelo **Supabase Auth**. O nome vai em `user_metadata.name`. A senha é guardada pelo Supabase como hash; o front nunca a vê depois do envio.
- A sessão fica no `localStorage` do navegador e é renovada pelo próprio cliente Supabase. “Sair” encerra a sessão.
- Com **Confirm email** ligado, `signUp` devolve a conta sem sessão. A tela mostra “Conta criada. Verifique seu e-mail…” e volta para **Entrar**. Tentar entrar antes de confirmar dá “Confirme seu e-mail antes de entrar”.
- Cada cenário é gravado em `public.cenarios` com `user_id = auth.uid()`. As políticas de RLS só deixam a pessoa ver, inserir, alterar e excluir as próprias linhas. Quem não está logado não tem permissão nenhuma na tabela.
- O banco repete as regras do front por `CHECK`: nome de 1 a 120 caracteres, todos os campos do cálculo presentes, horas produtivas maiores que zero e valores não negativos. Um gatilho limita a 200 cenários por pessoa.
- Limites do Supabase Auth que podem aparecer na tela: muitos e-mails em pouco tempo (`over_email_send_rate_limit`) e domínios reservados como `example.com` (`email_address_invalid`). As mensagens saem em português.

## Fórmula

1. Hora técnica = remuneração mensal / horas produtivas. Horas vazias ou zero interrompem o cálculo — o sistema não troca isso por 1.
2. Pró-labore do atendimento = hora técnica × tempo do procedimento.
3. Custo = produtos + rateio de despesas fixas + pró-labore.
4. Preço sugerido = custo / (1 − taxas − margem), com taxas e margem em fração.
5. Se taxas + margem forem 100% ou mais, a tela mostra erro. O custo bruto não aparece como preço sugerido.
6. Preço com desconto = preço sugerido × (1 − desconto). Se ficar abaixo do custo, ou se a margem efetiva depois das taxas ficar negativa, o alerta deixa claro que o preço não é saudável.

A conta é feita em centavos para o relatório fechar.

## O que a interface faz

- Explica, em português, que o pró-labore está dentro do custo e a margem vem depois.
- Mostra a composição (materiais, fixos, pró-labore, taxas, lucro).
- Salva cenários com o nome do procedimento, compara dois preços e exporta CSV.
- Imprimir / salvar PDF esconde o formulário e deixa o relatório.

## SQL da tabela `cenarios` (cole no SQL Editor)

Mesmo conteúdo de [`supabase/migrations/20261023200000_cenarios.sql`](supabase/migrations/20261023200000_cenarios.sql).

```sql
-- Calculadora de Precificação — Método Essence
-- Tabela de cenários salvos, um dono por linha, com RLS.
-- Rode este arquivo inteiro no SQL Editor do Supabase (Dashboard → SQL Editor → New query → Run).
-- Pode ser executado mais de uma vez: tudo usa "if not exists" ou "drop ... if exists".

create extension if not exists pgcrypto;

create table if not exists public.cenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome_procedimento text not null,
  inputs jsonb not null,
  preco_sugerido_cents bigint not null,
  custo_total_cents bigint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cenarios_nome_procedimento_tamanho
    check (char_length(btrim(nome_procedimento)) between 1 and 120),
  constraint cenarios_inputs_objeto
    check (jsonb_typeof(inputs) = 'object'),
  constraint cenarios_inputs_campos
    check (
      inputs ?& array[
        'custoMaterial',
        'custoFixo',
        'taxasVariaveis',
        'margemLucro',
        'remuneracaoDesejada',
        'horasProdutivas',
        'tempoProcedimento',
        'percentualDesconto'
      ]
    ),
  constraint cenarios_horas_produtivas_positivas
    check (jsonb_typeof(inputs -> 'horasProdutivas') = 'number' and (inputs ->> 'horasProdutivas')::numeric > 0),
  constraint cenarios_valores_nao_negativos
    check (preco_sugerido_cents >= 0 and custo_total_cents >= 0)
);

comment on table public.cenarios is 'Cenários de precificação salvos pela calculadora. Cada linha pertence a um usuário do Supabase Auth.';
comment on column public.cenarios.inputs is 'Entradas do cálculo (reais e percentuais) no formato CompletePricingInput do front.';
comment on column public.cenarios.preco_sugerido_cents is 'Preço sugerido em centavos, calculado no momento do salvamento.';
comment on column public.cenarios.custo_total_cents is 'Custo total do atendimento em centavos, calculado no momento do salvamento.';

create index if not exists cenarios_user_id_created_at_idx
  on public.cenarios (user_id, created_at desc);

-- updated_at automático
create or replace function public.cenarios_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cenarios_set_updated_at on public.cenarios;
create trigger cenarios_set_updated_at
  before update on public.cenarios
  for each row execute function public.cenarios_set_updated_at();

-- Limite de 200 cenários por pessoa (mesma regra da API antiga)
create or replace function public.cenarios_limite_por_usuario()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.cenarios where user_id = new.user_id) >= 200 then
    raise exception 'Você chegou ao limite de 200 cenários. Exclua algum para salvar outro.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists cenarios_limite_por_usuario on public.cenarios;
create trigger cenarios_limite_por_usuario
  before insert on public.cenarios
  for each row execute function public.cenarios_limite_por_usuario();

-- Row Level Security: cada pessoa só enxerga e altera as próprias linhas.
alter table public.cenarios enable row level security;
alter table public.cenarios force row level security;

drop policy if exists "cenarios: dono lê" on public.cenarios;
create policy "cenarios: dono lê"
  on public.cenarios
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "cenarios: dono insere" on public.cenarios;
create policy "cenarios: dono insere"
  on public.cenarios
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "cenarios: dono atualiza" on public.cenarios;
create policy "cenarios: dono atualiza"
  on public.cenarios
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "cenarios: dono exclui" on public.cenarios;
create policy "cenarios: dono exclui"
  on public.cenarios
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Quem não está logado (papel anon) não recebe permissão nenhuma.
revoke all on table public.cenarios from anon;
grant select, insert, update, delete on table public.cenarios to authenticated;
```
