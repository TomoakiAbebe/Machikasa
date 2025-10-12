const isProd = process.env.NODE_ENV === 'production';
const isGithubPages = process.env.GITHUB_PAGES === 'true';

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
  basePath: isGithubPages ? '/Machikasa' : '',
  assetPrefix: isGithubPages ? '/Machikasa/' : '',
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
}

module.exports = withPWA(nextConfig)