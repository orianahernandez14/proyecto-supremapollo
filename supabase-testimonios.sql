-- Ejecutar una sola vez en Supabase > SQL Editor.
create table if not exists public.testimonios (
 id bigint generated always as identity primary key,
 nombre text not null check (char_length(trim(nombre)) between 2 and 80),
 estrellas integer not null check (estrellas between 1 and 5),
 descripcion text not null check (char_length(trim(descripcion)) between 10 and 800),
 estado text not null default 'pendiente' check (estado in ('pendiente','aprobado','rechazado')),
 creado_en timestamptz not null default now()
);
create table if not exists public.administradores (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.testimonios enable row level security;
alter table public.administradores enable row level security;
revoke all on public.testimonios from anon, authenticated;
grant select, insert on public.testimonios to anon, authenticated;
grant update, delete on public.testimonios to authenticated;
grant usage on schema public to anon, authenticated;
grant usage, select on sequence public.testimonios_id_seq to anon, authenticated;
grant select on public.administradores to authenticated;
drop policy if exists "publicar testimonio pendiente" on public.testimonios;
create policy "publicar testimonio pendiente" on public.testimonios for insert to anon, authenticated
with check (estado = 'pendiente');
drop policy if exists "leer aprobados o gestionar" on public.testimonios;
create policy "leer aprobados o gestionar" on public.testimonios for select to anon, authenticated
using (estado = 'aprobado' or exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
drop policy if exists "solo administradores actualizan" on public.testimonios;
create policy "solo administradores actualizan" on public.testimonios for update to authenticated
using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
drop policy if exists "solo administradores eliminan" on public.testimonios;
create policy "solo administradores eliminan" on public.testimonios for delete to authenticated
using (exists (select 1 from public.administradores a where a.user_id = (select auth.uid())));
drop policy if exists "administrador ve su membresia" on public.administradores;
create policy "administrador ve su membresia" on public.administradores for select to authenticated
using (user_id = (select auth.uid()));
-- Después de crear un usuario en Authentication > Users, autorizarlo con:
-- insert into public.administradores (user_id) values ('UUID-DEL-USUARIO');
