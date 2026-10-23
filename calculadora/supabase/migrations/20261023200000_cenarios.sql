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
