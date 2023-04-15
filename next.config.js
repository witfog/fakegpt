/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.openai.com/v1/:path*',
      },
    ]
  },
  experimental: {
    // Rewrites proxy timout is default to 30s, it might not enought to get response from openai.
    proxyTimeout: 120_000,
  }
}

module.exports = nextConfig
