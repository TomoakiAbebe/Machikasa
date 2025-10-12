// Localization utilities for Machikasa
// まちかさ多言語対応ユーティリティ

export type Language = 'ja' | 'en';

// Core app messages
export const messages = {
  ja: {
    // Navigation
    nav: {
      home: 'ホーム',
      map: 'マップ',
      scan: 'スキャン',
      sponsors: '協賛',
      profile: 'プロフィール',
      admin: '管理'
    },
    
    // Home page
    home: {
      title: 'Machikasa',
      subtitle: '福井大学傘シェアリングサービス',
      welcome: 'ようこそ',
      description: 'QRコードをスキャンして、雨の日も快適に過ごしましょう。',
      getStarted: '利用を開始',
      howItWorks: '使い方',
      scanQR: 'QRスキャン',
      borrowReturn: '借用・返却',
      earnPoints: 'ポイント獲得'
    },
    
    // Actions
    actions: {
      borrow: '借りる',
      return: '返す',
      scan: 'スキャン',
      confirm: '確認',
      cancel: 'キャンセル',
      close: '閉じる',
      save: '保存',
      delete: '削除',
      edit: '編集',
      export: 'エクスポート',
      reset: 'リセット'
    },
    
    // Status messages
    status: {
      loading: '読み込み中...',
      success: '成功',
      error: 'エラー',
      warning: '警告',
      completed: '完了しました',
      processing: '処理中...'
    },
    
    // Umbrella actions
    umbrella: {
      borrowed: '傘を借りました',
      returned: '傘を返却しました',
      borrowSuccess: '傘の借用が完了しました☂️',
      returnSuccess: '傘の返却が完了しました🌈\n次の人のためにありがとうございます！',
      borrowError: '傘の借用に失敗しました',
      returnError: '傘の返却に失敗しました',
      alreadyBorrowed: 'この傘は既に借用されています',
      alreadyReturned: 'この傘は既に返却されています',
      notFound: '傘が見つかりません'
    },
    
    // Profile
    profile: {
      title: 'プロフィール',
      subtitle: 'あなたのMachikasaアカウント情報',
      totalBorrows: '総貸出回数',
      totalReturns: '総返却回数',
      currentPoints: '現在のポイント',
      streak: '連続返却回数',
      memberSince: '登録日',
      lastLogin: '最終ログイン',
      transactionHistory: '最近の利用履歴',
      noTransactions: 'まだ利用履歴がありません',
      currentlyBorrowed: '現在借用中'
    },
    
    // Admin
    admin: {
      title: '管理者ダッシュボード',
      subtitle: 'Machikasa 傘シェアサービス管理画面',
      totalUmbrellas: '総傘数',
      activeStations: '稼働ステーション',
      totalUsers: '総ユーザー数',
      dailyTransactions: '本日の取引',
      lastUpdated: '最終更新',
      exportData: 'データエクスポート',
      resetData: '全データリセット'
    },
    
    // Sponsors
    sponsors: {
      title: '協賛企業・パートナー',
      subtitle: 'Machikasa傘シェアリングサービスをご支援いただいている企業・団体をご紹介します',
      partnerStores: '提携店舗',
      activeSponsorships: '提供中特典',
      sponsorSince: '協賛開始',
      officialSite: '公式サイト',
      contactUs: '協賛についてお問い合わせ'
    },
    
    // Map
    map: {
      title: 'ステーション＆加盟店マップ',
      subtitle: '福井大学周辺の傘ステーションと加盟店を確認できます',
      stationDetails: 'ステーション詳細',
      partnerStoreDetails: '加盟店詳細',
      availableUmbrellas: '利用可能な傘',
      businessHours: '営業時間',
      features: '特徴',
      offers: '特典・サービス'
    },
    
    // QR Scanner
    scan: {
      title: 'QRスキャナー',
      subtitle: '傘のQRコードをスキャンして借用・返却',
      scanInstructions: 'カメラを傘のQRコードに向けてください',
      manualInput: '手動入力',
      enterCode: 'コードを入力',
      cameraPermission: 'カメラの使用許可が必要です',
      enableCamera: 'カメラを有効にする'
    },
    
    // Common
    common: {
      points: 'ポイント',
      umbrellas: '傘',
      stations: 'ステーション',
      users: 'ユーザー',
      today: '今日',
      week: '週',
      month: '月',
      year: '年',
      all: 'すべて'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      map: 'Map',
      scan: 'Scan',
      sponsors: 'Sponsors',
      profile: 'Profile',
      admin: 'Admin'
    },
    
    // Home page
    home: {
      title: 'Machikasa',
      subtitle: 'Fukui University Umbrella Sharing Service',
      welcome: 'Welcome',
      description: 'Scan QR codes to stay comfortable on rainy days.',
      getStarted: 'Get Started',
      howItWorks: 'How It Works',
      scanQR: 'Scan QR',
      borrowReturn: 'Borrow & Return',
      earnPoints: 'Earn Points'
    },
    
    // Actions
    actions: {
      borrow: 'Borrow',
      return: 'Return',
      scan: 'Scan',
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export',
      reset: 'Reset'
    },
    
    // Status messages
    status: {
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      completed: 'Completed',
      processing: 'Processing...'
    },
    
    // Umbrella actions
    umbrella: {
      borrowed: 'Umbrella borrowed',
      returned: 'Umbrella returned',
      borrowSuccess: 'Umbrella borrowed successfully ☂️',
      returnSuccess: 'Umbrella returned successfully 🌈\nThank you for helping the next person!',
      borrowError: 'Failed to borrow umbrella',
      returnError: 'Failed to return umbrella',
      alreadyBorrowed: 'This umbrella is already borrowed',
      alreadyReturned: 'This umbrella is already returned',
      notFound: 'Umbrella not found'
    },
    
    // Profile
    profile: {
      title: 'Profile',
      subtitle: 'Your Machikasa account information',
      totalBorrows: 'Total Borrows',
      totalReturns: 'Total Returns',
      currentPoints: 'Current Points',
      streak: 'Return Streak',
      memberSince: 'Member Since',
      lastLogin: 'Last Login',
      transactionHistory: 'Recent Transaction History',
      noTransactions: 'No transaction history yet',
      currentlyBorrowed: 'Currently Borrowed'
    },
    
    // Admin
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Machikasa Umbrella Sharing Service Management',
      totalUmbrellas: 'Total Umbrellas',
      activeStations: 'Active Stations',
      totalUsers: 'Total Users',
      dailyTransactions: "Today's Transactions",
      lastUpdated: 'Last Updated',
      exportData: 'Export Data',
      resetData: 'Reset All Data'
    },
    
    // Sponsors
    sponsors: {
      title: 'Sponsors & Partners',
      subtitle: 'Companies and organizations supporting the Machikasa umbrella sharing service',
      partnerStores: 'Partner Stores',
      activeSponsorships: 'Active Benefits',
      sponsorSince: 'Sponsor Since',
      officialSite: 'Official Site',
      contactUs: 'Contact Us About Sponsorship'
    },
    
    // Map
    map: {
      title: 'Stations & Partner Store Map',
      subtitle: 'Check umbrella stations and partner stores around Fukui University',
      stationDetails: 'Station Details',
      partnerStoreDetails: 'Partner Store Details',
      availableUmbrellas: 'Available Umbrellas',
      businessHours: 'Business Hours',
      features: 'Features',
      offers: 'Benefits & Services'
    },
    
    // QR Scanner
    scan: {
      title: 'QR Scanner',
      subtitle: 'Scan umbrella QR codes to borrow or return',
      scanInstructions: 'Point the camera at the umbrella QR code',
      manualInput: 'Manual Input',
      enterCode: 'Enter Code',
      cameraPermission: 'Camera permission required',
      enableCamera: 'Enable Camera'
    },
    
    // Common
    common: {
      points: 'Points',
      umbrellas: 'Umbrellas',
      stations: 'Stations',
      users: 'Users',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      all: 'All'
    }
  }
} as const;

// Get current language from browser or localStorage
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'ja';
  
  const stored = localStorage.getItem('machikasa_language');
  if (stored && (stored === 'ja' || stored === 'en')) {
    return stored as Language;
  }
  
  // Default to Japanese for Japanese browsers, English otherwise
  const browserLang = navigator.language || navigator.languages[0];
  return browserLang.startsWith('ja') ? 'ja' : 'en';
}

// Set language preference
export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('machikasa_language', lang);
  }
}

// Get translated message
export function t(key: string, lang?: Language): string {
  const currentLang = lang || getCurrentLanguage();
  const keys = key.split('.');
  
  let value: any = messages[currentLang];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  // Fallback to Japanese if English translation not found
  if (value === undefined && currentLang === 'en') {
    value = messages.ja;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
  }
  
  return value || key;
}

// Hook for React components
export function useTranslation() {
  const currentLang = getCurrentLanguage();
  
  return {
    t: (key: string) => t(key, currentLang),
    lang: currentLang,
    setLang: setLanguage
  };
}