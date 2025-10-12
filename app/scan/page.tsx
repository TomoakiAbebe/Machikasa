'use client';

import { useState, useEffect } from 'react';
import { LocalDB } from '@/lib/localDB';
import { User, Umbrella, Station } from '@/types';
import QRScanner from '@/components/QRScanner';
import { PrimaryButton, SuccessButton, DangerButton } from '@/components/Button';
import { UmbrellaCard, InfoCard } from '@/components/Cards';
import { useToast } from '@/components/Toast';
import { isValidMachikasaQR, extractUmbrellaId, getRandomReturnMessage, formatDateJa, getStatusTextJa, getConditionTextJa } from '@/lib/utils';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';

export default function ScanPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scannedUmbrella, setScannedUmbrella] = useState<Umbrella | null>(null);
  const [umbrellaStation, setUmbrellaStation] = useState<Station | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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
        showToast({
          type: 'success',
          title: '貸出完了！',
          message: '傘を借りました。お気をつけてお出かけください。'
        });
        
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
        const baseMessage = getRandomReturnMessage();
        const message = result.points 
          ? `${baseMessage} +${result.points}pt獲得！`
          : baseMessage;
          
        showToast({
          type: 'success',
          title: '返却完了！',
          message: message
        });
        
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📱 QRスキャン
        </h1>
        <p className="text-gray-600">
          傘のQRコードをスキャンして借りる・返すの操作を行います
        </p>
      </div>

      {/* Current User Info */}
      {currentUser && (
        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">スキャナー</h2>
          
          {!scanActive && !scannedUmbrella && (
            <div className="text-center">
              <div className="text-6xl mb-4">📷</div>
              <PrimaryButton onClick={() => setScanActive(true)}>
                スキャンを開始
              </PrimaryButton>
            </div>
          )}

          {scanActive && (
            <div>
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
              <div className="mt-4 text-center">
                <button
                  onClick={() => setScanActive(false)}
                  className="text-gray-600 hover:text-gray-800 underline"
                >
                  スキャンを停止
                </button>
              </div>
            </div>
          )}

          {scannedUmbrella && (
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-green-600 font-medium mb-4">
                傘をスキャンしました
              </p>
              <PrimaryButton onClick={resetScan}>
                別の傘をスキャン
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Umbrella Info Section */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">傘の情報</h2>
          
          {!scannedUmbrella ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">☂️</div>
              <p>QRコードをスキャンして傘の情報を表示</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Umbrella Details */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">傘 {scannedUmbrella.id}</h3>
                    <p className="text-sm text-gray-600">
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
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">状態:</span>
                    <span className="ml-2 font-medium">
                      {getConditionTextJa(scannedUmbrella.condition)}
                    </span>
                  </div>
                  {scannedUmbrella.batteryLevel && (
                    <div>
                      <span className="text-gray-600">バッテリー:</span>
                      <span className="ml-2 font-medium">
                        {scannedUmbrella.batteryLevel}%
                      </span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-600">最終更新:</span>
                    <span className="ml-2 font-medium">
                      {formatDateJa(scannedUmbrella.lastUpdated)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {canBorrow && (
                  <SuccessButton
                    onClick={handleBorrow}
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    🚀 この傘を借りる
                  </SuccessButton>
                )}
                
                {canReturn && (
                  <PrimaryButton
                    onClick={handleReturn}
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    ✅ この傘を返却する
                  </PrimaryButton>
                )}
                
                {!canBorrow && !canReturn && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">
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
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📱 使い方のヒント</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• 傘に付いているQRコードをカメラに向けてください</li>
          <li>• カメラが使用できない場合は手動入力も可能です</li>
          <li>• デモ用のQRコードはスキャナー画面下部にあります</li>
          <li>• 傘の返却でポイントがもらえます</li>
        </ul>
      </div>
    </div>
  );
}