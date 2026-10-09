export type ColorPlan = "azul" | "naranja" | "verde" | "morado" | "gris";

export type Plan = {
  id: number;
  nombre: string;
  subtitulo: string;
  precio_mensual: number;
  limite_productos: number;
  caracteristicas: string;
  color: ColorPlan;
  orden: number;
  visible: boolean;
};

export type Ajustes = {
  nombre_negocio: string;
  codigo_pais: string;
  celular: string;
  correo: string;
  direccion: string;
  precio_instalacion: number;
  precio_dominio: number;
  dias_aviso: number;
  plantilla_cobro: string;
  plantilla_vencido: string;
  plantilla_recibo: string;
};

export type EstadoCliente = "prueba" | "activo" | "suspendido" | "cancelado";

export type Cliente = {
  id: number;
  negocio: string;
  contacto: string;
  codigo_pais: string;
  celular: string;
  correo: string;
  direccion: string;
  sitio_url: string;
  dominio: string;
  plan_id: number | null;
  con_dominio: boolean;
  limite_personalizado: number | null;
  cuota_personalizada: number | null;
  estado: EstadoCliente;
  fecha_inicio: string;
  proximo_pago: string | null;
  instalacion_pagada: boolean;
  notas: string;
  creado_en: string;
};

export type ConceptoPago = "mensualidad" | "instalacion" | "dominio" | "otro";

export type Pago = {
  id: number;
  cliente_id: number;
  fecha: string;
  monto: number;
  concepto: ConceptoPago;
  meses: number;
  metodo: string;
  nota: string;
};

export type Solicitud = {
  id: number;
  nombre: string;
  negocio: string;
  celular: string;
  mensaje: string;
  atendida: boolean;
  creado_en: string;
};
