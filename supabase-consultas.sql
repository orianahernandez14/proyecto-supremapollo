-- Ejecutar en Supabase > SQL Editor antes de probar el formulario de contacto.
-- Las consultas solo pueden crearse desde el sitio; no son legibles públicamente.
create table if not exists public.consultas (
    id bigint generated always as identity primary key,
    nombre text not null check (char_length(trim(nombre)) between 2 and 80),
    email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
    mensaje text not null check (char_length(trim(mensaje)) between 10 and 3000),
    estado text not null default 'pendiente' check (estado in ('pendiente','respondida','archivada')),
    creado_en timestamptz not null default now()
);
alter table public.consultas enable row level security;
revoke all on public.consultas from anon, authenticated;
grant insert on public.consultas to anon, authenticated;
grant select, update on public.consultas to authenticated;
grant usage, select on sequence public.consultas_id_seq to anon, authenticated;
drop policy if exists "enviar consulta publica" on public.consultas;
create policy "enviar consulta publica" on public.consultas for insert to anon, authenticated
with check (estado = 'pendiente');
drop policy if exists "administradores leen consultas" on public.consultas;
create policy "administradores leen consultas" on public.consultas for select to authenticated
using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
drop policy if exists "administradores actualizan consultas" on public.consultas;
create policy "administradores actualizan consultas" on public.consultas for update to authenticated
using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
-- Ver consultas desde Supabase > Table Editor > consultas.
-- El formulario no envía correos automáticos: almacena cada consulta en PostgreSQL.
