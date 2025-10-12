import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SponsorCarousel from '@/components/SponsorCarousel';
import OfflineIndicator from '@/components/OfflineIndicator';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

const basePath = process.env.NODE_ENV === 'production' ? '/MachiKasa' : '';

export const metadata: Metadata = {
  title: 'Machikasa - 福井大学傘シェア',
  description: 'Local umbrella sharing app prototype for Fukui University',
  keywords: ['umbrella', 'sharing', 'fukui', 'university', 'community'],
  manifest: `${basePath}/manifest.json`,
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: `${basePath}/icon-192x192.svg`, sizes: '192x192', type: 'image/svg+xml' },
      { url: `${basePath}/icon-512x512.svg`, sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: [
      { url: `${basePath}/icon-192x192.svg`, sizes: '192x192', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Machikasa" />
      </head>
      <body className={`${inter.className} bg-machikasa-neutral min-h-screen`}>
        <ToastProvider>
          <OfflineIndicator />
          <Navbar />
          <main className="pb-4">
            {children}
          </main>
          <SponsorCarousel />
        </ToastProvider>
      </body>
    </html>
  );
}