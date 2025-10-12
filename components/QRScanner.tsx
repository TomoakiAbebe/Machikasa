'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { ErrorHandler, withAsyncErrorHandling, ERROR_CODES } from '@/lib/errorHandler';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScan, onError, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive && !codeReader) {
      const reader = new BrowserMultiFormatReader();
      setCodeReader(reader);
    }

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, [isActive, codeReader, controls]);

  useEffect(() => {
    if (isActive && codeReader && videoRef.current) {
      startScanning();
    } else if (!isActive && controls) {
      controls.stop();
      setControls(null);
    }
  }, [isActive, codeReader]);

  const startScanning = withAsyncErrorHandling(
    async () => {
      if (!codeReader || !videoRef.current) return;

      setError(null);
      
      // Check camera permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      } catch (permissionError) {
        const errorDetails = ErrorHandler.handleCameraError(permissionError);
        setError(errorDetails.userMessage);
        onError?.(errorDetails.userMessage);
        setShowManualInput(true); // Automatically show manual input
        return;
      }

      const scannerControls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            onScan(result.getText());
          }
          if (error && error.name !== 'NotFoundException') {
            // Only log non-standard errors (NotFoundException is normal when no QR is found)
            if (error.name !== 'NotFoundException') {
              console.warn('Scan processing error:', error);
            }
          }
        }
      );
      setControls(scannerControls);
    },
    'QRScanner.startScanning',
    (errorDetails) => {
      setError(errorDetails.userMessage);
      onError?.(errorDetails.userMessage);
      setShowManualInput(true); // Show manual input as fallback
    }
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Camera View */}
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          className="w-full h-64 bg-black rounded-lg object-cover"
          playsInline
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 border-2 border-umbrella-blue rounded-lg pointer-events-none">
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 rounded-b-lg">
          <p className="text-sm">QRコードをカメラに向けてください</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Manual input toggle */}
      <button
        onClick={() => setShowManualInput(!showManualInput)}
        className="text-umbrella-blue hover:text-blue-700 underline text-sm"
      >
        {showManualInput ? 'カメラスキャンに戻る' : '手動でQRコードを入力'}
      </button>

      {/* Manual input form */}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="w-full max-w-md space-y-3">
          <div>
            <label htmlFor="manual-qr" className="block text-sm font-medium text-gray-700 mb-1">
              QRコード内容を入力
            </label>
            <input
              id="manual-qr"
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="machikasa://umbrella/umb-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-umbrella-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="w-full bg-umbrella-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            スキャン実行
          </button>
        </form>
      )}

      {/* Demo QR codes section */}
      <div className="w-full max-w-md">
        <details className="bg-gray-50 p-4 rounded-lg">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
            📱 デモ用QRコード
          </summary>
          <div className="space-y-2 text-xs">
            <button
              onClick={() => onScan('machikasa://umbrella/umb-001')}
              className="block w-full text-left p-2 bg-white rounded border hover:bg-gray-50"
            >
              🆔 umb-001 (福井大学正門・利用可能)
            </button>
            <button
              onClick={() => onScan('machikasa://umbrella/umb-007')}
              className="block w-full text-left p-2 bg-white rounded border hover:bg-gray-50"
            >
              🆔 umb-007 (ローソン福井大学店・利用可能)
            </button>
            <button
              onClick={() => onScan('machikasa://umbrella/umb-006')}
              className="block w-full text-left p-2 bg-white rounded border hover:bg-gray-50"
            >
              🆔 umb-006 (使用中の傘・返却テスト用)
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}