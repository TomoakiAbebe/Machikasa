# 🚀 Machikasa Deployment Guide

**Complete deployment instructions for GitHub Pages and other platforms**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Pages Deployment](#github-pages-deployment)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Build Optimization](#build-optimization)
6. [Alternative Deployment Options](#alternative-deployment-options)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## ⚡ Prerequisites

### Required Software

```bash
# Node.js (LTS version recommended)
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher

# Git for version control
git --version   # Any recent version

# Optional: GitHub CLI for easier repository management
gh --version
```

### Account Requirements

- **GitHub Account**: For repository hosting and GitHub Pages
- **Google Cloud Account**: For Google Maps API (optional, for map functionality)
- **Domain Name**: Optional, for custom domain setup

---

## 🌐 GitHub Pages Deployment

### Step 1: Repository Setup

**1.1 Fork or Clone Repository**
```bash
# Option A: Fork the repository on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/machikasa.git
cd machikasa

# Option B: Clone directly (if you have access)
git clone https://github.com/original-owner/machikasa.git
cd machikasa

# Install dependencies
npm install
```

**1.2 Repository Settings**
1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Select **Source**: GitHub Actions
4. The workflow will automatically deploy on push to `main` branch

### Step 2: Configure GitHub Actions

**2.1 Workflow File**
The repository includes `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Pages
        uses: actions/configure-pages@v3
        with:
          static_site_generator: next

      - name: Install dependencies
        run: npm ci

      - name: Build with Next.js
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**2.2 Repository Secrets (Optional)**
If using Google Maps API:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add new repository secret:
   - Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key

### Step 3: Deploy

**3.1 Automatic Deployment**
```bash
# Make a change and push to trigger deployment
git add .
git commit -m "feat: initial deployment setup"
git push origin main
```

**3.2 Manual Deployment**
```bash
# Trigger workflow manually
gh workflow run deploy.yml
# or use GitHub website: Actions tab → Deploy to GitHub Pages → Run workflow
```

**3.3 Monitor Deployment**
1. Check **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Monitor build and deployment progress
4. Access your deployed site at: `https://YOUR_USERNAME.github.io/machikasa/`

---

## 💻 Local Development Setup

### Development Environment

**Install Dependencies**
```bash
# Install all project dependencies
npm install

# Install development dependencies
npm install --save-dev @types/node typescript eslint

# Verify installation
npm list --depth=0
```

**Environment Configuration**
```bash
# Create local environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

**.env.local Example**
```bash
# Application settings
NEXT_PUBLIC_APP_NAME=Machikasa
NODE_ENV=development

# Google Maps API (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_development_api_key_here

# Debug settings
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_DATA=true
```

**Development Scripts**
```bash
# Start development server
npm run dev
# → Opens http://localhost:3000

# Run with custom port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Run all checks
npm run validate
```

### Development Tools

**VS Code Extensions** (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

**Browser DevTools Setup**
1. Install React Developer Tools
2. Install Redux DevTools (if using Redux)
3. Enable PWA debugging in Chrome DevTools

---

## ⚙️ Environment Configuration

### Production Environment Variables

**GitHub Repository Secrets**
```bash
# Required for production deployment
NEXT_PUBLIC_APP_NAME=Machikasa
NEXT_PUBLIC_BASE_URL=https://your-username.github.io/machikasa

# Optional API keys
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_api_key
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Build configuration
NODE_ENV=production
```

**next.config.js Configuration**
```javascript
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'machikasa';

const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Handle trailing slashes
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Set base path for GitHub Pages
  assetPrefix: isProd ? `/${repoName}/` : '',
  basePath: isProd ? `/${repoName}` : '',
  
  // PWA configuration
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: !isProd,
  }),
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      // Optimize for production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### Multi-Environment Setup

**Environment-specific Configs**
```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_DATA=true

# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.machikasa.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_MOCK_DATA=false

# .env.production
NEXT_PUBLIC_API_URL=https://api.machikasa.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_MOCK_DATA=false
```

---

## 🛠️ Build Optimization

### Production Build Process

**Build Scripts**
```json
{
  "scripts": {
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "build:profile": "next build --profile",
    "export": "next export",
    "build:production": "NODE_ENV=production next build && next export",
    "serve": "npx serve@latest out"
  }
}
```

**Bundle Analysis**
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle size
npm run build:analyze

# This will open bundle analysis in your browser
```

**Performance Optimizations**
```javascript
// next.config.js optimizations
const nextConfig = {
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
    
    // Enable SWC minification
    minify: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};
```

### PWA Optimization

**Service Worker Configuration**
```javascript
// next.config.js PWA settings
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-maps',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});
```

---

## 🌍 Alternative Deployment Options

### Vercel Deployment

**1. Install Vercel CLI**
```bash
npm i -g vercel
```

**2. Deploy to Vercel**
```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

**3. Vercel Configuration**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY": "@google-maps-api-key"
  }
}
```

### Netlify Deployment

**1. Build Settings**
```bash
# Build command
npm run build

# Publish directory
out

# Environment variables (in Netlify dashboard)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
NODE_ENV=production
```

**2. Netlify Configuration**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_ENV = "production"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Docker Deployment

**Dockerfile**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/out ./out

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npx", "serve", "-s", "out", "-p", "3000"]
```

**Docker Commands**
```bash
# Build image
docker build -t machikasa .

# Run container
docker run -p 3000:3000 machikasa

# Docker Compose (optional)
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Common Build Issues

**Issue: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

**Issue: Environment variables not working**
```bash
# Check environment file
cat .env.local

# Ensure variables start with NEXT_PUBLIC_ for client-side access
NEXT_PUBLIC_API_KEY=your_key  # ✅ Accessible in browser
API_KEY=your_key              # ❌ Server-side only
```

**Issue: GitHub Pages 404 errors**
```bash
# Check basePath configuration in next.config.js
# Ensure it matches your repository name
basePath: '/your-repo-name'

# Check GitHub Pages source branch
# Should be set to "GitHub Actions"
```

### PWA Issues

**Issue: Service Worker not updating**
```javascript
// Force service worker update
if ('serviceWorker' in navigator) {
  // Unregister existing service worker
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
  
  // Clear caches
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => caches.delete(cacheName));
  });
}
```

**Issue: Offline functionality not working**
```bash
# Check service worker registration
# Open Chrome DevTools → Application → Service Workers

# Verify cache storage
# Chrome DevTools → Application → Cache Storage

# Test offline mode
# Chrome DevTools → Network → Offline checkbox
```

### Performance Issues

**Issue: Large bundle size**
```bash
# Analyze bundle
npm run build:analyze

# Common solutions:
# 1. Use dynamic imports
# 2. Optimize images
# 3. Remove unused dependencies
# 4. Use tree shaking
```

**Issue: Slow initial load**
```javascript
// Implement code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Preload critical resources
<link rel="preload" href="/critical-font.woff2" as="font" type="font/woff2" crossorigin />

// Optimize images
<Image
  src="/hero.jpg"
  alt="Hero"
  priority={true}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks

**Weekly Tasks**
```bash
# Check for dependency updates
npm outdated

# Update dependencies
npm update

# Run security audit
npm audit
npm audit fix
```

**Monthly Tasks**
```bash
# Update major dependencies
npx npm-check-updates -u
npm install

# Check bundle size changes
npm run build:analyze

# Review and update documentation
```

### Automated Maintenance

**Dependabot Configuration**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "your-username"
    assignees:
      - "your-username"
```

**Security Scanning**
```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  push:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm audit
      - run: npm run lint
      - run: npm run type-check
```

### Monitoring & Analytics

**Performance Monitoring**
```javascript
// lib/analytics.ts
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

**Error Tracking**
```javascript
// lib/errorTracking.ts
class ErrorTracker {
  static logError(error: Error, context?: any) {
    console.error('Application Error:', error, context);
    
    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { extra: context });
    }
  }
  
  static logPerformance(metric: string, value: number) {
    if (process.env.NODE_ENV === 'production') {
      // Track performance metrics
      // analytics.track('performance', { metric, value });
    }
  }
}
```

---

<div align="center">

**🚀 Successful Deployment!**

**Your Machikasa app should now be live and accessible to users.**

**For support or questions, please check the [troubleshooting section](#troubleshooting) or create an issue in the repository.**

---

*This deployment guide is regularly updated with best practices and new deployment options.*

**Last Updated: December 8, 2024**

</div>