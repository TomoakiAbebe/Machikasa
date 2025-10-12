const isProd = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
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