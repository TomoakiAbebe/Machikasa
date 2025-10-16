'use client';

import { useEffect, useState, useCallback } from 'react';

interface FullScreenMessageProps {
  isVisible: boolean;
  onComplete: () => void;
  type: 'borrow' | 'return';
  customMessage?: string;
}

// 🧠 ナッジ理論に基づくメッセージプール
const FULLSCREEN_MESSAGES = {
  borrow: [
    "次の人のために、大切に使ってね☂️",
    "あなたの小さな行動が地域を変えます🌦",
    "今日のあなたが、誰かを助けています😊",
    "気をつけていってらっしゃい☂️",
    "みんなでつくる、やさしい街づくり💙",
    "雨の日も安心、コミュニティの力です🌈",
    "シェアする心が、つながりを生みます✨"
  ],
  return: [
    "ありがとう！また使ってね☂️",
    "あなたの返却で、次の人が助かります😊", 
    "今日もシェア傘をありがとう🌈",
    "小さな行動が大きな助けになります💧",
    "福井大学シェア傘、お疲れさまでした🌦",
    "コミュニティの一員として感謝します🙏",
    "次回もよろしくお願いします😊✨"
  ]
};

export default function FullScreenMessage({ 
  isVisible, 
  onComplete, 
  type,
  customMessage 
}: FullScreenMessageProps) {
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // ランダムメッセージを選択
  const getRandomMessage = useCallback(() => {
    if (customMessage) return customMessage;
    const messages = FULLSCREEN_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [customMessage, type]);

  useEffect(() => {
    if (isVisible) {
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
      
      const selectedMessage = getRandomMessage();
      setMessage(selectedMessage);
      
      // アニメーション開始
      setTimeout(() => setIsAnimating(true), 100);

      // 3秒後にフェードアウト開始
      const fadeTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 2800);

      // 3.5秒後に完全に非表示
      const completeTimer = setTimeout(() => {
        document.body.style.overflow = 'auto'; // スクロールを復元
        onComplete();
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
        document.body.style.overflow = 'auto'; // クリーンアップ
      };
    }
  }, [isVisible, getRandomMessage, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 w-screen h-screen
        flex items-center justify-center
        transition-opacity duration-700 ease-out
        ${isAnimating ? 'opacity-100' : 'opacity-0'}
      `}
      style={{
        background: type === 'borrow' 
          ? 'linear-gradient(135deg, rgba(135, 206, 250, 0.9) 0%, rgba(173, 216, 230, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(144, 238, 144, 0.9) 0%, rgba(152, 251, 152, 0.95) 100%)',
        fontFamily: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* メインメッセージテキスト */}
      <div className="px-6 text-center">
        {/* アイコン */}
        <div 
          className={`
            text-6xl md:text-8xl mb-6 md:mb-8
            transform transition-all duration-1000 delay-200
            ${isAnimating ? 'opacity-100 scale-100 rotate-12' : 'opacity-0 scale-75 rotate-0'}
          `}
        >
          {type === 'borrow' ? '☂️' : '🙏'}
        </div>

        {/* メッセージテキスト */}
        <h1 
          className={`
            text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed
            transform transition-all duration-1000 delay-500
            ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            text-shadow-lg
          `}
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          {message}
        </h1>

        {/* サブテキスト（タイプに応じて） */}
        <p 
          className={`
            text-white/90 text-lg md:text-xl mt-4 md:mt-6 font-medium
            transform transition-all duration-1000 delay-700
            ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}
        >
          {type === 'borrow' ? 'いってらっしゃい' : 'お疲れさまでした'}
        </p>
      </div>

      {/* 装飾的なパーティクル効果 */}
      {isAnimating && (
        <>
          {/* フローティング絵文字 */}
          {['💧', '☁️', '🌟', '💙', '🌈'].map((emoji, index) => (
            <div
              key={index}
              className={`
                absolute text-2xl md:text-4xl opacity-60
                animate-bounce
              `}
              style={{
                left: `${10 + (index * 15)}%`,
                top: `${20 + (index % 3) * 20}%`,
                animationDelay: `${index * 0.2}s`,
                animationDuration: `${2 + (index * 0.3)}s`
              }}
            >
              {emoji}
            </div>
          ))}

          {/* キラキラ効果 */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className={`
                absolute w-1 h-1 bg-white rounded-full
                animate-ping
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// カスタムフック：フルスクリーンメッセージの状態管理
export function useFullScreenMessage() {
  const [isVisible, setIsVisible] = useState(false);
  const [messageType, setMessageType] = useState<'borrow' | 'return'>('borrow');
  const [customMessage, setCustomMessage] = useState<string>();

  const showMessage = (
    type: 'borrow' | 'return',
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