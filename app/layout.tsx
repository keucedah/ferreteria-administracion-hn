import type { Metadata } from "next";
import "./globals.css";
import { obtenerAjustes } from "@/lib/datos";

export async function generateMetadata(): Promise<Metadata> {
  const a = await obtenerAjustes();
  return {
    title: `${a.nombre_negocio} | Tu ferretería en línea`,
    description:
      "Sitio web, app web y panel administrativo para ferreterías y negocios de materiales de construcción. Catálogo digital y cotizaciones por WhatsApp.",
    icons: { icon: "/logo.png" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
