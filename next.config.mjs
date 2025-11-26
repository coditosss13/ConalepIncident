/** @type {import('next').NextConfig} */
const nextConfig = {
  // <CHANGE> Configurando turbopack root para silenciar warning de workspace
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // <CHANGE> Deshabilitando Type Stripping experimental
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig
