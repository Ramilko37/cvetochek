/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // SSR: без output: 'export' — сборка под Node.js (next start)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
}

export default nextConfig
