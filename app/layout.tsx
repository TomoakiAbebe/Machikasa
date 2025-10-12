import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNavBar from '@/components/BottomNavBar';
import SponsorCarousel from '@/components/SponsorCarousel';
import OfflineIndicator from '@/components/OfflineIndicator';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Machikasa - 福井大学傘シェア',
  description: '福井大学での傘シェアサービス - 雨の日をもっと快適に。QRコードでかんたん貸出・返却',
  keywords: ['umbrella', 'sharing', 'fukui', 'university', 'community', '傘', 'シェア', '福井大学', 'QR'],
  manifest: '/Machikasa/manifest.json',
  themeColor: '#3b82f6',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Machikasa',
    startupImage: [
      {
        url: '/Machikasa/icon-512x512.svg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/Machikasa/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/Machikasa/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/Machikasa/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }
    ]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
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
        <link rel="manifest" href="/Machikasa/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Machikasa" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen text-base`}>
        <ToastProvider>
          <OfflineIndicator />
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          
          {/* Main Content with mobile-first spacing */}
          <main className="pb-20 md:pb-4 min-h-screen">
            <div className="max-w-md mx-auto md:max-w-7xl">
              {children}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden">
            <BottomNavBar />
          </div>
          
          {/* Sponsor Carousel - hidden on mobile for cleaner experience */}
          <div className="hidden md:block">
            <SponsorCarousel />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}