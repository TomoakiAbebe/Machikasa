'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LocalDB } from '@/lib/localDB';
import { User, Station, Transaction } from '@/types';
import { StationCard, TransactionCard, InfoCard } from '@/components/Cards';
import { PrimaryButton, SecondaryButton } from '@/components/Button';
import FloatingActionButton from '@/components/FloatingActionButton';
import { MapPin, Camera, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize LocalDB and load data
    LocalDB.initialize();
    setCurrentUser(LocalDB.getCurrentUser());
    setStations(LocalDB.getStations());
    
    // Load recent transactions for current user
    const user = LocalDB.getCurrentUser();
    if (user) {
      setRecentTransactions(LocalDB.getUserTransactions(user.id, 3));
    }
  }, []);

  const totalUmbrellas = stations.reduce((sum, station) => sum + station.currentCount, 0);
  const totalCapacity = stations.reduce((sum, station) => sum + station.capacity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 space-y-6">
        {/* Mobile Hero Section */}
        <div className="text-center pt-8 pb-6 md:pt-4 md:pb-2">
          <div className="mb-6">
            <span className="text-6xl block mb-4">☂️</span>
            <h1 className="text-heading-xl mb-3">
              MachiKasa
            </h1>
          </div>
          <p className="text-heading-md text-gray-800 mb-2">福井大学傘シェア</p>
          <p className="text-body mb-8">
            雨の日をみんなで支える<br className="md:hidden" />
            地域コミュニティの傘シェアリング
          </p>
        </div>

        {/* Mobile Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-500 mb-1">{totalUmbrellas}</div>
            <div className="text-caption">利用可能</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-success mb-1">{stations.length}</div>
            <div className="text-caption">ステーション</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-amber-600 mb-1">{currentUser?.points || 0}</div>
            <div className="text-caption">ポイント</div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="space-y-4">
          <Link href="/map" className="block">
            <button className="w-full bg-blue-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg
                             flex items-center justify-center space-x-3 shadow-sm
                             active:scale-95 transition-transform duration-150">
              <MapPin className="h-6 w-6" />
              <span>ステーションを見る</span>
            </button>
          </Link>
          <Link href="/scan" className="block">
            <button className="w-full bg-white border-2 border-blue-500 text-blue-500 py-4 px-6 rounded-2xl 
                             font-semibold text-lg flex items-center justify-center space-x-3 shadow-sm
                             active:scale-95 transition-transform duration-150">
              <Camera className="h-6 w-6" />
              <span>QRコードをスキャン</span>
            </button>
          </Link>
        </div>

        {/* Mobile How it Works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">使い方</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="text-4xl flex-shrink-0">🔍</div>
                <div>
                  <h3 className="text-base font-semibold mb-2">1. ステーションを探す</h3>
                  <p className="text-sm text-gray-600">
                    マップで近くの傘ステーションを確認し、利用可能な傘があるか調べます
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-card p-4 shadow-card">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">📱</div>
                <div>
                  <h3 className="text-base font-semibold mb-2">2. QRコードをスキャン</h3>
                  <p className="text-sm text-gray-600">
                    傘のQRコードをスマホでスキャンして借りる・返すの操作を行います
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-card p-4 shadow-card">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">🎉</div>
                <div>
                  <h3 className="text-base font-semibold mb-2">3. ポイント獲得</h3>
                  <p className="text-sm text-gray-600">
                    傘を返却するとポイントがもらえます。コミュニティに貢献しましょう！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {currentUser && recentTransactions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">最近の利用履歴</h2>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        )}

        {/* Nearby Stations */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">近くのステーション</h2>
            <Link href="/map" className="text-machikasa-blue hover:text-blue-600 font-medium text-sm">
              すべて見る →
            </Link>
          </div>
          <div className="space-y-3">
            {stations.slice(0, 3).map((station) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm space-y-2 pb-6">
          <p>
            🌱 Machikasaは福井大学の地域コミュニティプロジェクトです
          </p>
          <p>
            困ったときは最寄りのステーション管理者にお声がけください
          </p>
        </div>
      </div>
      
      {/* Floating Action Button for Quick Scan */}
      <FloatingActionButton />
    </div>
  );
}