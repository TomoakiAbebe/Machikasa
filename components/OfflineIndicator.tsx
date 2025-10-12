'use client';

import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Offline status indicator and handler
 * Provides user feedback when the app goes offline/online
 */
export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMode, setShowOfflineMode] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMode(false);
      showToast({
        type: 'success',
        title: 'オンラインに復帰',
        message: 'インターネット接続が復帰しました。'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMode(true);
      showToast({
        type: 'warning',
        title: 'オフラインモード',
        message: 'インターネット接続がありません。オフラインで継続します。'
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (showOfflineMode) {
      const timer = setTimeout(() => {
        setShowOfflineMode(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showOfflineMode]);

  if (!showOfflineMode && isOnline) {
    return null;
  }

  return (
    <div className="relative">
      {/* Persistent offline indicator */}
      {!isOnline && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-orange-100 border border-orange-400 text-orange-800 px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <WifiOff size={16} />
            <span className="text-sm font-medium">オフライン</span>
          </div>
        </div>
      )}

      {/* Full offline mode banner */}
      {showOfflineMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <WifiOff size={20} />
              <div>
                <h3 className="font-semibold">オフラインモード</h3>
                <p className="text-sm text-orange-100">
                  インターネット接続がありません。一部の機能が制限されます。
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOfflineMode(false)}
              className="text-orange-100 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Offline capabilities info */}
          <div className="max-w-4xl mx-auto mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-300">✓</span>
              <span>QRスキャン機能</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-300">✓</span>
              <span>傘の貸出・返却</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-300">✓</span>
              <span>ローカルデータ保存</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to get current online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}