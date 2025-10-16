'use client';

import { useEffect, useState, useCallback } from 'react';

interface NudgeMessageProps {
  isVisible: boolean;
  onComplete: () => void;
  type?: 'return' | 'borrow' | 'general';
  customMessage?: string;
}

// ランダムメッセージのプール（ナッジ理論に基づく）
const NUDGE_MESSAGES = {
  return: [
    "ありがとう！また使ってね☂️",
    "あなたの返却で、次の人が助かります😊", 
    "福井大学シェア傘、今日もありがとう🌦",
    "小さな行動が大きな助けになります💧",
    "Good job returning your umbrella! 🎉"
  ],
  // 🧠 ナッジ理論に基づく借用メッセージ
  // - 社会的つながり ("次の人のために")
  // - 感情的な温かさ ("今日のあなたが誰かを助けています")
  // - 自己効力感 ("あなたの小さな行動が地域を変えます")
  borrow: [
    "次の人のために、大切に使ってね☂️",
    "あなたの小さな行動が地域を変えます🌦",
    "今日のあなたが、誰かを助けています😊",
    "気をつけていってらっしゃい☂️",
    "みんなでつくる、やさしい街づくり�",
    "雨の日も安心、コミュニティの力です🌈",
    "シェアする心が、つながりを生みます✨"
  ],
  general: [
    "ありがとうございます！",
    "また利用してくださいね😊",
    "コミュニティの一員として感謝します🙏"
  ]
};

export default function NudgeMessage({ 
  isVisible, 
  onComplete, 
  type = 'return',
  customMessage 
}: NudgeMessageProps) {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // ランダムメッセージを選択（useCallbackでメモ化）
  const getRandomMessage = useCallback(() => {
    if (customMessage) return customMessage;
    const messages = NUDGE_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [customMessage, type]);

  useEffect(() => {
    if (isVisible) {
      const selectedMessage = getRandomMessage();
      setMessage(selectedMessage);
      setIsAnimating(true);
      setShowParticles(true);

      // 2.5秒後にフェードアウト開始
      const fadeTimer = setTimeout(() => {
        setIsAnimating(false);
        setShowParticles(false);
      }, 2500);

      // 3秒後に完全に非表示
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, getRandomMessage, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* 温かい色調のオーバーレイ背景 - ライトブルーのグラデーション */}
      <div 
        className={`
          absolute inset-0 transition-opacity duration-500
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: type === 'borrow' 
            ? 'linear-gradient(135deg, rgba(135, 206, 250, 0.85) 0%, rgba(173, 216, 230, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(144, 238, 144, 0.85) 0%, rgba(152, 251, 152, 0.9) 100%)'
        }}
      />
      
      {/* メインメッセージカード - より丸みを帯びた、温かいデザイン */}
      <div 
        className={`
          relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mx-4 max-w-sm
          transform transition-all duration-800 ease-out
          ${isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-90 translate-y-8'
          }
        `}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)'
        }}
      >
        {/* 温かみのある装飾要素 */}
        <div className="absolute -top-4 -right-4">
          <div 
            className={`
              w-10 h-10 rounded-full transform transition-all duration-1000 flex items-center justify-center text-white text-lg
              ${isAnimating ? 'scale-100 rotate-180' : 'scale-0 rotate-0'}
              ${type === 'borrow' 
                ? 'bg-gradient-to-br from-blue-400 to-blue-500' 
                : 'bg-gradient-to-br from-green-400 to-green-500'
              }
            `}
            style={{
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            {type === 'return' ? '🙏' : type === 'borrow' ? '☂️' : '😊'}
          </div>
        </div>

        {/* メッセージテキスト - より感動的なスタイリング */}
        <div className="text-center">
          <div 
            className={`
              text-4xl mb-6 transform transition-all duration-600 delay-200
              ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
            `}
          >
            {type === 'return' ? '�' : type === 'borrow' ? '🌟' : '😊'}
          </div>
          
          <p 
            className={`
              text-xl text-gray-700 font-medium leading-relaxed text-center px-2
              transform transition-all duration-600 delay-400
              ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ 
              fontFamily: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {message}
          </p>
        </div>

        {/* 優しいパーティクル効果 */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-1.5 h-1.5 rounded-full animate-bounce transition-opacity duration-300
                  ${isAnimating ? 'opacity-40' : 'opacity-0'}
                  ${type === 'borrow' ? 'bg-blue-300' : 'bg-green-300'}
                `}
                style={{
                  left: `${5 + (i * 7)}%`,
                  top: `${15 + (i % 4) * 15}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '2s',
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ハート・傘のフローティングアニメーション */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {['💧', '☂️', '💙'].map((emoji, i) => (
            <div
              key={i}
              className={`
                absolute text-2xl transform transition-all duration-2000 ease-out
                ${isAnimating ? 'opacity-0 -translate-y-20' : 'opacity-100 translate-y-0'}
              `}
              style={{
                left: `${30 + (i * 20)}%`,
                top: '60%',
                animationDelay: `${i * 0.3}s`
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 便利なフック：メッセージ表示の状態管理
export function useNudgeMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [messageType, setMessageType] = useState<'return' | 'borrow' | 'general'>('return');
  const [customMessage, setCustomMessage] = useState<string>();

  const showMessage = (
    type: 'return' | 'borrow' | 'general' = 'return',
    custom?: string
  ) => {
    setMessageType(type);
    setCustomMessage(custom);
    setIsVisible(true);
  };

  const hideMessage = () => {
    setIsVisible(false);
    setCustomMessage(undefined);
  };

  return {
    isVisible,
    messageType,
    customMessage,
    showMessage,
    hideMessage
  };
}