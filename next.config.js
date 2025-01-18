const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, '../../node_modules/yjs')
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/old-research',
        destination: '/research',
        permanent: true,
      },
      {
        source: '/beta',
        destination: '/editor/default',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
