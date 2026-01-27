/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cvetochek',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
