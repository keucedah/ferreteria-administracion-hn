/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import MenuAdmin from "@/components/admin/MenuAdmin";
import { cerrarSesion } from "@/app/entrar/acciones";
import { obtenerAdmin } from "@/lib/supabase/server";
import { obtenerSolicitudes } from "@/lib/datos";
import { supabaseConfigurado } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel de clientes", robots: { index: false } };

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  let correo = "modo demostración";
  if (supabaseConfigurado) {
    const { user, esAdmin } = await obtenerAdmin();
    if (!user || !esAdmin) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-xl font-bold">Sin permisos de administrador</h1>
          <p className="mt-2 text-gray-600">
            Tu cuenta no está en la lista de administradores del panel de clientes. Revisa el paso 3 del manual (tabla <code>panel_admins</code>).
          </p>
          <form action={cerrarSesion} className="mt-4">
            <button className="boton-secundario">Cerrar sesión</button>
          </form>
        </div>
      );
    }
    correo = user.email ?? "";
  }
  const pendientes = (await obtenerSolicitudes()).filter((s) => !s.atendida).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-marino-900 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/logo.webp" width={128} height={128} alt="" className="h-10 w-10" />
              <div>
                <p className="font-bold leading-tight">Panel de clientes</p>
                <p className="text-xs text-gray-300">{correo}</p>
              </div>
            </Link>
            <div className="flex gap-2">
              <Link href="/" className="boton border border-white/20 text-white hover:bg-white/10">Ver página</Link>
              <form action={cerrarSesion}>
                <button className="boton border border-white/20 text-white hover:bg-white/10">Cerrar sesión</button>
              </form>
            </div>
          </div>
          <MenuAdmin pendientes={pendientes} />
        </div>
      </header>
      {!supabaseConfigurado && (
        <p className="bg-yellow-100 px-4 py-2 text-center text-sm text-yellow-900">
          Modo demostración: estos clientes son de ejemplo y los cambios no se guardan. Conecta Supabase siguiendo el manual.
        </p>
      )}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
