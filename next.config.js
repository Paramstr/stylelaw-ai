//next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',


  poweredByHeader: false,
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  webpack(config, { isServer }) {
    // Existing SVG loader
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
    });


    // PDF.js worker and canvas configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
      'pdfjs-dist/build/pdf.worker.js': path.resolve(
        __dirname,
        'node_modules/pdfjs-dist/build/pdf.worker.js'
      )
    };

    // Add worker-loader configuration
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]',
      },
    });

    return config;
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
};

module.exports = nextConfig;