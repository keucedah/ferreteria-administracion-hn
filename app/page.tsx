/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import FormularioDemo from "@/components/FormularioDemo";
import {
  IcoBolsa, IcoCaja, IcoCarrito, IcoCategorias, IcoCelular, IcoCheck, IcoCorreo, IcoEngrane, IcoGlobo, IcoPaleta, IcoUbicacion, IcoWhatsApp,
} from "@/components/Iconos";
import { obtenerAjustes, obtenerPlanes } from "@/lib/datos";
import { COLOR_PLAN } from "@/lib/colores";
import { lempiras } from "@/lib/negocio";
import { formatearCelular, numeroWhatsApp } from "@/lib/telefono";

export const revalidate = 60;

const FUNCIONES = [
  { icono: IcoCaja, titulo: "Catálogo de productos", texto: "Tus productos con foto, descripción y búsqueda por nombre." },
  { icono: IcoCategorias, titulo: "Gestión de categorías", texto: "Ordena tu inventario: plomería, electricidad, pinturas y más." },
  { icono: IcoCarrito, titulo: "Carrito de cotización", texto: "Tus clientes arman su lista con cantidades desde el celular." },
  { icono: IcoWhatsApp, titulo: "Pedidos por WhatsApp", texto: "La cotización te llega lista a tu WhatsApp con un solo toque." },
  { icono: IcoEngrane, titulo: "Fácil de usar y administrar", texto: "Agrega, edita y elimina productos desde tu panel privado." },
  { icono: IcoCelular, titulo: "Diseño adaptable a celulares", texto: "Se ve bien en celular, tableta y computadora." },
  { icono: IcoPaleta, titulo: "Personaliza con tu logo y colores", texto: "Tu nombre, tu logo y tu número de WhatsApp." },
];

const INSTALACION = [
  "Instalación del sitio web y app web",
  "Personalización con tu logo y colores",
  "Configuración del panel administrativo",
  "Conexión con WhatsApp",
  "Carga inicial de categorías (opcional)",
  "Capacitación básica",
];

const CAPTURAS = [
  { src: "/capturas/tel-1.png", titulo: "Sitio web para clientes" },
  { src: "/capturas/tel-2.png", titulo: "App web para clientes" },
  { src: "/capturas/tel-3.png", titulo: "Carrito de cotización" },
  { src: "/capturas/tel-4.png", titulo: "Panel administrativo" },
];

export default async function Inicio() {
  const [ajustes, planes] = await Promise.all([obtenerAjustes(), obtenerPlanes()]);
  const whatsapp = numeroWhatsApp(ajustes.codigo_pais, ajustes.celular);
  const celular = formatearCelular(ajustes.codigo_pais, ajustes.celular);
  const enlaceDemo = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola, quiero información sobre la tienda en línea para mi negocio.")}`
    : "#contacto";
  const visibles = planes.filter((p) => p.visible);

  return (
    <div className="bg-white">
      {/* Encabezado */}
      <header className="sticky top-0 z-30 border-b border-marino-800 bg-marino-900/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#" className="flex items-center gap-2 font-bold">
            <img src="/logo.png" alt="" className="h-10 w-10" />
            <span className="text-lg">{ajustes.nombre_negocio}</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-200 md:flex">
            <a href="#funciones" className="hover:text-white">Funciones</a>
            <a href="#planes" className="hover:text-white">Planes</a>
            <a href="#anuncios" className="hover:text-white">Anuncios</a>
            <a href="#contacto" className="hover:text-white">Contacto</a>
          </nav>
          <a href={enlaceDemo} target="_blank" rel="noopener noreferrer" className="boton-whatsapp">
            <IcoWhatsApp className="h-5 w-5" />
            <span className="hidden sm:inline">Escríbenos</span>
          </a>
        </div>
      </header>

      {/* Portada */}
      <section className="relative overflow-hidden bg-gradient-to-br from-marino-950 via-marino-900 to-marino-800 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-black uppercase leading-tight sm:text-5xl">
              Tu ferretería <span className="block text-marca-400">en línea</span>
            </h1>
            <p className="mt-4 inline-block rounded-full bg-marca-500 px-4 py-1.5 text-sm font-bold sm:text-base">
              Sitio web + App web + Panel administrativo
            </p>
            <p className="mt-5 text-lg text-gray-200">
              Todo para tu obra y tu hogar, al alcance de tus clientes. Catálogo digital, cotizaciones por WhatsApp y mucho más.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={enlaceDemo} target="_blank" rel="noopener noreferrer" className="boton-whatsapp px-5 py-3 text-base">
                <IcoWhatsApp className="h-5 w-5" /> Solicita una demostración
              </a>
              <a href="#planes" className="boton border border-white/30 px-5 py-3 text-base text-white hover:bg-white/10">
                Ver planes y precios
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-300">Ideal para ferreterías y negocios de materiales de construcción.</p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <img src="/capturas/tel-1.png" alt="Tienda en línea en un celular" className="mx-auto w-60 drop-shadow-2xl sm:w-72" />
            <img src="/logo.png" alt="" className="absolute -left-2 top-4 hidden h-28 w-28 drop-shadow-xl sm:block" />
          </div>
        </div>
      </section>

      {/* Funciones */}
      <section id="funciones" className="scroll-mt-16 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black text-marino-900">Todo lo que incluye</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">Tu tienda lista y funcionando, fácil de usar para ti y para tus clientes.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUNCIONES.map(({ icono: Icono, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${titulo.includes("WhatsApp") ? "bg-[#25D366]" : "bg-marca-500"}`}>
                  <Icono />
                </span>
                <h3 className="mt-3 font-bold">{titulo}</h3>
                <p className="mt-1 text-sm text-gray-600">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capturas */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black text-marino-900">Así se ve</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CAPTURAS.map((c) => (
              <figure key={c.src} className="text-center">
                <img src={c.src} alt={c.titulo} className="mx-auto w-full max-w-[240px]" loading="lazy" />
                <figcaption className="mx-auto mt-2 inline-block rounded-full bg-marca-500 px-4 py-1.5 text-sm font-bold text-white">{c.titulo}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="scroll-mt-16 bg-marino-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black">Planes y precios</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-300">Un solo pago de instalación y una mensualidad según la cantidad de productos.</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-2xl bg-white p-6 text-gray-900">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-marino-800 text-white"><IcoEngrane /></span>
                <h3 className="text-lg font-bold">Instalación y configuración</h3>
              </div>
              <p className="mt-4 inline-block rounded-full bg-yellow-300 px-3 py-1 text-sm font-bold">Pago único</p>
              <p className="mt-2 text-5xl font-black text-marino-900">{lempiras(ajustes.precio_instalacion)}</p>
              <ul className="mt-5 space-y-2">
                {INSTALACION.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm"><IcoCheck className="mt-0.5 h-5 w-5 shrink-0" />{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-lg font-bold">
                Planes de almacenamiento <span className="font-normal text-gray-300">en Supabase (productos e imágenes)</span>
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {visibles.map((p) => {
                  const c = COLOR_PLAN[p.color];
                  return (
                    <div key={p.id} className="overflow-hidden rounded-2xl bg-white text-gray-900">
                      <div className={`${c.cabecera} px-4 py-3 text-center text-white`}>
                        <p className="text-xl font-black">{p.nombre}</p>
                        {p.subtitulo && <p className="text-xs opacity-90">{p.subtitulo}</p>}
                      </div>
                      <div className="p-4">
                        <p className="text-center text-4xl font-black">{lempiras(p.precio_mensual)}</p>
                        <p className="text-center text-sm text-gray-500">/mes</p>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-start gap-2"><IcoCheck className="mt-0.5 h-5 w-5 shrink-0" />Hasta {p.limite_productos.toLocaleString("es-HN")} productos</li>
                          {p.caracteristicas.split("\n").filter(Boolean).map((t) => (
                            <li key={t} className="flex items-start gap-2"><IcoCheck className="mt-0.5 h-5 w-5 shrink-0" />{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 text-gray-900">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marino-800 text-white"><IcoGlobo /></span>
                  <div>
                    <p className="font-bold">Dominio web <span className="ml-1 rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">Pago mensual</span></p>
                    <p className="text-2xl font-black">{lempiras(ajustes.precio_dominio)} <span className="text-sm font-normal text-gray-500">/mes</span></p>
                    <p className="text-xs text-gray-600">Registro y gestión del dominio (por ejemplo: tuferreteria.com)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 text-sm text-gray-800">
                  <IcoBolsa className="h-10 w-10 shrink-0 text-gray-800" />
                  Los precios pueden estar sujetos a cambio dependiendo de la devaluación de la moneda y el incremento en el costo de los servidores y servicios externos (Supabase, dominio, etc.).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anuncios */}
      <section id="anuncios" className="scroll-mt-16 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black text-marino-900">Nuestros anuncios</h2>
          <p className="mt-2 text-center text-gray-600">Toca una imagen para verla completa o compartirla.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {["/anuncios/funciones.png", "/anuncios/planes.png"].map((src) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl">
                <img src={src} alt="Anuncio de tienda en línea para ferreterías" className="w-full" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-16 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-marino-900">Solicita una demostración</h2>
            <p className="mt-2 text-gray-600">Te mostramos cómo quedaría la tienda de tu negocio, sin compromiso.</p>
            <ul className="mt-6 space-y-4">
              {celular && (
                <li>
                  <a href={enlaceDemo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-[#25D366] p-4 text-white shadow hover:bg-[#1ebe5a]">
                    <IcoWhatsApp className="h-10 w-10" />
                    <span>
                      <span className="block text-sm">WhatsApp y llamadas</span>
                      <span className="text-2xl font-black">{celular}</span>
                    </span>
                  </a>
                </li>
              )}
              {ajustes.direccion && (
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca-100 text-marca-700"><IcoUbicacion className="h-5 w-5" /></span>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ajustes.direccion)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{ajustes.direccion}</a>
                </li>
              )}
              {ajustes.correo && (
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca-100 text-marca-700"><IcoCorreo className="h-5 w-5" /></span>
                  <a href={`mailto:${ajustes.correo}`} className="break-all hover:underline">{ajustes.correo}</a>
                </li>
              )}
            </ul>
          </div>
          <div className="tarjeta">
            <FormularioDemo whatsapp={whatsapp} />
          </div>
        </div>
      </section>

      <footer className="bg-marino-950 py-8 text-center text-sm text-gray-400">
        <img src="/logo.png" alt="" className="mx-auto mb-3 h-14 w-14" />
        <p>© {new Date().getFullYear()} {ajustes.nombre_negocio}. {ajustes.direccion}</p>
        {/* Acceso discreto para el administrador */}
        <Link href="/entrar" className="mt-3 inline-block text-xs uppercase tracking-wider text-gray-600 hover:text-gray-300">
          Entrar
        </Link>
      </footer>
    </div>
  );
}
