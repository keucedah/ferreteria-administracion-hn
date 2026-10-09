import Link from "next/link";
import FormularioCliente from "@/components/admin/FormularioCliente";
import { obtenerAjustes, obtenerPlanes } from "@/lib/datos";
import { hoy, sumarMeses } from "@/lib/negocio";

// Se puede abrir con datos: /admin/clientes/nuevo?negocio=…&contacto=…&celular=… (desde Solicitudes)
export default async function NuevoCliente({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const [planes, ajustes] = await Promise.all([obtenerPlanes(), obtenerAjustes()]);
  const h = hoy();
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">← Volver a clientes</Link>
      <h1 className="mb-4 mt-2 text-2xl font-bold">Agregar cliente</h1>
      <div className="tarjeta">
        <FormularioCliente
          cliente={{ negocio: q.negocio ?? "", contacto: q.contacto ?? "", celular: q.celular?.replace(/\D/g, "").replace(/^504(?=\d{8}$)/, "") ?? "" }}
          planes={planes}
          precioDominio={ajustes.precio_dominio}
          hoy={h}
          proximoSugerido={sumarMeses(h, 1)}
        />
      </div>
    </div>
  );
}
