'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LocalDB } from '@/lib/localDB';
import { User, Station, Transaction } from '@/types';
import { StationCard, TransactionCard, InfoCard } from '@/components/Cards';
import { PrimaryButton, SecondaryButton } from '@/components/Button';
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
    <div className="min-h-screen bg-machikasa-neutral">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center pt-4 pb-2">
          <div className="mb-4">
            <span className="text-5xl md:text-6xl block mb-3">☂️</span>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Machikasa
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium">福井大学傘シェアサービス</p>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            雨の日をみんなで支える、地域コミュニティの傘シェアリング
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <InfoCard
            title="利用可能"
            value={totalUmbrellas}
            subtitle="本の傘"
            icon={<TrendingUp className="h-5 w-5" />}
            color="blue"
          />
          <InfoCard
            title="ステーション"
            value={stations.length}
            subtitle="箇所"
            icon={<MapPin className="h-5 w-5" />}
            color="green"
          />
          <InfoCard
            title="ポイント"
            value={currentUser?.points || 0}
            subtitle="pt"
            icon={<span className="text-lg">🎯</span>}
            color="yellow"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/map" className="block">
            <PrimaryButton size="lg" fullWidth icon={<MapPin className="h-5 w-5" />}>
              ステーションを見る
            </PrimaryButton>
          </Link>
          <Link href="/scan" className="block">
            <SecondaryButton size="lg" fullWidth icon={<Camera className="h-5 w-5" />}>
              QRスキャン
            </SecondaryButton>
          </Link>
        </div>

        {/* How it Works */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">使い方</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-card p-4 shadow-card">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0">🔍</div>
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
    </div>
  );
}