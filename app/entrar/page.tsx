"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useActionState } from "react";
import { iniciarSesion } from "./acciones";

export default function Entrar() {
  const [error, accion, enviando] = useActionState(iniciarSesion, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-marino-900 px-4 py-10">
      <form action={accion} className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/logo.webp" width={128} height={128} alt="" className="h-12 w-12" />
          <div>
            <h1 className="text-xl font-bold">Panel de clientes</h1>
            <p className="text-sm text-gray-500">Solo para el administrador.</p>
          </div>
        </div>
        <label className="block">
          <span className="etiqueta">Correo</span>
          <input name="email" type="email" autoComplete="username" required className="campo" />
        </label>
        <label className="block">
          <span className="etiqueta">Contraseña</span>
          <input name="password" type="password" autoComplete="current-password" required className="campo" />
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={enviando} className="boton-primario w-full">
          {enviando ? "Entrando…" : "Entrar"}
        </button>
        <Link href="/" className="block text-center text-sm text-gray-500 hover:underline">
          Volver a la página principal
        </Link>
      </form>
    </div>
  );
}
