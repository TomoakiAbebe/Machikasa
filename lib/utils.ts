/**
 * Utility functions for the Machikasa app
 */

/**
 * Format a date string to Japanese locale
 */
export function formatDateJa(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format time for operating hours display
 */
export function formatTime(time: string): string {
  return time.substring(0, 5); // "09:00" from "09:00:00"
}

/**
 * Get battery level color class
 */
export function getBatteryColor(level: number): string {
  if (level >= 80) return 'text-green-600';
  if (level >= 50) return 'text-yellow-600';
  if (level >= 20) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get status color for umbrellas
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'available': return 'text-green-600 bg-green-100';
    case 'in_use': return 'text-blue-600 bg-blue-100';
    case 'maintenance': return 'text-orange-600 bg-orange-100';
    case 'lost': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Get status text in Japanese
 */
export function getStatusTextJa(status: string): string {
  switch (status) {
    case 'available': return '利用可能';
    case 'in_use': return '使用中';
    case 'maintenance': return 'メンテナンス';
    case 'lost': return '紛失';
    default: return '不明';
  }
}

/**
 * Get condition text in Japanese
 */
export function getConditionTextJa(condition: string): string {
  switch (condition) {
    case 'good': return '良好';
    case 'fair': return '普通';
    case 'poor': return '要修理';
    default: return '不明';
  }
}

/**
 * Get user role text in Japanese
 */
export function getRoleTextJa(role: string): string {
  switch (role) {
    case 'student': return '学生';
    case 'store': return '店舗';
    case 'admin': return '管理者';
    default: return '不明';
  }
}

/**
 * Generate a random positive return message
 */
export function getRandomReturnMessage(): string {
  const messages = [
    "次の人のためにありがとう☂️",
    "素晴らしい！地域の輪を広げています🌟",
    "お疲れさまでした！ポイントが加算されました✨",
    "ご利用ありがとうございました🙏",
    "みんなで支える街づくり、感謝です💙",
    "傘シェアコミュニティの一員として感謝！🤝",
    "雨の日を支えてくれてありがとう🌧️",
    "返却完了！次回もよろしくお願いします😊"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Validate QR code format
 */
export function isValidMachikasaQR(qrCode: string): boolean {
  const pattern = /^machikasa:\/\/umbrella\/[\w-]+$/;
  return pattern.test(qrCode);
}

/**
 * Extract umbrella ID from QR code
 */
export function extractUmbrellaId(qrCode: string): string | null {
  const match = qrCode.match(/^machikasa:\/\/umbrella\/([\w-]+)$/);
  return match ? match[1] : null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}