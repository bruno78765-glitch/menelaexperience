-- Diagnóstico por pessoa (Supabase Auth + RLS).
-- Rode este arquivo inteiro no SQL Editor do projeto rbgpdetmnnspgcesneva,
-- o mesmo da calculadora (tabela public.cenarios). As duas tabelas ficam juntas;
-- cada uma tem o próprio RLS. Pode ser executado mais de uma vez.
--
-- Linhas antigas, gravadas sem dono, são apagadas: elas não pertencem a nenhuma conta
-- e o modelo anterior deixava qualquer visitante ler e apagar a tabela.

create extension if not exists pgcrypto;

create table if not exists public.essencia_diagnosticos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  nome text not null default '',
  nicho text not null default '',
  meta_faturamento numeric not null default 10000,
  ticket_medio numeric not null default 500,
  taxa_conversao numeric not null default 25,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.essencia_diagnosticos
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

update public.essencia_diagnosticos
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

delete from public.essencia_diagnosticos
where user_id is null
   or char_length(btrim(nome)) < 2
   or char_length(btrim(nome)) > 80
   or char_length(btrim(nicho)) < 2
   or char_length(btrim(nicho)) > 120
   or meta_faturamento <= 0
   or meta_faturamento > 100000000
   or ticket_medio <= 0
   or ticket_medio > 100000000
   or taxa_conversao <= 0
   or taxa_conversao > 100;

delete from public.essencia_diagnosticos a
using public.essencia_diagnosticos b
where a.user_id = b.user_id
  and (a.updated_at, a.id) < (b.updated_at, b.id);

alter table public.essencia_diagnosticos alter column user_id set default auth.uid();
alter table public.essencia_diagnosticos alter column user_id set not null;
alter table public.essencia_diagnosticos alter column nome drop default;
alter table public.essencia_diagnosticos alter column nicho drop default;
alter table public.essencia_diagnosticos alter column meta_faturamento drop default;
alter table public.essencia_diagnosticos alter column ticket_medio drop default;
alter table public.essencia_diagnosticos alter column taxa_conversao drop default;
alter table public.essencia_diagnosticos alter column created_at set not null;
alter table public.essencia_diagnosticos alter column updated_at set not null;

alter table public.essencia_diagnosticos drop constraint if exists essencia_diagnosticos_nome_tamanho;
alter table public.essencia_diagnosticos drop constraint if exists essencia_diagnosticos_nicho_tamanho;
alter table public.essencia_diagnosticos drop constraint if exists essencia_diagnosticos_meta_positiva;
alter table public.essencia_diagnosticos drop constraint if exists essencia_diagnosticos_ticket_positivo;
alter table public.essencia_diagnosticos drop constraint if exists essencia_diagnosticos_taxa_valida;

alter table public.essencia_diagnosticos
  add constraint essencia_diagnosticos_nome_tamanho check (char_length(btrim(nome)) between 2 and 80);
alter table public.essencia_diagnosticos
  add constraint essencia_diagnosticos_nicho_tamanho check (char_length(btrim(nicho)) between 2 and 120);
alter table public.essencia_diagnosticos
  add constraint essencia_diagnosticos_meta_positiva check (meta_faturamento > 0 and meta_faturamento <= 100000000);
alter table public.essencia_diagnosticos
  add constraint essencia_diagnosticos_ticket_positivo check (ticket_medio > 0 and ticket_medio <= 100000000);
alter table public.essencia_diagnosticos
  add constraint essencia_diagnosticos_taxa_valida check (taxa_conversao > 0 and taxa_conversao <= 100);

create unique index if not exists essencia_diagnosticos_user_id_key
  on public.essencia_diagnosticos (user_id);

create or replace function public.essencia_diagnosticos_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists essencia_diagnosticos_set_updated_at on public.essencia_diagnosticos;
create trigger essencia_diagnosticos_set_updated_at
  before update on public.essencia_diagnosticos
  for each row execute function public.essencia_diagnosticos_set_updated_at();

alter table public.essencia_diagnosticos enable row level security;
alter table public.essencia_diagnosticos force row level security;

drop policy if exists "anon_select_diagnosticos" on public.essencia_diagnosticos;
drop policy if exists "anon_insert_diagnosticos" on public.essencia_diagnosticos;
drop policy if exists "anon_update_diagnosticos" on public.essencia_diagnosticos;
drop policy if exists "anon_delete_diagnosticos" on public.essencia_diagnosticos;
drop policy if exists "essencia_diagnosticos: dono lê" on public.essencia_diagnosticos;
drop policy if exists "essencia_diagnosticos: dono insere" on public.essencia_diagnosticos;
drop policy if exists "essencia_diagnosticos: dono atualiza" on public.essencia_diagnosticos;
drop policy if exists "essencia_diagnosticos: dono exclui" on public.essencia_diagnosticos;

create policy "essencia_diagnosticos: dono lê"
  on public.essencia_diagnosticos
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "essencia_diagnosticos: dono insere"
  on public.essencia_diagnosticos
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "essencia_diagnosticos: dono atualiza"
  on public.essencia_diagnosticos
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "essencia_diagnosticos: dono exclui"
  on public.essencia_diagnosticos
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.essencia_diagnosticos from anon;
grant select, insert, update, delete on table public.essencia_diagnosticos to authenticated;
grant select, insert, update, delete on table public.essencia_diagnosticos to service_role;
