/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/supa-auth-nextjs',
  assetPrefix: '/supa-auth-nextjs/',
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig 