# Machikasa GitHub Pages デプロイメントガイド

## 🚀 自動デプロイメント設定

### 1. リポジトリ準備

```bash
# リポジトリをフォークまたはクローン
git clone https://github.com/YOUR_USERNAME/MachiKasa.git
cd MachiKasa

# 依存関係インストール
npm install

# ローカルテスト
npm run dev
```

### 2. GitHub Pages 設定

1. **GitHub リポジトリ設定**
   - Settings → Pages に移動
   - Source: "GitHub Actions" を選択
   - Save をクリック

2. **ワークフロー有効化**
   - `.github/workflows/deploy.yml` が自動的に検出される
   - main ブランチへのプッシュで自動デプロイが開始

### 3. デプロイ実行

```bash
# 変更をコミット・プッシュ
git add .
git commit -m "feat: setup GitHub Pages deployment"
git push origin main
```

### 4. デプロイ確認

- **Actions タブ**: ワークフローの実行状況を確認
- **Environments**: デプロイ履歴を確認
- **URL**: `https://YOUR_USERNAME.github.io/MachiKasa/`

## 🔧 手動デプロイ（代替手順）

### ローカルビルド & アップロード

```bash
# 1. 静的ファイル生成
npm run build

# 2. ビルド結果確認
ls -la out/

# 3. GitHub Pages設定
# - Source: "Deploy from a branch"
# - Branch: gh-pages または main
# - Folder: / (root) または /docs
```

### GitHub Actions無しのデプロイ

```bash
# gh-pagesブランチを作成
git checkout --orphan gh-pages
git rm -rf .
cp -r out/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## ⚙️ 設定ファイル詳細

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // GitHub Pages用
  },
  output: 'export',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/MachiKasa' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/MachiKasa' : '',
};
```

### package.json scripts
```json
{
  "scripts": {
    "build": "next build",
    "export": "next build && next export"
  }
}
```

## 🐛 トラブルシューティング

### よくある問題

1. **404 エラー**
   - `trailingSlash: true` が設定されているか確認
   - リンクが `/` で終わっているか確認

2. **CSS/JS読み込みエラー**
   - `assetPrefix` と `basePath` が正しく設定されているか確認
   - ブラウザの開発者ツールでパスを確認

3. **PWA機能が動作しない**
   - HTTPS環境（GitHub Pages）で動作することを確認
   - Service Worker の登録状況を確認

### デバッグ方法

```bash
# ローカルで静的ファイルをテスト
npx serve out/ -s

# GitHub Pages環境をシミュレート
npx serve out/ -s --rewrite

# ビルドログ確認
npm run build --verbose
```

## 📊 パフォーマンス最適化

### ビルド最適化
- Tree shaking: 未使用コードの自動削除
- Code splitting: ページごとの分割読み込み
- Image optimization: disabled（GitHub Pages制限）

### キャッシュ戦略
- Static assets: 長期キャッシュ
- Service Worker: オフライン対応
- PWA: インストール可能

## 🔄 継続的インテグレーション

### ワークフロー詳細

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch: # 手動実行可能

jobs:
  build:
    - Lint & Test
    - Build & Export
    - Upload Artifact
  
  deploy:
    - Deploy to Pages
    - Verify Deployment
```

### 環境変数（必要に応じて）
```bash
# GitHub Secrets に設定
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

## ✅ デプロイ成功確認

1. **URL アクセス**: `https://YOUR_USERNAME.github.io/MachiKasa/`
2. **PWA 機能**: ホーム画面追加が可能
3. **レスポンシブ**: モバイル・デスクトップ対応
4. **オフライン**: Service Worker 動作
5. **パフォーマンス**: Lighthouse スコア確認

---

**最終更新**: 2025年10月12日  
**対応バージョン**: Next.js 15.5.4, GitHub Actions v4