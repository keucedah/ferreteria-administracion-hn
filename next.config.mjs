/** @type {import('next').NextConfig} */
const nextConfig = {
  // Las imágenes de public/ no cambian: el navegador las guarda una semana.
  async headers() {
    return ["/anuncios/:path*", "/capturas/:path*", "/logo.webp", "/logo.png"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
    }));
  },
};

export default nextConfig;
