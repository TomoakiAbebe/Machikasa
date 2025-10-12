'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { LocalDB } from '@/lib/localDB';
import { Station, Umbrella, PartnerStore, Sponsor } from '@/types';
import StationCard from '@/components/StationCard';

// Note: In a real app, you'd load Google Maps API dynamically
// For this demo, we'll simulate map functionality with a visual representation

interface MapViewProps {
  center: { lat: number; lng: number };
  stations: Station[];
  partnerStores: PartnerStore[];
  sponsors: Sponsor[];
  onStationClick: (station: Station) => void;
  onPartnerStoreClick: (store: PartnerStore) => void;
}

function MapSimulator({ center, stations, partnerStores, sponsors, onStationClick, onPartnerStoreClick }: MapViewProps) {
  // Helper function to check if a partner store is sponsored
  const getSponsorForStore = (storeId: string) => {
    const store = partnerStores.find(s => s.id === storeId);
    return store?.sponsorId ? sponsors.find(s => s.id === store.sponsorId) : null;
  };

  return (
    <div className="relative w-full h-96 bg-green-100 rounded-lg border-2 border-green-300 overflow-hidden">
      {/* Map background with grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-green-400"></div>
          ))}
        </div>
      </div>
      
      {/* Center indicator (Fukui University) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          福井大学
        </div>
      </div>

      {/* Station markers */}
      {stations.map((station, index) => {
        // Simulate different positions around the center
        const positions = [
          { top: '40%', left: '50%' }, // Main gate
          { top: '55%', left: '45%' }, // Lawson
          { top: '70%', left: '65%' }, // Station
        ];
        const position = positions[index] || positions[0];
        
        return (
          <div
            key={station.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={position}
            onClick={() => onStationClick(station)}
          >
            <div className="bg-umbrella-blue text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors">
              <div className="flex flex-col items-center">
                <span className="text-lg">☂️</span>
                <span className="text-xs font-bold">{station.currentCount}</span>
              </div>
            </div>
            <div className="bg-white text-xs px-2 py-1 rounded shadow-md mt-1 min-w-max">
              {station.nameJa}
            </div>
          </div>
        );
      })}

      {/* Partner Store markers */}
      {partnerStores.map((store, index) => {
        const sponsor = getSponsorForStore(store.id);
        // Simulate different positions for partner stores
        const partnerPositions = [
          { top: '30%', left: '60%' }, // North East
          { top: '60%', left: '30%' }, // South West
          { top: '25%', left: '40%' }, // North West
          { top: '75%', left: '55%' }, // South East
          { top: '45%', left: '75%' }, // East
        ];
        const position = partnerPositions[index] || partnerPositions[0];
        
        return (
          <div
            key={`partner-${store.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={position}
            onClick={() => onPartnerStoreClick(store)}
          >
            <div className={`text-white rounded-full p-2 shadow-lg transition-colors ${
              sponsor ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
              <div className="flex flex-col items-center">
                <span className="text-lg">{sponsor ? '🏆' : '🏪'}</span>
                                <span className="text-xs font-bold">{store.availableUmbrellas}</span>
              </div>
            </div>
            <div className="bg-white text-xs px-2 py-1 rounded shadow-md mt-1 min-w-max">
              {store.name}
              {sponsor && <span className="text-yellow-600 ml-1">★</span>}
            </div>
          </div>
        );
      })}

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md text-xs">
        <div className="font-semibold mb-2">地図凡例</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-umbrella-blue rounded-full"></div>
            <span>傘ステーション</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>協賛加盟店 ★</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>加盟店</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>福井大学</span>
          </div>
        </div>
      </div>
      
      {/* Note about Google Maps */}
      <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 rounded p-2 text-xs">
        <p className="font-semibold">📍 マップシミュレーター</p>
        <p>実際のアプリではGoogle Maps APIを使用します</p>
      </div>
    </div>
  );
}

export default function MapPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [umbrellas, setUmbrellas] = useState<Umbrella[]>([]);
  const [partnerStores, setPartnerStores] = useState<PartnerStore[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedPartnerStore, setSelectedPartnerStore] = useState<PartnerStore | null>(null);
  const [loading, setLoading] = useState(true);

  // Center on Fukui University
  const mapCenter = { lat: 36.0668, lng: 136.2189 };

  useEffect(() => {
    // Initialize and load data
    LocalDB.initialize();
    setStations(LocalDB.getStations());
    setUmbrellas(LocalDB.getUmbrellas());
    setPartnerStores(LocalDB.getPartnerStores());
    setSponsors(LocalDB.getSponsors());
    setLoading(false);
  }, []);

  const handleStationClick = useCallback((station: Station) => {
    setSelectedStation(station);
    setSelectedPartnerStore(null); // Clear partner store selection
  }, []);

  const handlePartnerStoreClick = useCallback((store: PartnerStore) => {
    setSelectedPartnerStore(store);
    setSelectedStation(null); // Clear station selection
  }, []);

  const getStationUmbrellas = (stationId: string) => {
    return umbrellas.filter(u => u.stationId === stationId && u.status === 'available');
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
          🗺️ ステーション＆加盟店マップ
        </h1>
        <p className="text-gray-600">
          福井大学周辺の傘ステーションと加盟店を確認できます
        </p>
      </div>

      {/* Map and Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Map */}
        <div>
          <MapSimulator
            center={mapCenter}
            stations={stations}
            partnerStores={partnerStores}
            sponsors={sponsors}
            onStationClick={handleStationClick}
            onPartnerStoreClick={handlePartnerStoreClick}
          />
        </div>

        {/* Selected Location Details */}
        <div>
          {selectedStation ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">ステーション詳細</h2>
              <StationCard 
                station={selectedStation} 
                className="mb-4"
              />
              
              {/* Available umbrellas at this station */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-3">利用可能な傘</h3>
                <div className="space-y-2">
                  {getStationUmbrellas(selectedStation.id).map((umbrella) => (
                    <div key={umbrella.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span>☂️</span>
                        <span className="text-sm font-mono">{umbrella.id}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          umbrella.condition === 'good' ? 'bg-green-100 text-green-800' :
                          umbrella.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {umbrella.condition === 'good' ? '良好' :
                           umbrella.condition === 'fair' ? '普通' : '要修理'}
                        </span>
                        {umbrella.batteryLevel && (
                          <span className="text-xs text-gray-600">
                            🔋 {umbrella.batteryLevel}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {getStationUmbrellas(selectedStation.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      現在利用可能な傘はありません
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : selectedPartnerStore ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">加盟店詳細</h2>
              <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {selectedPartnerStore.name}
                      {selectedPartnerStore.sponsorId && (
                        <span className="ml-2 text-yellow-500">🏆</span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{selectedPartnerStore.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">利用可能傘</div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedPartnerStore.availableUmbrellas}
                    </div>
                  </div>
                </div>
                
                {selectedPartnerStore.hours && (
                  <div className="mb-2 text-sm">
                    <span className="text-gray-600">営業時間: </span>
                    <span>{selectedPartnerStore.hours}</span>
                  </div>
                )}
                
                {selectedPartnerStore.phone && (
                  <div className="mb-3 text-sm">
                    <span className="text-gray-600">電話: </span>
                    <span>{selectedPartnerStore.phone}</span>
                  </div>
                )}

                {/* Store Features */}
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">特徴</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedPartnerStore.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {feature === 'umbrella_station' ? '傘ステーション' :
                         feature === 'return_bonus' ? '返却ボーナス' :
                         feature === 'sponsor_benefits' ? '協賛特典' :
                         feature === 'student_discount' ? '学生割引' : feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Store Offers */}
                {selectedPartnerStore.offers.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">特典・サービス</div>
                    <div className="space-y-1">
                      {selectedPartnerStore.offers.map((offer, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
                          🎁 {offer}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                マップ上のステーションまたは加盟店をクリックして詳細を表示
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All Locations List */}
      <div className="space-y-8">
        {/* Stations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">全ステーション一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onClick={() => handleStationClick(station)}
                className={selectedStation?.id === station.id ? 'ring-2 ring-umbrella-blue' : ''}
              />
            ))}
          </div>
        </div>

        {/* Partner Stores */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">加盟店一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerStores.map((store) => {
              const sponsor = sponsors.find(s => s.id === store.sponsorId);
              return (
                <div
                  key={store.id}
                  onClick={() => handlePartnerStoreClick(store)}
                  className={`bg-white rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedPartnerStore?.id === store.id ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {store.name}
                        {sponsor && <span className="ml-2 text-yellow-500">🏆</span>}
                      </h3>
                      <p className="text-gray-600 text-sm">{store.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">利用可能</div>
                      <div className="text-lg font-bold text-green-600">{store.availableUmbrellas}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sponsor ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {sponsor ? '協賛店' : '加盟店'}
                    </span>
                    <span className="text-gray-500">
                      {store.features.includes('return_bonus') && '🎁 '}
                      {store.features.includes('student_discount') && '🎓 '}
                      {store.hours}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📍 マップの使い方</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• 青いマーカー（☂️）: 傘ステーション - 借用・返却が可能</li>
          <li>• 黄色いマーカー（🏆）: 協賛加盟店 - 特典付きで返却可能</li>
          <li>• 緑のマーカー（🏪）: 一般加盟店 - 返却可能</li>
          <li>• 数字は現在利用可能な傘の数を表示</li>
          <li>• 実際のアプリではGoogle Maps APIで正確な位置を表示</li>
          <li>• GPSで現在地からの距離も計算可能</li>
        </ul>
      </div>
    </div>
  );
}