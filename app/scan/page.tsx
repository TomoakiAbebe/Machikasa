'use client';

import { useState, useEffect } from 'react';
import { LocalDB } from '@/lib/localDB';
import { User, Umbrella, Station } from '@/types';
import QRScanner from '@/components/QRScanner';
import { useToast } from '@/components/Toast';
import NudgeMessage, { useNudgeMessage } from '@/components/NudgeMessage';
import FullScreenMessage, { useFullScreenMessage } from '@/components/FullScreenMessage';
import { isValidMachikasaQR, extractUmbrellaId, getRandomReturnMessage, getStatusTextJa, getConditionTextJa } from '@/lib/utils';

export default function ScanPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scannedUmbrella, setScannedUmbrella] = useState<Umbrella | null>(null);
  const [umbrellaStation, setUmbrellaStation] = useState<Station | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  
  // ナッジメッセージ機能（従来版）
  const { 
    isVisible: nudgeVisible, 
    messageType: nudgeType, 
    customMessage: nudgeCustomMessage,
    showMessage: showNudgeMessage, 
    hideMessage: hideNudgeMessage 
  } = useNudgeMessage();

  // フルスクリーンメッセージ機能（新版）
  const {
    isVisible: fullScreenVisible,
    messageType: fullScreenType,
    customMessage: fullScreenCustomMessage,
    showMessage: showFullScreenMessage,
    hideMessage: hideFullScreenMessage
  } = useFullScreenMessage();

  useEffect(() => {
    LocalDB.initialize();
    setCurrentUser(LocalDB.getCurrentUser());
  }, []);

  const handleScan = (qrCode: string) => {
    console.log('Scanned QR:', qrCode);
    
    // Validate QR code format
    if (!isValidMachikasaQR(qrCode)) {
      showToast({
        type: 'error',
        title: '無効なQRコード',
        message: 'Machikasa専用のQRコードをスキャンしてください。'
      });
      return;
    }

    // Extract umbrella ID and get umbrella data
    const umbrellaId = extractUmbrellaId(qrCode);
    if (!umbrellaId) {
      showToast({
        type: 'error',
        title: 'QRコード読み取りエラー',
        message: 'QRコードから傘IDを取得できませんでした。'
      });
      return;
    }

    const umbrella = LocalDB.getUmbrella(umbrellaId);
    if (!umbrella) {
      showToast({
        type: 'error',
        title: '傘が見つかりません',
        message: 'QRコードを再確認してください。'
      });
      return;
    }

    const station = LocalDB.getStation(umbrella.stationId);
    
    setScannedUmbrella(umbrella);
    setUmbrellaStation(station);
    setScanActive(false);
    
    showToast({
      type: 'info',
      title: 'スキャン完了',
      message: '傘の情報を取得しました。'
    });
  };

  const handleBorrow = async () => {
    if (!scannedUmbrella || !currentUser) return;

    // Check for duplicate actions
    if (scannedUmbrella.status !== 'available') {
      showToast({
        type: 'warning',
        title: '操作無効',
        message: 'この傘は現在借りることができません。'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = LocalDB.borrowUmbrella(
        scannedUmbrella.id,
        currentUser.id
      );
      
      if (result.success) {
        // フルスクリーンメッセージを表示（メイン体験）
        showFullScreenMessage('borrow');
        
        // フルスクリーンメッセージの後に簡潔なトーストも表示
        setTimeout(() => {
          showToast({
            type: 'success',
            title: '借用完了 ☂️',
            message: '雨の日も安心です。返却をお忘れなく！'
          });
        }, 3800); // フルスクリーンメッセージが終わってから表示
        
        // Refresh data
        setCurrentUser(LocalDB.getCurrentUser());
        setScannedUmbrella(LocalDB.getUmbrella(scannedUmbrella.id));
      } else {
        showToast({
          type: 'error',
          title: '貸出エラー',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Borrow error:', error);
      showToast({
        type: 'error',
        title: '予期しないエラー',
        message: '貸出処理中にエラーが発生しました。再度お試しください。'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!scannedUmbrella || !currentUser) return;

    // Check for duplicate returns
    if (scannedUmbrella.status === 'available') {
      showToast({
        type: 'warning',
        title: '重複返却',
        message: 'この傘はすでに返却されています。'
      });
      return;
    }

    // Check if user has permission to return this umbrella
    if (scannedUmbrella.borrowedBy !== currentUser.id) {
      showToast({
        type: 'error',
        title: '返却権限なし',
        message: 'この傘を返却する権限がありません。'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = LocalDB.returnUmbrella(
        scannedUmbrella.id,
        currentUser.id
      );
      
      if (result.success) {
        // フルスクリーンメッセージを表示（返却のメインフィードバック）
        showFullScreenMessage('return');
        
        // フルスクリーンメッセージの後にトーストも表示（ポイント情報含む）
        setTimeout(() => {
          const baseMessage = getRandomReturnMessage();
          const message = result.points 
            ? `${baseMessage} +${result.points}pt獲得！`
            : baseMessage;
            
          showToast({
            type: 'success',
            title: '返却完了！',
            message: message
          });
        }, 3800); // フルスクリーンメッセージが終わってから表示
        
        // Refresh data
        setCurrentUser(LocalDB.getCurrentUser());
        setScannedUmbrella(LocalDB.getUmbrella(scannedUmbrella.id));
      } else {
        showToast({
          type: 'error',
          title: '返却エラー',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Return error:', error);
      showToast({
        type: 'error',
        title: '予期しないエラー',
        message: '返却処理中にエラーが発生しました。再度お試しください。'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScannedUmbrella(null);
    setUmbrellaStation(null);
    setScanActive(true);
  };

  const canBorrow = scannedUmbrella?.status === 'available';
  const canReturn = scannedUmbrella?.status === 'in_use' && scannedUmbrella?.borrowedBy === currentUser?.id;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="md:pt-16 bg-white border-b border-gray-200">
        <div className="px-4 py-4 md:px-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">📱 QRスキャン</h1>
        </div>
      </div>

      {/* Current User Info - Mobile optimized */}
      {currentUser && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{currentUser.nameJa}</p>
              <p className="text-xs text-gray-600">
                {currentUser.points}pt・借用{currentUser.totalBorrows}回・返却{currentUser.totalReturns}回
              </p>
            </div>
            <div className="text-lg">👤</div>
          </div>
        </div>
      )}

      {/* Mobile-first Scanner Experience */}
      {!scannedUmbrella ? (
        <div className="relative">
          {!scanActive ? (
            // Scan start screen - Full screen on mobile
            <div className="h-[70vh] md:h-96 flex flex-col items-center justify-center bg-gray-900 text-white">
              <div className="text-center px-6">
                <div className="text-8xl md:text-6xl mb-6">📷</div>
                <h2 className="text-2xl md:text-xl font-semibold mb-4">傘のQRコードをスキャン</h2>
                <p className="text-gray-300 mb-8 text-sm md:text-base">
                  傘に付いているQRコードをカメラに向けてください
                </p>
                <button
                  onClick={() => setScanActive(true)}
                  className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-200"
                >
                  📱 スキャン開始
                </button>
              </div>
            </div>
          ) : (
            // Active scanning - Full screen camera preview on mobile
            <div className="relative h-[70vh] md:h-96">
              <QRScanner
                isActive={scanActive}
                onScan={handleScan}
                onError={(error) => {
                  showToast({
                    type: 'error',
                    title: 'スキャンエラー',
                    message: error
                  });
                  setScanActive(false);
                }}
              />
              
              {/* Overlay controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={() => setScanActive(false)}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-white transition-all"
                >
                  ✕ スキャン停止
                </button>
              </div>
              
              {/* Scanning indicator */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  🔍 QRコードを探しています...
                </div>
              </div>
            </div>
          )}
          
          {/* Tips section - visible when not scanning */}
          {!scanActive && (
            <div className="px-4 py-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm">💡 スキャンのコツ</h3>
                <ul className="text-blue-800 text-xs space-y-1">
                  <li>• QRコードを画面中央に合わせてください</li>
                  <li>• 十分な明るさがある場所で行ってください</li>
                  <li>• コードから20-30cm離してスキャンしてください</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Scan success screen - Mobile optimized
        <div className="px-4 py-6">
          {/* Success feedback */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-3xl text-white">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">スキャン完了！</h2>
            <p className="text-green-600 font-medium">
              傘の情報を取得しました
            </p>
          </div>

          {/* Umbrella Details Card - Mobile optimized */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mx-4 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">傘 {scannedUmbrella.id}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ステーション: {umbrellaStation?.nameJa}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                scannedUmbrella.status === 'available' ? 'bg-green-100 text-green-800' :
                scannedUmbrella.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {getStatusTextJa(scannedUmbrella.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-600 block text-xs">状態</span>
                <span className="font-medium text-gray-900">
                  {getConditionTextJa(scannedUmbrella.condition)}
                </span>
              </div>
              {scannedUmbrella.batteryLevel && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-600 block text-xs">バッテリー</span>
                  <span className="font-medium text-gray-900">
                    🔋 {scannedUmbrella.batteryLevel}%
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Large mobile buttons */}
            <div className="space-y-4">
              {canBorrow && (
                <button
                  onClick={handleBorrow}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl text-lg font-semibold transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      処理中...
                    </span>
                  ) : (
                    '🚀 この傘を借りる'
                  )}
                </button>
              )}
              
              {canReturn && (
                <button
                  onClick={handleReturn}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 px-6 rounded-xl text-lg font-semibold transform hover:scale-[1.02] transition-all duration-200 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      処理中...
                    </span>
                  ) : (
                    '✅ この傘を返却する'
                  )}
                </button>
              )}
              
              {!canBorrow && !canReturn && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-gray-600 mb-2 font-medium">
                    {scannedUmbrella.status === 'in_use' 
                      ? '別のユーザーが使用中です'
                      : 'この傘は現在利用できません'
                    }
                  </p>
                  {scannedUmbrella.status === 'maintenance' && (
                    <p className="text-sm text-orange-600">
                      メンテナンス中のため利用できません
                    </p>
                  )}
                </div>
              )}
              
              <button
                onClick={resetScan}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                🔄 別の傘をスキャン
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop User Info - hidden on mobile */}
      {currentUser && (
        <div className="hidden md:block bg-white mx-4 rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentUser.nameJa}</p>
              <p className="text-sm text-gray-600">
                ポイント: {currentUser.points}pt | 
                貸出: {currentUser.totalBorrows}回 | 
                返却: {currentUser.totalReturns}回
              </p>
            </div>
            <div className="text-2xl">👤</div>
          </div>
        </div>
      )}


      {/* Instructions - Hidden on mobile unless scanning */}
      {!scanActive && (
        <div className="hidden md:block mx-4 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📱 使い方のヒント</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• 傘に付いているQRコードをカメラに向けてください</li>
            <li>• 十分な明るさがある場所で行ってください</li>
            <li>• QRコードから適切な距離を保ってください</li>
            <li>• 傘の返却でポイントがもらえます</li>
          </ul>
        </div>
      )}

      {/* フルスクリーンメッセージコンポーネント（メイン） */}
      <FullScreenMessage
        isVisible={fullScreenVisible}
        onComplete={hideFullScreenMessage}
        type={fullScreenType}
        customMessage={fullScreenCustomMessage}
      />

      {/* ナッジメッセージコンポーネント（予備/従来版） */}
      <NudgeMessage
        isVisible={nudgeVisible}
        onComplete={hideNudgeMessage}
        type={nudgeType}
        customMessage={nudgeCustomMessage}
      />
    </div>
  );
}