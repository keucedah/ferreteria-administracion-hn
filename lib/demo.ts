// Datos de ejemplo para el modo demostración (sin Supabase).
import { hoy, sumarMeses } from "./negocio";
import type { Ajustes, Cliente, Pago, Plan, Solicitud } from "./types";

const caracteristicas = "Imágenes optimizadas en WebP\nAlmacenamiento en la nube (Supabase)\nCatálogo y panel administrativo";

export const planesDemo: Plan[] = [
  { id: 1, nombre: "Básico", subtitulo: "Para negocios pequeños", precio_mensual: 150, limite_productos: 2000, caracteristicas, color: "azul", orden: 1, visible: true },
  { id: 2, nombre: "Pro", subtitulo: "Negocios en crecimiento", precio_mensual: 400, limite_productos: 10000, caracteristicas, color: "naranja", orden: 2, visible: true },
  { id: 3, nombre: "Premium", subtitulo: "Alto volumen", precio_mensual: 800, limite_productos: 50000, caracteristicas, color: "verde", orden: 3, visible: true },
];

export const ajustesDemo: Ajustes = {
  nombre_negocio: "Ferretería HN",
  codigo_pais: "504",
  celular: "88839869",
  correo: "kenrakasth2009@gmail.com",
  direccion: "Barrio El Calvario, Langue, Valle, Honduras",
  precio_instalacion: 2500,
  precio_dominio: 135,
  dias_aviso: 5,
  plantilla_cobro:
    "Hola {contacto}, le saluda {mi_negocio}.\nLe recordamos que el pago mensual de su tienda en línea ({negocio}) por *{monto}* ({plan}) vence el *{fecha}*.\nPuede pagar por transferencia o en efectivo. Al pagar, envíenos el comprobante por aquí. ¡Gracias por su preferencia!",
  plantilla_vencido:
    "Hola {contacto}, le saluda {mi_negocio}.\nEl pago de su tienda en línea ({negocio}) por *{monto}* venció el *{fecha}*.\nPara evitar la suspensión del servicio, le pedimos realizar el pago a la brevedad. Si ya pagó, envíenos el comprobante y disculpe la molestia.",
  plantilla_recibo:
    "Hola {contacto}, le saluda {mi_negocio}.\nConfirmamos su pago de *{monto}* recibido el {fecha_pago}.\nSu próximo pago es el *{fecha}*. ¡Gracias!",
};

const h = hoy();
const dias = (n: number) => new Date(Date.parse(h + "T00:00:00Z") + n * 86400000).toISOString().slice(0, 10);

function cliente(id: number, c: Partial<Cliente> & Pick<Cliente, "negocio">): Cliente {
  return {
    id,
    contacto: "",
    codigo_pais: "504",
    celular: "",
    correo: "",
    direccion: "",
    sitio_url: "",
    dominio: "",
    plan_id: 1,
    con_dominio: false,
    limite_personalizado: null,
    cuota_personalizada: null,
    estado: "activo",
    fecha_inicio: sumarMeses(h, -4),
    proximo_pago: dias(20),
    instalacion_pagada: true,
    notas: "",
    creado_en: sumarMeses(h, -4) + "T12:00:00Z",
    ...c,
  };
}

export const clientesDemo: Cliente[] = [
  cliente(1, { negocio: "Ferretería El Constructor", contacto: "Carlos Martínez", celular: "99887766", direccion: "Nacaome, Valle", plan_id: 2, con_dominio: true, dominio: "elconstructorhn.com", sitio_url: "https://elconstructorhn.com", proximo_pago: dias(-3) }),
  cliente(2, { negocio: "Materiales Lagos", contacto: "Ana Lagos", celular: "33445566", direccion: "San Lorenzo, Valle", plan_id: 1, proximo_pago: dias(2) }),
  cliente(3, { negocio: "Ferrecentro Choluteca", contacto: "José Rivera", celular: "97776655", direccion: "Choluteca", plan_id: 3, con_dominio: true, dominio: "ferrecentro.hn", proximo_pago: dias(18) }),
  cliente(4, { negocio: "Depósito San Juan", contacto: "María Flores", celular: "88112233", direccion: "Langue, Valle", plan_id: 1, estado: "prueba", instalacion_pagada: false, proximo_pago: dias(9), notas: "Probando 15 días antes de pagar la instalación." }),
  cliente(5, { negocio: "Ferretería La Económica", contacto: "Luis Aguilar", celular: "94556677", direccion: "Goascorán, Valle", plan_id: 2, estado: "suspendido", proximo_pago: dias(-35), notas: "Suspendido por falta de pago." }),
];

export const pagosDemo: Pago[] = [
  { id: 1, cliente_id: 1, fecha: sumarMeses(h, -4), monto: 2500, concepto: "instalacion", meses: 0, metodo: "Transferencia", nota: "" },
  { id: 2, cliente_id: 1, fecha: dias(-33), monto: 535, concepto: "mensualidad", meses: 1, metodo: "Transferencia", nota: "Plan Pro + dominio" },
  { id: 3, cliente_id: 2, fecha: dias(-28), monto: 150, concepto: "mensualidad", meses: 1, metodo: "Efectivo", nota: "" },
  { id: 4, cliente_id: 3, fecha: dias(-12), monto: 935, concepto: "mensualidad", meses: 1, metodo: "Tigo Money", nota: "" },
  { id: 5, cliente_id: 3, fecha: dias(-12), monto: 2500, concepto: "instalacion", meses: 0, metodo: "Transferencia", nota: "" },
];

export const solicitudesDemo: Solicitud[] = [
  { id: 1, nombre: "Pedro Gómez", negocio: "Ferretería Gómez", celular: "+504 9876 5432", mensaje: "Quiero ver una demostración del catálogo.", atendida: false, creado_en: dias(-1) + "T15:30:00Z" },
];
