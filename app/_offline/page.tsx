'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      window.location.reload();
    };
    
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">📶</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            オフラインです
          </h1>
          <p className="text-gray-600 mb-6">
            インターネット接続を確認してください。接続が回復すると自動的に再読み込みされます。
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            オフラインで利用可能な機能
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              キャッシュされたページの閲覧
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              過去の利用履歴の確認
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              プロフィール情報の表示
            </li>
          </ul>
        </div>

        <div className="text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isOnline ? 'オンライン' : 'オフライン'}
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    </div>
  );
}