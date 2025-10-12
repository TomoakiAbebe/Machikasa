'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LocalDB } from '@/lib/localDB';
import { User } from '@/types';
import { getRoleTextJa } from '@/lib/utils';
import { Home, MapPin, Camera, User as UserIcon, Settings, RotateCcw, Award } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize and get current user on client side
  useEffect(() => {
    LocalDB.initialize();
    setCurrentUser(LocalDB.getCurrentUser());
  }, []);

  const navItems = [
    { href: '/', label: 'ホーム', icon: Home, emoji: '🏠' },
    { href: '/map', label: 'マップ', icon: MapPin, emoji: '🗺️' },
    { href: '/scan', label: 'スキャン', icon: Camera, emoji: '📱' },
    { href: '/sponsors', label: '協賛', icon: Award, emoji: '🏆' },
    { href: '/profile', label: 'プロフィール', icon: UserIcon, emoji: '👤' },
    { href: '/admin', label: '管理', icon: Settings, emoji: '⚙️' },
  ];

  const switchUser = () => {
    const users = LocalDB.getUsers();
    const currentIndex = users.findIndex(u => u.id === currentUser?.id);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextUser = users[nextIndex];
    
    LocalDB.setCurrentUser(nextUser);
    setCurrentUser(nextUser);
  };

  return (
    <>
      {/* Desktop Header */}
      <nav className="hidden md:block bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl">☂️</span>
              <Link href="/" className="text-xl font-bold text-machikasa-blue">
                Machikasa
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-card text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-machikasa-blue text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-machikasa-blue'
                    }`}
                    aria-label={item.label}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Switch Button */}
            {currentUser && (
              <button
                onClick={switchUser}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-card hover:bg-gray-200 transition-all duration-200 text-sm"
                title="ユーザーを切り替える (デモ用)"
                aria-label="Switch user for demo"
              >
                <span className="text-gray-700">
                  {currentUser.nameJa}
                </span>
                <RotateCcw className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-machikasa-blue bg-blue-50'
                    : 'text-gray-500 hover:text-machikasa-blue active:scale-95'
                }`}
                aria-label={item.label}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? 'text-machikasa-blue' : 'text-gray-400'}`} />
                <span className={`${isActive ? 'text-machikasa-blue font-semibold' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-machikasa-blue rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* User Switch for Mobile (Top overlay) */}
        {currentUser && (
          <div className="absolute -top-10 left-2 right-2">
            <button
              onClick={switchUser}
              className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-card hover:bg-gray-200 transition-all duration-200 text-xs border border-gray-200"
              title="ユーザーを切り替える (デモ用)"
              aria-label="Switch user for demo"
            >
              <span className="text-gray-700 truncate">
                {currentUser.nameJa} ({getRoleTextJa(currentUser.role)})
              </span>
              <RotateCcw className="h-3 w-3 text-gray-500 flex-shrink-0" />
            </button>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-16" />
      <div className="md:hidden h-16" />
    </>
  );
}