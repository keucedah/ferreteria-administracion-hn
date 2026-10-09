import { cache } from "react";
import { supabaseConfigurado } from "./config";
import { ajustesDemo, clientesDemo, pagosDemo, planesDemo, solicitudesDemo } from "./demo";
import { crearClienteServidor } from "./supabase/server";
import type { Ajustes, Cliente, Pago, Plan, Solicitud } from "./types";

const COLUMNAS_AJUSTES =
  "nombre_negocio, codigo_pais, celular, correo, direccion, precio_instalacion, precio_dominio, dias_aviso, plantilla_cobro, plantilla_vencido, plantilla_recibo";

// Postgres devuelve numeric como texto: se convierte a número.
const aPlan = (p: Plan): Plan => ({ ...p, precio_mensual: Number(p.precio_mensual) });

export const obtenerAjustes = cache(async (): Promise<Ajustes> => {
  if (!supabaseConfigurado) return ajustesDemo;
  const supabase = await crearClienteServidor();
  const { data } = await supabase.from("ajustes_negocio").select(COLUMNAS_AJUSTES).eq("id", 1).maybeSingle();
  if (!data) return ajustesDemo;
  return { ...data, precio_instalacion: Number(data.precio_instalacion), precio_dominio: Number(data.precio_dominio) };
});

/** Planes ordenados. Para el público solo llegan los visibles (lo controla la base de datos). */
export const obtenerPlanes = cache(async (): Promise<Plan[]> => {
  if (!supabaseConfigurado) return planesDemo;
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("planes")
    .select("id, nombre, subtitulo, precio_mensual, limite_productos, caracteristicas, color, orden, visible")
    .order("orden")
    .order("id");
  if (error) throw error;
  return data.map(aPlan);
});

const COLUMNAS_CLIENTE =
  "id, negocio, contacto, codigo_pais, celular, correo, direccion, sitio_url, dominio, plan_id, con_dominio, limite_personalizado, cuota_personalizada, estado, fecha_inicio, proximo_pago, instalacion_pagada, notas, creado_en";

const aCliente = (c: Cliente): Cliente => ({
  ...c,
  cuota_personalizada: c.cuota_personalizada == null ? null : Number(c.cuota_personalizada),
});
const aPago = (p: Pago): Pago => ({ ...p, monto: Number(p.monto) });

export async function obtenerClientes(): Promise<Cliente[]> {
  if (!supabaseConfigurado) return clientesDemo;
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.from("clientes").select(COLUMNAS_CLIENTE).order("negocio");
  if (error) throw error;
  return data.map(aCliente);
}

export async function obtenerCliente(id: number): Promise<Cliente | null> {
  if (!supabaseConfigurado) return clientesDemo.find((c) => c.id === id) ?? null;
  const supabase = await crearClienteServidor();
  const { data } = await supabase.from("clientes").select(COLUMNAS_CLIENTE).eq("id", id).maybeSingle();
  return data ? aCliente(data) : null;
}

export async function obtenerPagos(clienteId?: number): Promise<Pago[]> {
  if (!supabaseConfigurado) {
    const lista = clienteId ? pagosDemo.filter((p) => p.cliente_id === clienteId) : pagosDemo;
    return [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
  }
  const supabase = await crearClienteServidor();
  let q = supabase
    .from("pagos")
    .select("id, cliente_id, fecha, monto, concepto, meses, metodo, nota")
    .order("fecha", { ascending: false })
    .order("id", { ascending: false });
  if (clienteId) q = q.eq("cliente_id", clienteId);
  else q = q.limit(1000);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(aPago);
}

export async function obtenerSolicitudes(): Promise<Solicitud[]> {
  if (!supabaseConfigurado) return solicitudesDemo;
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("solicitudes_demo")
    .select("id, nombre, negocio, celular, mensaje, atendida, creado_en")
    .order("creado_en", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data;
}
