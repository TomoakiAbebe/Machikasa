# 🚀 Machikasa Deployment Guide

## Quick Deployment Commands

### 1. Create GitHub Repository

**Option A: Via GitHub Website (Recommended)**
1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `machikasa-prototype` or `MachiKasa`
3. Description: `Offline-first umbrella sharing app prototype for Fukui University`
4. Visibility: **Public**
5. **DO NOT** initialize with README (already exists)
6. Click "Create repository"

**Option B: Via GitHub CLI (if installed)**
```bash
gh repo create machikasa-prototype --public --source=. --remote=origin --description "Offline-first umbrella sharing app prototype for Fukui University"
```

### 2. Push to GitHub

Replace `<your-username>` with your GitHub username:

```bash
# Add remote origin
git remote add origin https://github.com/<your-username>/machikasa-prototype.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Vercel (Recommended)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel --prod
```

**Auto-Deploy Setup:**
1. Go to [https://vercel.com/import/git](https://vercel.com/import/git)
2. Import your GitHub repository
3. Project settings will be auto-detected
4. Click "Deploy"
5. Your app will be live at `https://machikasa-prototype.vercel.app`

### 4. Deploy to GitHub Pages (Alternative)

```bash
# Enable GitHub Pages deployment
npm run deploy:github
```

Then:
1. Go to Repository → Settings → Pages
2. Source: Deploy from branch `gh-pages`
3. Your app will be live at `https://<username>.github.io/machikasa-prototype/`

## 🔧 Environment Variables (Optional)

If you add real Google Maps API:

**For Vercel:**
- Dashboard → Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`

**For Local Development:**
Create `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

## ✅ Verification Steps

After deployment:
1. **Test Live Site**: Visit your deployed URL
2. **PWA Installation**: Try "Add to Home Screen"
3. **Offline Mode**: Disable network and test functionality
4. **Mobile Responsive**: Test on mobile devices
5. **QR Scanning**: Test QR code functionality

## 📊 Repository Topics

Add these topics to your GitHub repository for better discoverability:
- `nextjs`
- `typescript`
- `tailwindcss`
- `pwa`
- `offline-first`
- `prototype`
- `umbrella-sharing`
- `fukui-university`
- `localstorage`

## 🤝 Post-Deployment

1. **Enable Discussions**: Repository → Settings → Features → Discussions
2. **Create Issues Templates**: .github/ISSUE_TEMPLATE/
3. **Add Contributing Guide**: CONTRIBUTING.md
4. **Share Demo**: Send link to stakeholders

## 🔧 Troubleshooting

**Build Fails:**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**GitHub Pages 404:**
- Check `basePath` in `next.config.js`
- Ensure `trailingSlash: true`

**PWA Not Working:**
- Must be served over HTTPS (Vercel/GitHub Pages provide this)
- Check Service Worker registration in browser dev tools

---

**Ready to Deploy!** 🚀

Your Machikasa prototype is now ready for public deployment and sharing.