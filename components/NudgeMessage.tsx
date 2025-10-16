'use client';

import { useEffect, useState } from 'react';

interface NudgeMessageProps {
  isVisible: boolean;
  onComplete: () => void;
  type?: 'return' | 'borrow' | 'general';
  customMessage?: string;
}

// ランダムメッセージのプール（タイプ別）
const NUDGE_MESSAGES = {
  return: [
    "ありがとう！また使ってね☂️",
    "あなたの返却で、次の人が助かります😊", 
    "福井大学シェア傘、今日もありがとう🌦",
    "小さな行動が大きな助けになります💧",
    "Good job returning your umbrella! 🎉"
  ],
  borrow: [
    "雨の日も安心！気をつけて行ってらっしゃい☂️",
    "傘を大切に使ってくださいね😊",
    "お疲れさまです！忘れずに返却をお願いします🌈"
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

  // ランダムメッセージを選択
  const getRandomMessage = () => {
    if (customMessage) return customMessage;
    const messages = NUDGE_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

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
  }, [isVisible, type, customMessage, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* オーバーレイ背景 */}
      <div 
        className={`
          absolute inset-0 bg-black/20 transition-opacity duration-500
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
      />
      
      {/* メインメッセージカード */}
      <div 
        className={`
          relative bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 mx-4 max-w-sm
          transform transition-all duration-700 ease-out
          ${isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
      >
        {/* アニメーション用の装飾 */}
        <div className="absolute -top-4 -right-4">
          <div 
            className={`
              w-8 h-8 bg-blue-500 rounded-full transform transition-all duration-1000
              ${isAnimating ? 'scale-100 rotate-180' : 'scale-0 rotate-0'}
            `}
          >
            <div className="flex items-center justify-center h-full text-white text-sm">
              ☂️
            </div>
          </div>
        </div>

        {/* メッセージテキスト */}
        <div className="text-center">
          <div 
            className={`
              text-2xl mb-4 transform transition-all duration-500 delay-200
              ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            {type === 'return' ? '🙏' : type === 'borrow' ? '☂️' : '😊'}
          </div>
          
          <p 
            className={`
              text-lg text-gray-800 font-medium leading-relaxed
              transform transition-all duration-500 delay-300
              ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
            style={{ fontFamily: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {message}
          </p>
        </div>

        {/* パーティクル効果（CSS-only） */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`
                  absolute w-2 h-2 bg-blue-400 rounded-full animate-bounce
                  ${isAnimating ? 'opacity-60' : 'opacity-0'}
                `}
                style={{
                  left: `${10 + (i * 10)}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s'
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