-- ============================================================================
-- ASTERION (@mundoasterion) — Schema Completo + RLS + Funções Atômicas
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. MORADORES
create table if not exists public.moradores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  nome text not null,
  arroba text unique null,
  profissao text not null check (profissao in ('ferreiro', 'fazendeiro', 'lenhador', 'bardo', 'mago', 'costureira', 'mercador')),
  casa_idx int not null unique check (casa_idx >= 0),
  regiao int not null default 0,
  cor_parede text not null default '#f2ead8',
  cor_telhado text not null default '#e2552e',
  fundador boolean not null default false,
  segue_verificado boolean not null default false,
  ultima_coleta_em timestamptz null,
  criado_em timestamptz not null default now()
);

-- 2. RECURSOS
create table if not exists public.recursos (
  morador_id uuid not null references public.moradores(id) on delete cascade,
  tipo text not null check (tipo in ('ferramentas', 'comida', 'madeira', 'alegria', 'protecao', 'tecido', 'moedas')),
  qtd int not null default 0 check (qtd >= 0),
  primary key (morador_id, tipo)
);

-- 3. CARTEIRA (Moeda da vila: Astros)
create table if not exists public.carteira (
  morador_id uuid primary key references public.moradores(id) on delete cascade,
  astros int not null default 0 check (astros >= 0)
);

-- 4. OFERTAS DO MERCADO
create table if not exists public.ofertas (
  id uuid primary key default gen_random_uuid(),
  vendedor_id uuid not null references public.moradores(id) on delete cascade,
  tipo text not null check (tipo in ('ferramentas', 'comida', 'madeira', 'alegria', 'protecao', 'tecido', 'moedas')),
  qtd int not null check (qtd > 0),
  preco int not null check (preco > 0),
  status text not null default 'aberta' check (status in ('aberta', 'concluida', 'cancelada')),
  comprador_id uuid null references public.moradores(id) on delete set null,
  criado_em timestamptz not null default now()
);

-- 5. DEVERES SEMANAIS
create table if not exists public.deveres (
  morador_id uuid not null references public.moradores(id) on delete cascade,
  semana int not null check (semana > 0),
  tipo text not null,
  cumprido boolean not null default false,
  primary key (morador_id, semana)
);

-- 6. NÍVEIS E TÍTULOS
create table if not exists public.niveis (
  morador_id uuid primary key references public.moradores(id) on delete cascade,
  xp int not null default 0 check (xp >= 0),
  titulo text not null default 'Aprendiz'
);

-- 7. OBRAS DA SEMANA
create table if not exists public.obras (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null,
  meta jsonb not null default '{}'::jsonb,
  progresso jsonb not null default '{}'::jsonb,
  status text not null default 'em_andamento' check (status in ('em_andamento', 'concluida')),
  semana int not null default 1
);

-- 8. CONTRIBUIÇÕES PARA OBRAS
create table if not exists public.contribuicoes (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  morador_id uuid not null references public.moradores(id) on delete cascade,
  tipo text not null,
  qtd int not null check (qtd > 0),
  criado_em timestamptz not null default now()
);

-- 9. VOTAÇÕES NA URNA DO SALÃO
create table if not exists public.votacoes (
  id uuid primary key default gen_random_uuid(),
  pergunta text not null,
  opcoes text[] not null,
  abre_em timestamptz not null default now(),
  fecha_em timestamptz not null,
  vencedora text null
);

-- 10. VOTOS (1 voto por morador garantido pela PK composta)
create table if not exists public.votos (
  votacao_id uuid not null references public.votacoes(id) on delete cascade,
  morador_id uuid not null references public.moradores(id) on delete cascade,
  opcao text not null,
  primary key (votacao_id, morador_id)
);

-- 11. REIVINDICAÇÕES ("Essa casa é minha")
create table if not exists public.reivindicacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  arroba text not null,
  codigo text not null,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  criado_em timestamptz not null default now()
);

-- 12. EVENTOS DA VILA (Noite do Cucu, Obra Pronta...)
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  dados jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now()
);

-- 13. GANCHO FORA DO MVP: ITENS COSMÉTICOS (Loja futura)
create table if not exists public.itens_cosmeticos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text not null,
  preco_gemas int not null check (preco_gemas > 0),
  exclusivo_fundador boolean not null default false,
  preview_cor text not null default '#f8d040',
  criado_em timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada morador lê tudo da vila, mas só escreve o que é dele.
-- Coleta, contribuições, votos e trocas de mercado passam por Edge Functions.
-- ============================================================================

alter table public.moradores enable row level security;
alter table public.recursos enable row level security;
alter table public.carteira enable row level security;
alter table public.ofertas enable row level security;
alter table public.deveres enable row level security;
alter table public.niveis enable row level security;
alter table public.obras enable row level security;
alter table public.contribuicoes enable row level security;
alter table public.votacoes enable row level security;
alter table public.votos enable row level security;
alter table public.reivindicacoes enable row level security;
alter table public.eventos enable row level security;
alter table public.itens_cosmeticos enable row level security;

-- Políticas de leitura pública da vila
create policy "Leitura publica de moradores" on public.moradores for select using (true);
create policy "Leitura publica de recursos" on public.recursos for select using (true);
create policy "Leitura publica de carteira" on public.carteira for select using (true);
create policy "Leitura publica de ofertas" on public.ofertas for select using (true);
create policy "Leitura publica de deveres" on public.deveres for select using (true);
create policy "Leitura publica de niveis" on public.niveis for select using (true);
create policy "Leitura publica de obras" on public.obras for select using (true);
create policy "Leitura publica de contribuicoes" on public.contribuicoes for select using (true);
create policy "Leitura publica de votacoes" on public.votacoes for select using (true);
create policy "Leitura publica de votos" on public.votos for select using (true);
create policy "Leitura publica de eventos" on public.eventos for select using (true);
create policy "Leitura publica de cosmeticos" on public.itens_cosmeticos for select using (true);

-- Escrita restrita ao próprio usuário autenticado
create policy "Morador atualiza cores da propria casa"
  on public.moradores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuario cria e le suas reivindicacoes"
  on public.reivindicacoes for select
  using (auth.uid() = user_id);

create policy "Usuario solicita reivindicacao"
  on public.reivindicacoes for insert
  with check (auth.uid() = user_id and status = 'pendente');

create policy "Vendedor cria oferta propria"
  on public.ofertas for insert
  with check (
    exists (
      select 1 from public.moradores m
      where m.id = vendedor_id and m.user_id = auth.uid()
    )
  );

-- Habilita Realtime para obras, contribuições e votações
alter publication supabase_realtime add table public.obras;
alter publication supabase_realtime add table public.contribuicoes;
alter publication supabase_realtime add table public.votacoes;
alter publication supabase_realtime add table public.votos;
