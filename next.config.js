/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empaquetado autocontenido para autoalojar en el servidor de la SEFH:
  // `next build` genera .next/standalone/server.js con todo lo necesario para
  // arrancar con `node server.js` (sin depender de todo node_modules).
  output: 'standalone',
}

module.exports = nextConfig
