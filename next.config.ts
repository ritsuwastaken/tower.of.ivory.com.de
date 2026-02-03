import type { NextConfig } from 'next'

const isGitHubPages = process.env.GITHUB_PAGES === '1'
const basePath = isGitHubPages
  ? (process.env.GITHUB_PAGES_BASE_PATH !== undefined
      ? process.env.GITHUB_PAGES_BASE_PATH
      : '/tower.of.ivory.com.de')
  : undefined

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  ...(isGitHubPages && {
    output: 'export',
    basePath: basePath ?? '',
    assetPrefix: basePath ? (basePath.endsWith('/') ? basePath : `${basePath}/`) : '/',
    trailingSlash: true,
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath ?? '',
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
    ]
  },
}

export default nextConfig
