import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_LAST_UPDATE: Date.now().toString(),
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/armorsets',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/icon/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300',
          },
        ],
      },
    ]
  },
}

export default nextConfig
