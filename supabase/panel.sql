-- Panel de clientes de Ferretería HN.
-- Se ejecuta en el MISMO proyecto de Supabase del sitio de la ferretería:
-- Supabase > SQL Editor > New query > pegar todo este archivo > Run.
-- Se puede ejecutar más de una vez sin dañar nada.
-- No toca las tablas de la tienda (productos, categorias, configuracion).

-- Administradores del panel --------------------------------------------------
-- Lista aparte de la de la tienda: ser administrador de la tienda NO da acceso a tus clientes.
create table if not exists public.panel_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.es_admin_panel()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.panel_admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.es_admin_panel() from public;
grant execute on function public.es_admin_panel() to anon, authenticated;

alter table public.panel_admins enable row level security;

drop policy if exists "ver propio registro panel" on public.panel_admins;
create policy "ver propio registro panel" on public.panel_admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Planes (se muestran en la página pública) ---------------------------------
create table if not exists public.planes (
  id bigint generated always as identity primary key,
  nombre text not null unique check (char_length(nombre) between 1 and 40),
  subtitulo text not null default '' check (char_length(subtitulo) <= 80),
  precio_mensual numeric(10, 2) not null check (precio_mensual >= 0),
  limite_productos integer not null check (limite_productos > 0),
  caracteristicas text not null default '' check (char_length(caracteristicas) <= 1000),
  color text not null default 'azul' check (color in ('azul', 'naranja', 'verde', 'morado', 'gris')),
  orden smallint not null default 0,
  visible boolean not null default true,
  creado_en timestamptz not null default now()
);

insert into public.planes (nombre, subtitulo, precio_mensual, limite_productos, caracteristicas, color, orden) values
  ('Básico', 'Para negocios pequeños', 150, 2000,
   E'Imágenes optimizadas en WebP\nAlmacenamiento en la nube (Supabase)\nCatálogo y panel administrativo', 'azul', 1),
  ('Pro', 'Negocios en crecimiento', 400, 10000,
   E'Imágenes optimizadas en WebP\nAlmacenamiento en la nube (Supabase)\nCatálogo y panel administrativo', 'naranja', 2),
  ('Premium', 'Alto volumen', 800, 50000,
   E'Imágenes optimizadas en WebP\nAlmacenamiento en la nube (Supabase)\nCatálogo y panel administrativo', 'verde', 3)
on conflict (nombre) do nothing;

-- Datos del negocio (una sola fila) -----------------------------------------
create table if not exists public.ajustes_negocio (
  id smallint primary key default 1 check (id = 1),
  nombre_negocio text not null default 'Ferretería HN' check (char_length(nombre_negocio) between 1 and 60),
  codigo_pais text not null default '504' check (codigo_pais ~ '^[0-9]{1,4}$'),
  celular text not null default '88839869' check (celular ~ '^[0-9]{0,14}$'),
  correo text not null default 'kenrakasth2009@gmail.com' check (char_length(correo) <= 120),
  direccion text not null default 'Barrio El Calvario, Langue, Valle, Honduras' check (char_length(direccion) <= 200),
  precio_instalacion numeric(10, 2) not null default 2500 check (precio_instalacion >= 0),
  precio_dominio numeric(10, 2) not null default 135 check (precio_dominio >= 0),
  dias_aviso smallint not null default 5 check (dias_aviso between 0 and 60),
  plantilla_cobro text not null default
    E'Hola {contacto}, le saluda {mi_negocio}.\nLe recordamos que el pago mensual de su tienda en línea ({negocio}) por *{monto}* ({plan}) vence el *{fecha}*.\nPuede pagar por transferencia o en efectivo. Al pagar, envíenos el comprobante por aquí. ¡Gracias por su preferencia!'
    check (char_length(plantilla_cobro) <= 1500),
  plantilla_vencido text not null default
    E'Hola {contacto}, le saluda {mi_negocio}.\nEl pago de su tienda en línea ({negocio}) por *{monto}* venció el *{fecha}*.\nPara evitar la suspensión del servicio, le pedimos realizar el pago a la brevedad. Si ya pagó, envíenos el comprobante y disculpe la molestia.'
    check (char_length(plantilla_vencido) <= 1500),
  plantilla_recibo text not null default
    E'Hola {contacto}, le saluda {mi_negocio}.\nConfirmamos su pago de *{monto}* recibido el {fecha_pago}.\nSu próximo pago es el *{fecha}*. ¡Gracias!'
    check (char_length(plantilla_recibo) <= 1500),
  actualizado_en timestamptz not null default now()
);

insert into public.ajustes_negocio (id) values (1) on conflict (id) do nothing;

-- Clientes ------------------------------------------------------------------
create table if not exists public.clientes (
  id bigint generated always as identity primary key,
  negocio text not null check (char_length(negocio) between 1 and 120),
  contacto text not null default '' check (char_length(contacto) <= 120),
  codigo_pais text not null default '504' check (codigo_pais ~ '^[0-9]{1,4}$'),
  celular text not null default '' check (celular ~ '^[0-9]{0,14}$'),
  correo text not null default '' check (char_length(correo) <= 120),
  direccion text not null default '' check (char_length(direccion) <= 200),
  sitio_url text not null default '' check (char_length(sitio_url) <= 200),
  dominio text not null default '' check (char_length(dominio) <= 120),
  plan_id bigint references public.planes (id) on delete restrict,
  con_dominio boolean not null default false,
  limite_personalizado integer check (limite_personalizado is null or limite_personalizado > 0),
  cuota_personalizada numeric(10, 2) check (cuota_personalizada is null or cuota_personalizada >= 0),
  estado text not null default 'activo' check (estado in ('prueba', 'activo', 'suspendido', 'cancelado')),
  fecha_inicio date not null default current_date,
  proximo_pago date,
  instalacion_pagada boolean not null default false,
  notas text not null default '' check (char_length(notas) <= 2000),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists clientes_plan_id_idx on public.clientes (plan_id);
create index if not exists clientes_proximo_pago_idx on public.clientes (proximo_pago);

-- Pagos recibidos -------------------------------------------------------------
create table if not exists public.pagos (
  id bigint generated always as identity primary key,
  cliente_id bigint not null references public.clientes (id) on delete cascade,
  fecha date not null default current_date,
  monto numeric(10, 2) not null check (monto > 0),
  concepto text not null default 'mensualidad' check (concepto in ('mensualidad', 'instalacion', 'dominio', 'otro')),
  meses smallint not null default 1 check (meses between 0 and 24),
  metodo text not null default '' check (char_length(metodo) <= 40),
  nota text not null default '' check (char_length(nota) <= 300),
  creado_en timestamptz not null default now()
);

create index if not exists pagos_cliente_id_idx on public.pagos (cliente_id);
create index if not exists pagos_fecha_idx on public.pagos (fecha desc);

-- Solicitudes de demostración (formulario de la página pública) ------------
create table if not exists public.solicitudes_demo (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 1 and 80),
  negocio text not null default '' check (char_length(negocio) <= 120),
  celular text not null default '' check (celular ~ '^[0-9+ ]{0,20}$'),
  mensaje text not null default '' check (char_length(mensaje) <= 500),
  atendida boolean not null default false,
  creado_en timestamptz not null default now()
);

create index if not exists solicitudes_demo_creado_en_idx on public.solicitudes_demo (creado_en desc);

-- Seguridad por filas (RLS) -------------------------------------------------
alter table public.planes enable row level security;
alter table public.ajustes_negocio enable row level security;
alter table public.clientes enable row level security;
alter table public.pagos enable row level security;
alter table public.solicitudes_demo enable row level security;

-- Público: ver los planes visibles y los datos de contacto
drop policy if exists "planes publicos" on public.planes;
create policy "planes publicos" on public.planes
  for select to anon, authenticated using (visible or (select public.es_admin_panel()));

drop policy if exists "ajustes publicos" on public.ajustes_negocio;
create policy "ajustes publicos" on public.ajustes_negocio
  for select to anon, authenticated using (true);

-- Público: solo puede ENVIAR una solicitud de demostración, no leerlas
drop policy if exists "enviar solicitud" on public.solicitudes_demo;
create policy "enviar solicitud" on public.solicitudes_demo
  for insert to anon, authenticated with check (atendida = false);

-- Solo el administrador del panel gestiona todo lo demás
drop policy if exists "admin panel planes" on public.planes;
create policy "admin panel planes" on public.planes
  for all to authenticated
  using ((select public.es_admin_panel())) with check ((select public.es_admin_panel()));

drop policy if exists "admin panel ajustes" on public.ajustes_negocio;
create policy "admin panel ajustes" on public.ajustes_negocio
  for update to authenticated
  using ((select public.es_admin_panel())) with check ((select public.es_admin_panel()));

drop policy if exists "admin panel clientes" on public.clientes;
create policy "admin panel clientes" on public.clientes
  for all to authenticated
  using ((select public.es_admin_panel())) with check ((select public.es_admin_panel()));

drop policy if exists "admin panel pagos" on public.pagos;
create policy "admin panel pagos" on public.pagos
  for all to authenticated
  using ((select public.es_admin_panel())) with check ((select public.es_admin_panel()));

drop policy if exists "admin panel solicitudes" on public.solicitudes_demo;
create policy "admin panel solicitudes" on public.solicitudes_demo
  for all to authenticated
  using ((select public.es_admin_panel())) with check ((select public.es_admin_panel()));

-- Tu cuenta como administrador del panel -------------------------------------
-- Si ya creaste tu usuario en Authentication > Users con este correo, queda listo.
-- Si todavía no existe, créalo y vuelve a ejecutar solo esta línea.
insert into public.panel_admins (user_id)
select id from auth.users where email = 'kenrakasth2009@gmail.com'
on conflict (user_id) do nothing;
