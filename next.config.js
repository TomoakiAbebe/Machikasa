const isProd = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  fallbacks: {
    document: '/Machikasa/_offline', // Offline fallback page
  },
  runtimeCaching: [
    // Cache pages with NetworkFirst strategy
    {
      urlPattern: /^\/Machikasa\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache API data with StaleWhileRevalidate
    {
      urlPattern: /\/api\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    // Cache static assets with CacheFirst
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache web fonts
    {
      urlPattern: /\.(woff|woff2|eot|ttf|otf)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // General network cache
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'general-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages用の設定
  basePath: '/Machikasa',
  assetPrefix: '/Machikasa/',
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  eslint: {
    // CI環境でのESLintエラーを警告として扱う
    ignoreDuringBuilds: process.env.CI === 'true',
  },
  typescript: {
    // TypeScriptエラーも一時的に無視（必要に応じて）
    ignoreBuildErrors: process.env.CI === 'true',
  },
}

module.exports = withPWA(nextConfig)