'use client';

import { useEffect, useState } from 'react';
import { LocalDB } from '@/lib/localDB';
import { Sponsor, PartnerStore, SponsorshipDeal } from '@/types';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [partnerStores, setPartnerStores] = useState<PartnerStore[]>([]);
  const [sponsorshipDeals, setSponsorshipDeals] = useState<SponsorshipDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LocalDB.initialize();
    setSponsors(LocalDB.getSponsors());
    setPartnerStores(LocalDB.getPartnerStores());
    setSponsorshipDeals(LocalDB.getSponsorshipDeals());
    setLoading(false);
  }, []);

  const getSponsoredStores = (sponsorId: string) => {
    return partnerStores.filter(store => store.sponsorId === sponsorId);
  };

  const getSponsorDeals = (sponsorId: string) => {
    return sponsorshipDeals.filter(deal => deal.sponsorId === sponsorId && deal.active);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-2xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏆 協賛企業・パートナー
        </h1>
        <p className="text-gray-600">
          Machikasar傘シェアリングサービスをご支援いただいている企業・団体をご紹介します
        </p>
      </div>

      {/* Active Sponsors */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">協賛企業</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sponsors.filter(sponsor => sponsor.active).map((sponsor) => {
            const sponsoredStores = getSponsoredStores(sponsor.id);
            const activeDeals = getSponsorDeals(sponsor.id);
            
            return (
              <div key={sponsor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Sponsor Header */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <img 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling!.textContent = sponsor.name.charAt(0);
                        }}
                      />
                      <div className="text-2xl font-bold text-gray-700 hidden"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{sponsor.name}</h3>
                      <p className="text-yellow-100 text-sm">
                        {sponsor.category === 'local_business' ? '地域企業' :
                         sponsor.category === 'university' ? '大学・教育機関' :
                         sponsor.category === 'government' ? '自治体' :
                         sponsor.category === 'npo' ? 'NPO' : 'その他'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sponsor Content */}
                <div className="p-6">
                  {/* Message */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{sponsor.message}</p>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{sponsoredStores.length}</div>
                      <div className="text-xs text-gray-600">提携店舗</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{activeDeals.length}</div>
                      <div className="text-xs text-gray-600">特典</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">
                        {Math.floor((new Date().getTime() - new Date(sponsor.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-xs text-gray-600">協賛日数</div>
                    </div>
                  </div>

                  {/* Active Deals */}
                  {activeDeals.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">提供中の特典</h4>
                      <div className="space-y-2">
                        {activeDeals.map((deal) => (
                          <div key={deal.id} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{deal.description}</span>
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                {deal.dealType === 'points_bonus' ? `+${deal.value}pt` :
                                 deal.dealType === 'discount' ? `${deal.value}%引き` :
                                 deal.dealType === 'cashback' ? `¥${deal.value}還元` :
                                 deal.dealType === 'free_item' ? '無料特典' : '特典'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sponsored Stores */}
                  {sponsoredStores.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">提携店舗</h4>
                      <div className="flex flex-wrap gap-2">
                        {sponsoredStores.map((store) => (
                          <span key={store.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {store.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      協賛開始: {new Date(sponsor.joinedDate).toLocaleDateString('ja-JP')}
                    </div>
                    {sponsor.websiteUrl && (
                      <a 
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        公式サイト →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">協賛による特典</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-bold mb-2">返却ボーナス</h3>
            <p className="text-sm opacity-90">協賛店での傘返却時に追加ポイントを獲得</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-bold mb-2">割引特典</h3>
            <p className="text-sm opacity-90">協賛店でのお買い物時に特別割引を適用</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="text-3xl mb-2">🏪</div>
            <h3 className="font-bold mb-2">店舗連携</h3>
            <p className="text-sm opacity-90">地域の店舗との連携でより便利にサービス利用</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
            <div className="text-3xl mb-2">🌱</div>
            <h3 className="font-bold mb-2">持続可能性</h3>
            <p className="text-sm opacity-90">地域企業との協力で持続可能なサービス運営</p>
          </div>
        </div>
      </div>

      {/* Become a Sponsor CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">協賛企業募集中</h2>
        <p className="text-lg mb-6 opacity-90">
          Machikasar傘シェアリングサービスのスポンサーとして、地域コミュニティをサポートしませんか？
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-white bg-opacity-20 rounded p-4">
            <div className="font-bold mb-1">ブランド露出</div>
            <div className="opacity-80">アプリ内でのロゴ表示・店舗紹介</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded p-4">
            <div className="font-bold mb-1">顧客獲得</div>
            <div className="opacity-80">学生・地域住民へのリーチ拡大</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded p-4">
            <div className="font-bold mb-1">CSR貢献</div>
            <div className="opacity-80">持続可能な地域社会への貢献</div>
          </div>
        </div>
        <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          協賛についてお問い合わせ
        </button>
      </div>

      {/* Statistics */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">協賛効果統計</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {partnerStores.filter(store => store.sponsorId).length}
            </div>
            <div className="text-gray-600 text-sm">協賛店舗数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {sponsorshipDeals.filter(deal => deal.active).length}
            </div>
            <div className="text-gray-600 text-sm">提供中特典</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {sponsors.filter(s => s.active).length}
            </div>
            <div className="text-gray-600 text-sm">協賛企業数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600 text-sm">協賛満足度</div>
          </div>
        </div>
      </div>
    </div>
  );
}