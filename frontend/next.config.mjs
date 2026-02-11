/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === '1'

const nextConfig = {
  // Для GitHub Pages (ветка dev) в CI устанавливаем NEXT_OUTPUT_EXPORT=1 → output: 'export'
  // Для сервера / ветки main переменная не задаётся → полноценный SSR (next start)
  ...(isStaticExport ? { output: 'export' } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
