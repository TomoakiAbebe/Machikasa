/**
 * Comprehensive error handling utilities for Machikasa
 * Provides graceful fallbacks and user-friendly error messages
 */

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  fallback?: () => void;
}

/**
 * Error codes and their handling
 */
export const ERROR_CODES = {
  // Camera/Scanner errors
  CAMERA_ACCESS_DENIED: 'CAMERA_ACCESS_DENIED',
  CAMERA_NOT_AVAILABLE: 'CAMERA_NOT_AVAILABLE',
  CAMERA_HARDWARE_ERROR: 'CAMERA_HARDWARE_ERROR',
  QR_SCAN_FAILED: 'QR_SCAN_FAILED',
  
  // LocalStorage errors
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_ACCESS_DENIED: 'STORAGE_ACCESS_DENIED',
  STORAGE_CORRUPTED: 'STORAGE_CORRUPTED',
  
  // Network/Offline errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVICE_WORKER_ERROR: 'SERVICE_WORKER_ERROR',
  OFFLINE_MODE: 'OFFLINE_MODE',
  
  // Business logic errors
  DUPLICATE_RETURN: 'DUPLICATE_RETURN',
  INVALID_UMBRELLA: 'INVALID_UMBRELLA',
  STATION_FULL: 'STATION_FULL',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

/**
 * Error definitions with user-friendly messages
 */
const ERROR_DEFINITIONS: Record<string, ErrorDetails> = {
  [ERROR_CODES.CAMERA_ACCESS_DENIED]: {
    code: ERROR_CODES.CAMERA_ACCESS_DENIED,
    message: 'Camera access denied by user',
    userMessage: 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラ使用を許可してください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Show manual QR input')
  },
  
  [ERROR_CODES.CAMERA_NOT_AVAILABLE]: {
    code: ERROR_CODES.CAMERA_NOT_AVAILABLE,
    message: 'Camera not available on this device',
    userMessage: 'カメラが利用できません。手動入力をご利用ください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Enable manual input mode')
  },
  
  [ERROR_CODES.CAMERA_HARDWARE_ERROR]: {
    code: ERROR_CODES.CAMERA_HARDWARE_ERROR,
    message: 'Camera hardware error',
    userMessage: 'カメラに問題が発生しました。デバイスを再起動するか、手動入力をお試しください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Switch to manual input')
  },
  
  [ERROR_CODES.QR_SCAN_FAILED]: {
    code: ERROR_CODES.QR_SCAN_FAILED,
    message: 'QR code scanning failed',
    userMessage: 'QRコードの読み取りに失敗しました。明るい場所で再度お試しください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Retry scan or manual input')
  },
  
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: {
    code: ERROR_CODES.STORAGE_QUOTA_EXCEEDED,
    message: 'LocalStorage quota exceeded',
    userMessage: 'データ保存領域がいっぱいです。ブラウザのキャッシュをクリアしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Clear old data or show storage management')
  },
  
  [ERROR_CODES.STORAGE_ACCESS_DENIED]: {
    code: ERROR_CODES.STORAGE_ACCESS_DENIED,
    message: 'LocalStorage access denied',
    userMessage: 'データの保存ができません。プライベートブラウジングモードを無効にしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Use session storage or memory storage')
  },
  
  [ERROR_CODES.STORAGE_CORRUPTED]: {
    code: ERROR_CODES.STORAGE_CORRUPTED,
    message: 'Stored data is corrupted',
    userMessage: 'データが破損しています。初期状態にリセットします。',
    recoverable: true,
    fallback: () => console.log('Fallback: Reset to default data')
  },
  
  [ERROR_CODES.NETWORK_ERROR]: {
    code: ERROR_CODES.NETWORK_ERROR,
    message: 'Network connection error',
    userMessage: 'インターネット接続がありません。オフラインモードで継続します。',
    recoverable: true,
    fallback: () => console.log('Fallback: Switch to offline mode')
  },
  
  [ERROR_CODES.SERVICE_WORKER_ERROR]: {
    code: ERROR_CODES.SERVICE_WORKER_ERROR,
    message: 'Service Worker registration failed',
    userMessage: 'オフライン機能の設定に失敗しました。ブラウザを再読み込みしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Continue without offline features')
  },
  
  [ERROR_CODES.OFFLINE_MODE]: {
    code: ERROR_CODES.OFFLINE_MODE,
    message: 'Application is in offline mode',
    userMessage: 'オフラインモードです。一部の機能が制限されます。',
    recoverable: true,
    fallback: () => console.log('Fallback: Enable offline features')
  },
  
  [ERROR_CODES.DUPLICATE_RETURN]: {
    code: ERROR_CODES.DUPLICATE_RETURN,
    message: 'Umbrella already returned',
    userMessage: 'この傘はすでに返却されています。別の傘をお試しください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Show available umbrellas')
  },
  
  [ERROR_CODES.INVALID_UMBRELLA]: {
    code: ERROR_CODES.INVALID_UMBRELLA,
    message: 'Invalid umbrella ID',
    userMessage: '無効な傘IDです。正しいQRコードをスキャンしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Retry scan')
  },
  
  [ERROR_CODES.STATION_FULL]: {
    code: ERROR_CODES.STATION_FULL,
    message: 'Station at full capacity',
    userMessage: 'このステーションは満杯です。近くの別のステーションをご利用ください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Show nearby stations')
  },
  
  [ERROR_CODES.USER_NOT_FOUND]: {
    code: ERROR_CODES.USER_NOT_FOUND,
    message: 'User not found',
    userMessage: 'ユーザー情報が見つかりません。再度ログインしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Redirect to login')
  },
  
  [ERROR_CODES.UNKNOWN_ERROR]: {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: 'Unknown error occurred',
    userMessage: '予期しないエラーが発生しました。ページを再読み込みしてください。',
    recoverable: true,
    fallback: () => console.log('Fallback: Refresh page or reset state')
  },
  
  [ERROR_CODES.PERMISSION_DENIED]: {
    code: ERROR_CODES.PERMISSION_DENIED,
    message: 'Permission denied',
    userMessage: 'この操作の権限がありません。管理者にお問い合わせください。',
    recoverable: false,
    fallback: () => console.log('Fallback: Show contact information')
  },
};

/**
 * Enhanced error handler class
 */
export class ErrorHandler {
  /**
   * Handle camera access errors
   */
  static handleCameraError(error: any): ErrorDetails {
    if (error.name === 'NotAllowedError') {
      return ERROR_DEFINITIONS[ERROR_CODES.CAMERA_ACCESS_DENIED];
    } else if (error.name === 'NotFoundError') {
      return ERROR_DEFINITIONS[ERROR_CODES.CAMERA_NOT_AVAILABLE];
    } else if (error.name === 'NotReadableError') {
      return ERROR_DEFINITIONS[ERROR_CODES.CAMERA_HARDWARE_ERROR];
    } else {
      return ERROR_DEFINITIONS[ERROR_CODES.QR_SCAN_FAILED];
    }
  }

  /**
   * Handle LocalStorage errors
   */
  static handleStorageError(error: any): ErrorDetails {
    if (error.name === 'QuotaExceededError') {
      return ERROR_DEFINITIONS[ERROR_CODES.STORAGE_QUOTA_EXCEEDED];
    } else if (error.message?.includes('Access denied')) {
      return ERROR_DEFINITIONS[ERROR_CODES.STORAGE_ACCESS_DENIED];
    } else if (error instanceof SyntaxError) {
      return ERROR_DEFINITIONS[ERROR_CODES.STORAGE_CORRUPTED];
    } else {
      return ERROR_DEFINITIONS[ERROR_CODES.UNKNOWN_ERROR];
    }
  }

  /**
   * Handle network/connectivity errors
   */
  static handleNetworkError(error: any): ErrorDetails {
    if (!navigator.onLine) {
      return ERROR_DEFINITIONS[ERROR_CODES.OFFLINE_MODE];
    } else {
      return ERROR_DEFINITIONS[ERROR_CODES.NETWORK_ERROR];
    }
  }

  /**
   * Generic error handler with fallback
   */
  static handleError(error: any, context?: string): ErrorDetails {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    // Try to match specific error types
    if (error.name?.includes('Camera') || error.name?.includes('media')) {
      return this.handleCameraError(error);
    } else if (error.message?.includes('localStorage') || error.name === 'QuotaExceededError') {
      return this.handleStorageError(error);
    } else if (error.name === 'NetworkError' || !navigator.onLine) {
      return this.handleNetworkError(error);
    } else {
      return ERROR_DEFINITIONS[ERROR_CODES.UNKNOWN_ERROR];
    }
  }

  /**
   * Execute error recovery action
   */
  static recover(errorDetails: ErrorDetails): void {
    if (errorDetails.recoverable && errorDetails.fallback) {
      try {
        errorDetails.fallback();
      } catch (fallbackError) {
        console.error('Error in recovery action:', fallbackError);
      }
    }
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(errorCode: string): string {
    return ERROR_DEFINITIONS[errorCode]?.userMessage || ERROR_DEFINITIONS[ERROR_CODES.UNKNOWN_ERROR].userMessage;
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(errorCode: string): boolean {
    return ERROR_DEFINITIONS[errorCode]?.recoverable ?? false;
  }
}

/**
 * Higher-order function for wrapping operations with error handling
 */
export function withErrorHandling<T extends any[], R>(
  operation: (...args: T) => R,
  context: string,
  onError?: (error: ErrorDetails) => void
) {
  return (...args: T): R | null => {
    try {
      return operation(...args);
    } catch (error) {
      const errorDetails = ErrorHandler.handleError(error, context);
      
      if (onError) {
        onError(errorDetails);
      } else {
        console.warn(`Error in ${context}:`, errorDetails.userMessage);
      }
      
      // Attempt recovery
      ErrorHandler.recover(errorDetails);
      
      return null;
    }
  };
}

/**
 * Async version of error handling wrapper
 */
export function withAsyncErrorHandling<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  context: string,
  onError?: (error: ErrorDetails) => void
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await operation(...args);
    } catch (error) {
      const errorDetails = ErrorHandler.handleError(error, context);
      
      if (onError) {
        onError(errorDetails);
      } else {
        console.warn(`Error in ${context}:`, errorDetails.userMessage);
      }
      
      // Attempt recovery
      ErrorHandler.recover(errorDetails);
      
      return null;
    }
  };
}

/**
 * Validate data integrity and attempt recovery
 */
export function validateAndRecover<T>(
  data: T | null | undefined,
  defaultValue: T,
  validator?: (data: T) => boolean
): T {
  // Check if data exists
  if (data === null || data === undefined) {
    console.warn('Data is null/undefined, using default value');
    return defaultValue;
  }
  
  // Run custom validator if provided
  if (validator && !validator(data)) {
    console.warn('Data validation failed, using default value');
    return defaultValue;
  }
  
  return data;
}

/**
 * Storage wrapper with automatic error handling
 */
export class SafeStorage {
  static get(key: string, defaultValue: any = null): any {
    return withErrorHandling(
      () => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
      },
      `SafeStorage.get(${key})`,
      (error) => console.warn(`Failed to read from storage: ${error.userMessage}`)
    )();
  }
  
  static set(key: string, value: any): boolean {
    const result = withErrorHandling(
      () => {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      },
      `SafeStorage.set(${key})`,
      (error) => console.warn(`Failed to write to storage: ${error.userMessage}`)
    )();
    
    return result !== null;
  }
  
  static remove(key: string): boolean {
    const result = withErrorHandling(
      () => {
        localStorage.removeItem(key);
        return true;
      },
      `SafeStorage.remove(${key})`,
      (error) => console.warn(`Failed to remove from storage: ${error.userMessage}`)
    )();
    
    return result !== null;
  }
  
  static clear(): boolean {
    const result = withErrorHandling(
      () => {
        localStorage.clear();
        return true;
      },
      'SafeStorage.clear()',
      (error) => console.warn(`Failed to clear storage: ${error.userMessage}`)
    )();
    
    return result !== null;
  }
}