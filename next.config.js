/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/supa-auth-nextjs' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/supa-auth-nextjs/' : '',
  env: {
    customKey: 'my-value',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig 