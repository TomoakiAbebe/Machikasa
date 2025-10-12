'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Camera, User } from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: 'ホーム',
    icon: Home,
    emoji: '🏠'
  },
  {
    href: '/map',
    label: 'マップ',
    icon: MapPin,
    emoji: '🗺️'
  },
  {
    href: '/scan',
    label: 'スキャン',
    icon: Camera,
    emoji: '📱'
  },
  {
    href: '/profile',
    label: 'プロフィール',
    icon: User,
    emoji: '👤'
  }
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center
                min-w-[44px] min-h-[44px] px-2 py-1
                rounded-lg transition-all duration-200
                active:scale-95 active:bg-gray-100
                ${isActive 
                  ? 'text-blue-500 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}