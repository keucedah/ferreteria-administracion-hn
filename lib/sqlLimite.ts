// Genera el SQL que pone el límite de productos en la tienda de un cliente.
// Se pega en Supabase > SQL Editor del proyecto donde está la tienda de ese cliente.

export function sqlLimite(nombrePlan: string, limite: number, contacto: string): string {
  const txt = (s: string) => "'" + s.replace(/'/g, "''") + "'";
  return `-- Límite de productos: plan ${nombrePlan.replace(/\n/g, " ")} (${limite} productos)
-- Pegar en Supabase > SQL Editor de la tienda del cliente y presionar Run.
create table if not exists public.plan_tienda (
  id smallint primary key default 1 check (id = 1),
  nombre_plan text not null default 'Básico',
  limite_productos integer not null default 2000 check (limite_productos > 0),
  contacto text not null default '',
  actualizado_en timestamptz not null default now()
);
alter table public.plan_tienda enable row level security;
drop policy if exists "ver plan tienda" on public.plan_tienda;
create policy "ver plan tienda" on public.plan_tienda for select to anon, authenticated using (true);
-- Sin políticas de escritura: solo se cambia desde el SQL Editor, el dueño de la tienda no puede subir su límite.

insert into public.plan_tienda (id, nombre_plan, limite_productos, contacto, actualizado_en)
values (1, ${txt(nombrePlan)}, ${Math.trunc(limite)}, ${txt(contacto)}, now())
on conflict (id) do update set
  nombre_plan = excluded.nombre_plan,
  limite_productos = excluded.limite_productos,
  contacto = excluded.contacto,
  actualizado_en = now();

create or replace function public.revisar_limite_productos()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  lim integer;
  plan text;
  tel text;
  total integer;
begin
  select limite_productos, nombre_plan, contacto into lim, plan, tel from public.plan_tienda where id = 1;
  if lim is null then
    return new;
  end if;
  perform pg_advisory_xact_lock(hashtext('public.productos.limite'));
  select count(*) into total from public.productos;
  if total >= lim then
    raise exception 'Llegaste al límite de % productos del plan %. Para agregar más, pide un cambio de plan%.',
      lim, plan, case when tel <> '' then ' al ' || tel else '' end
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists limite_productos on public.productos;
create trigger limite_productos before insert on public.productos
  for each row execute function public.revisar_limite_productos();
`;
}
