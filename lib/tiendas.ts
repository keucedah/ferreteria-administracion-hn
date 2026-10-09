// Tiendas de los clientes (tabla "tiendas" del sitio de las tiendas).
// Todo aquí corre en el servidor con la clave de servicio.
import { URL_TIENDAS, servicioConfigurado } from "./config";
import { crearClienteServicio } from "./supabase/servicio";
import { limiteProductos } from "./negocio";
import { normalizarDominio, validarSlug } from "./slug";
import type { Cliente, Plan, TiendaCliente } from "./types";

const CATEGORIAS_INICIALES = [
  "Herramientas manuales",
  "Herramientas eléctricas",
  "Tornillería y fijaciones",
  "Pinturas",
  "Electricidad",
  "Plomería",
];

export function enlaceTienda(slug: string): string {
  return `${URL_TIENDAS}/${slug}`;
}

const activa = (c: Pick<Cliente, "estado">) => c.estado === "prueba" || c.estado === "activo";

/** Datos que el panel controla en la tienda: plan, límite, dominio y si está activa. */
function datosControlados(cliente: Cliente, plan: Plan | undefined) {
  const dominio = cliente.con_dominio ? normalizarDominio(cliente.dominio) : "";
  return {
    activa: activa(cliente),
    nombre_plan: (plan?.nombre ?? (cliente.limite_personalizado ? "Especial" : "")).slice(0, 40),
    limite_productos: limiteProductos(cliente, plan) ?? 2000,
    dominio: dominio || null,
  };
}

const errorDominio = (m: string) =>
  m.includes("tiendas_dominio_key") ? "Ese dominio ya lo usa otra tienda." : m;

/** Copia a su tienda el plan, el límite, el dominio y el estado del cliente. */
export async function sincronizarTienda(cliente: Cliente, plan: Plan | undefined): Promise<string | null> {
  if (!cliente.tienda_id || !servicioConfigurado) return null;
  const sb = crearClienteServicio();
  const { error } = await sb
    .from("tiendas")
    .update({ ...datosControlados(cliente, plan), actualizado_en: new Date().toISOString() })
    .eq("id", cliente.tienda_id);
  return error ? "No se pudo actualizar su tienda: " + errorDominio(error.message) : null;
}

/** Suspende la tienda (sin borrar sus productos). */
export async function suspenderTienda(tiendaId: number | null): Promise<void> {
  if (!tiendaId || !servicioConfigurado) return;
  await crearClienteServicio().from("tiendas").update({ activa: false }).eq("id", tiendaId);
}

async function buscarUsuario(sb: ReturnType<typeof crearClienteServicio>, correo: string) {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;
    const u = data.users.find((x) => x.email?.toLowerCase() === correo);
    if (u) return u;
    if (data.users.length < 1000) return null;
  }
  return null;
}

/**
 * Crea la tienda del cliente, su usuario (correo + contraseña) y lo deja como dueño.
 * Si el correo ya tiene usuario, ese usuario pasa a ser dueño y su contraseña no cambia.
 */
export async function crearTienda(
  cliente: Cliente,
  plan: Plan | undefined,
  slug: string,
  correo: string,
  clave: string,
): Promise<{ ok: true; usuarioNuevo: boolean } | { ok: false; mensaje: string }> {
  if (!servicioConfigurado) return { ok: false, mensaje: "Falta la variable SUPABASE_SERVICE_ROLE_KEY en Vercel para crear tiendas." };
  if (cliente.tienda_id) return { ok: false, mensaje: "Este cliente ya tiene tienda." };
  const errSlug = validarSlug(slug);
  if (errSlug) return { ok: false, mensaje: errSlug };
  correo = correo.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { ok: false, mensaje: "Escribe un correo válido para el dueño de la tienda." };

  const sb = crearClienteServicio();
  const existente = await buscarUsuario(sb, correo);
  if (!existente && clave.length < 8) return { ok: false, mensaje: "La contraseña debe tener al menos 8 caracteres." };

  const { data: tienda, error } = await sb
    .from("tiendas")
    .insert({
      slug,
      nombre_tienda: cliente.negocio.slice(0, 60),
      codigo_pais: cliente.codigo_pais,
      celular: cliente.celular,
      ...datosControlados(cliente, plan),
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505" && error.message.includes("slug")) return { ok: false, mensaje: `La dirección “${slug}” ya la usa otra tienda.` };
    return { ok: false, mensaje: "No se pudo crear la tienda: " + errorDominio(error.message) };
  }

  let userId = existente?.id;
  if (!userId) {
    const { data, error: errUser } = await sb.auth.admin.createUser({ email: correo, password: clave, email_confirm: true });
    if (errUser || !data.user) {
      await sb.from("tiendas").delete().eq("id", tienda.id);
      return { ok: false, mensaje: "No se pudo crear el usuario: " + (errUser?.message ?? "error desconocido") };
    }
    userId = data.user.id;
  }

  await sb.from("tienda_admins").insert({ tienda_id: tienda.id, user_id: userId });
  await sb.from("categorias").insert(CATEGORIAS_INICIALES.map((nombre) => ({ tienda_id: tienda.id, nombre })));
  const { error: errCliente } = await sb
    .from("clientes")
    .update({ tienda_id: tienda.id, sitio_url: enlaceTienda(slug), actualizado_en: new Date().toISOString() })
    .eq("id", cliente.id);
  if (errCliente) return { ok: false, mensaje: "La tienda se creó, pero no se pudo enlazar al cliente: " + errCliente.message };
  return { ok: true, usuarioNuevo: !existente };
}

/** Datos de la tienda del cliente para su ficha. */
export async function obtenerTiendaCliente(tiendaId: number | null): Promise<TiendaCliente | null> {
  if (!tiendaId || !servicioConfigurado) return null;
  const sb = crearClienteServicio();
  const [{ data: t }, { count }, { data: duenos }] = await Promise.all([
    sb.from("tiendas").select("id, slug, nombre_tienda, dominio, activa, limite_productos, nombre_plan").eq("id", tiendaId).maybeSingle(),
    sb.from("productos").select("id", { count: "exact", head: true }).eq("tienda_id", tiendaId),
    sb.from("tienda_admins").select("user_id").eq("tienda_id", tiendaId),
  ]);
  if (!t) return null;
  const correos = await Promise.all(
    (duenos ?? []).map(async (d) => (await sb.auth.admin.getUserById(d.user_id)).data.user?.email ?? ""),
  );
  return { ...t, productos: count ?? 0, duenos: correos.filter(Boolean), enlace: enlaceTienda(t.slug) };
}

/** Cambia la contraseña del dueño (o de todos los dueños) de la tienda. */
export async function cambiarClaveDuenos(tiendaId: number, clave: string): Promise<string | null> {
  if (!servicioConfigurado) return "Falta la variable SUPABASE_SERVICE_ROLE_KEY en Vercel.";
  if (clave.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  const sb = crearClienteServicio();
  const { data: duenos } = await sb.from("tienda_admins").select("user_id").eq("tienda_id", tiendaId);
  if (!duenos?.length) return "Esta tienda no tiene dueño.";
  for (const d of duenos) {
    const { error } = await sb.auth.admin.updateUserById(d.user_id, { password: clave });
    if (error) return "No se pudo cambiar la contraseña: " + error.message;
  }
  return null;
}
