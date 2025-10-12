import { Station, Umbrella, User, Transaction } from '@/types';

// Mock stations around Fukui University
export const mockStations: Station[] = [
  {
    id: 'station-1',
    name: 'Fukui University Main Gate',
    nameJa: '福井大学正門',
    location: { lat: 36.0668, lng: 136.2189 },
    address: '3-9-1 Bunkyo, Fukui City, Fukui',
    addressJa: '福井県福井市文京3-9-1',
    capacity: 8,
    currentCount: 5,
    type: 'university',
    operatingHours: { open: '06:00', close: '22:00' },
    isActive: true,
    contactInfo: { phone: '0776-27-8001' }
  },
  {
    id: 'station-2',
    name: 'Lawson Fukui University Store',
    nameJa: 'ローソン福井大学店',
    location: { lat: 36.0655, lng: 136.2175 },
    address: '2-8-15 Bunkyo, Fukui City, Fukui',
    addressJa: '福井県福井市文京2-8-15',
    capacity: 6,
    currentCount: 3,
    type: 'store',
    operatingHours: { open: '24:00', close: '24:00' },
    isActive: true,
    contactInfo: { phone: '0776-25-1234' }
  },
  {
    id: 'station-3',
    name: 'Fukui Station East Exit',
    nameJa: 'JR福井駅東口',
    location: { lat: 36.0616, lng: 136.2237 },
    address: '1-1-1 Chuo, Fukui City, Fukui',
    addressJa: '福井県福井市中央1-1-1',
    capacity: 12,
    currentCount: 8,
    type: 'public',
    operatingHours: { open: '05:00', close: '24:00' },
    isActive: true,
    contactInfo: { phone: '0776-20-0541' }
  }
];

// Mock umbrellas
export const mockUmbrellas: Umbrella[] = [
  // Station 1 umbrellas
    // Station 1 - Main Gate (8 umbrellas, 2 in use)
  { id: 'umb-001', code: 'machikasa://umbrella/umb-001', qrCode: 'machikasa://umbrella/umb-001', status: 'available', stationId: 'station-1', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 95 },
  { id: 'umb-002', code: 'machikasa://umbrella/umb-002', qrCode: 'machikasa://umbrella/umb-002', status: 'available', stationId: 'station-1', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 88 },
  { id: 'umb-003', code: 'machikasa://umbrella/umb-003', qrCode: 'machikasa://umbrella/umb-003', status: 'available', stationId: 'station-1', lastUpdated: '2025-10-12T08:00:00Z', condition: 'fair', batteryLevel: 72 },
  { id: 'umb-004', code: 'machikasa://umbrella/umb-004', qrCode: 'machikasa://umbrella/umb-004', status: 'available', stationId: 'station-1', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 100 },
  { id: 'umb-005', code: 'machikasa://umbrella/umb-005', qrCode: 'machikasa://umbrella/umb-005', status: 'available', stationId: 'station-1', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 91 },
  { id: 'umb-006', code: 'machikasa://umbrella/umb-006', qrCode: 'machikasa://umbrella/umb-006', status: 'in_use', stationId: 'station-1', lastUpdated: '2025-10-12T09:30:00Z', condition: 'good', batteryLevel: 85, borrowedBy: 'user-1' },
  
  // Station 2 umbrellas
    // Station 2 - Lawson (4 umbrellas, 1 in use)
  { id: 'umb-007', code: 'machikasa://umbrella/umb-007', qrCode: 'machikasa://umbrella/umb-007', status: 'available', stationId: 'station-2', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 93 },
  { id: 'umb-008', code: 'machikasa://umbrella/umb-008', qrCode: 'machikasa://umbrella/umb-008', status: 'available', stationId: 'station-2', lastUpdated: '2025-10-12T08:00:00Z', condition: 'fair', batteryLevel: 67 },
  { id: 'umb-009', code: 'machikasa://umbrella/umb-009', qrCode: 'machikasa://umbrella/umb-009', status: 'available', stationId: 'station-2', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 98 },
  { id: 'umb-010', code: 'machikasa://umbrella/umb-010', qrCode: 'machikasa://umbrella/umb-010', status: 'in_use', stationId: 'station-2', lastUpdated: '2025-10-12T10:15:00Z', condition: 'good', batteryLevel: 82, borrowedBy: 'user-2' },

  // Station 3 - West Campus (3 umbrellas, 1 in maintenance)
  { id: 'umb-011', code: 'machikasa://umbrella/umb-011', qrCode: 'machikasa://umbrella/umb-011', status: 'available', stationId: 'station-3', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 89 },
  { id: 'umb-012', code: 'machikasa://umbrella/umb-012', qrCode: 'machikasa://umbrella/umb-012', status: 'available', stationId: 'station-3', lastUpdated: '2025-10-12T08:00:00Z', condition: 'good', batteryLevel: 96 },
  { id: 'umb-013', code: 'machikasa://umbrella/umb-013', qrCode: 'machikasa://umbrella/umb-013', status: 'maintenance', stationId: 'station-3', lastUpdated: '2025-10-11T16:30:00Z', condition: 'poor', batteryLevel: 45 },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Takeshi Yamada',
    nameJa: '山田武志',
    email: 'yamada@fukui-u.ac.jp',
    role: 'student',
    studentId: 'FU2023001',
    department: 'Engineering',
    phone: '090-1234-5678',
    totalBorrows: 15,
    totalReturns: 14,
    points: 280,
    isActive: true,
    createdAt: '2025-04-01T00:00:00Z',
    lastLoginAt: '2025-10-12T09:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Yuki Tanaka',
    nameJa: '田中雪',
    email: 'tanaka@fukui-u.ac.jp',
    role: 'student',
    studentId: 'FU2024002',
    department: 'Liberal Arts',
    phone: '090-2345-6789',
    totalBorrows: 8,
    totalReturns: 8,
    points: 160,
    isActive: true,
    createdAt: '2025-04-15T00:00:00Z',
    lastLoginAt: '2025-10-12T10:15:00Z'
  },
  {
    id: 'user-admin',
    name: 'Kensuke Sato',
    nameJa: '佐藤健介',
    email: 'admin@fukui-u.ac.jp',
    role: 'admin',
    department: 'Student Affairs',
    phone: '0776-27-8100',
    totalBorrows: 0,
    totalReturns: 0,
    points: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-10-12T08:00:00Z'
  }
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    userId: 'user-1',
    umbrellaId: 'umb-006',
    stationId: 'station-1',
    action: 'borrow',
    timestamp: '2025-10-12T09:30:00Z',
    location: { lat: 36.0668, lng: 136.2189 },
    weather: 'rainy'
  },
  {
    id: 'tx-002',
    userId: 'user-2',
    umbrellaId: 'umb-010',
    stationId: 'station-2',
    action: 'borrow',
    timestamp: '2025-10-12T10:15:00Z',
    location: { lat: 36.0655, lng: 136.2175 },
    weather: 'cloudy'
  },
  {
    id: 'tx-003',
    userId: 'user-1',
    umbrellaId: 'umb-002',
    stationId: 'station-1',
    action: 'return',
    timestamp: '2025-10-11T18:45:00Z',
    location: { lat: 36.0668, lng: 136.2189 },
    weather: 'clear',
    pointsEarned: 20
  }
];

// Positive messages for returns (Japanese)
export const returnMessages = [
  "次の人のためにありがとう☂️",
  "素晴らしい！地域の輪を広げています🌟",
  "お疲れさまでした！ポイントが加算されました✨",
  "ご利用ありがとうございました🙏",
  "みんなで支える街づくり、感謝です💙",
  "傘シェアコミュニティの一員として感謝！🤝",
  "雨の日を支えてくれてありがとう🌧️",
  "返却完了！次回もよろしくお願いします😊"
];

// Mock sponsors (協賛企業)
export const mockSponsors: import('@/types').Sponsor[] = [
  {
    id: 'sponsor-1',
    name: '福井コーヒー',
    nameEn: 'Fukui Coffee',
    logoUrl: '/sponsors/fukui-coffee.svg',
    message: '美味しいコーヒーで、雨の日も心温まる時間を。',
    messageEn: 'Warm your heart with delicious coffee, even on rainy days.',
    websiteUrl: 'https://fukui-coffee.local',
    active: true,
    joinedDate: '2025-09-01T00:00:00Z',
    contactEmail: 'info@fukui-coffee.local',
    category: 'local_business'
  },
  {
    id: 'sponsor-2',
    name: 'さばえ書店',
    nameEn: 'Sabae Bookstore',
    logoUrl: '/sponsors/sabae-books.svg',
    message: '知識と傘で、雨の日も晴れやかに。',
    messageEn: 'Knowledge and umbrellas make rainy days brighter.',
    active: true,
    joinedDate: '2025-09-15T00:00:00Z',
    category: 'local_business'
  },
  {
    id: 'sponsor-3',
    name: '福井大学生協',
    nameEn: 'Fukui University Co-op',
    logoUrl: '/sponsors/fukui-coop.svg',
    message: '学生生活をもっと便利に、もっと楽しく。',
    messageEn: 'Making student life more convenient and enjoyable.',
    active: true,
    joinedDate: '2025-08-01T00:00:00Z',
    category: 'university'
  },
  {
    id: 'sponsor-4',
    name: 'カフェ未来',
    nameEn: 'Cafe Mirai',
    logoUrl: '/sponsors/cafe-mirai.svg',
    message: '未来への一歩は、コーヒー一杯から。',
    messageEn: 'The step towards the future starts with a cup of coffee.',
    active: true,
    joinedDate: '2025-10-01T00:00:00Z',
    contactEmail: 'hello@cafe-mirai.local',
    category: 'local_business'
  }
];

// Mock partner stores (加盟店)
export const mockPartnerStores: import('@/types').PartnerStore[] = [
  {
    id: 'partner-1',
    name: 'Fukui Coffee 文京店',
    nameEn: 'Fukui Coffee Bunkyo Branch',
    type: 'cafe',
    address: '福井県福井市文京4-1-15',
    lat: 36.0645,
    lng: 136.2175,
    phone: '0776-25-1234',
    hours: '7:00-20:00',
    sponsorId: 'sponsor-1',
    offers: ['返却でコーヒー10円引き', 'ポイント2倍キャンペーン'],
    availableUmbrellas: 3,
    maxCapacity: 6,
    isActive: true,
    joinedDate: '2025-09-01T00:00:00Z',
    lastUpdated: '2025-10-12T09:00:00Z',
    features: ['umbrella_station', 'return_bonus', 'sponsor_benefits', 'student_discount']
  },
  {
    id: 'partner-2',
    name: 'さばえ書店 福井店',
    nameEn: 'Sabae Bookstore Fukui Branch',
    type: 'bookstore',
    address: '福井県福井市中央2-8-21',
    lat: 36.0625,
    lng: 136.2145,
    phone: '0776-24-5678',
    hours: '9:00-21:00',
    sponsorId: 'sponsor-2',
    offers: ['返却で文具10%引き', '学習本ポイント3倍'],
    availableUmbrellas: 5,
    maxCapacity: 8,
    isActive: true,
    joinedDate: '2025-09-15T00:00:00Z',
    lastUpdated: '2025-10-12T08:30:00Z',
    features: ['umbrella_station', 'return_bonus', 'sponsor_benefits', 'student_discount']
  },
  {
    id: 'partner-3',
    name: '福井大学生協ストア',
    nameEn: 'Fukui University Co-op Store',
    type: 'convenience',
    address: '福井県福井市文京3-9-1 福井大学内',
    lat: 36.0672,
    lng: 136.2195,
    phone: '0776-27-8888',
    hours: '8:00-19:00',
    sponsorId: 'sponsor-3',
    offers: ['返却で弁当5%引き', '文房具ポイント2倍'],
    availableUmbrellas: 8,
    maxCapacity: 12,
    isActive: true,
    joinedDate: '2025-08-20T00:00:00Z',
    lastUpdated: '2025-10-12T07:45:00Z',
    features: ['umbrella_station', 'return_bonus', 'sponsor_benefits', 'student_discount']
  },
  {
    id: 'partner-4',
    name: 'Cafe Mirai',
    nameEn: 'Cafe Mirai',
    type: 'cafe',
    address: '福井県福井市順化1-14-7',
    lat: 36.0598,
    lng: 136.2165,
    phone: '0776-23-9999',
    hours: '8:00-22:00',
    sponsorId: 'sponsor-4',
    offers: ['返却でドリンク15円引き', 'ケーキセット特価'],
    availableUmbrellas: 4,
    maxCapacity: 6,
    isActive: true,
    joinedDate: '2025-10-01T00:00:00Z',
    lastUpdated: '2025-10-12T10:15:00Z',
    features: ['umbrella_station', 'return_bonus', 'sponsor_benefits']
  },
  {
    id: 'partner-5',
    name: 'コンビニ文京',
    nameEn: 'Convenience Bunkyo',
    type: 'convenience',
    address: '福井県福井市文京5-2-8',
    lat: 36.0635,
    lng: 136.2158,
    phone: '0776-26-7777',
    hours: '24時間営業',
    offers: ['返却でポイント+2', '飲料10円引き'],
    availableUmbrellas: 6,
    maxCapacity: 10,
    isActive: true,
    joinedDate: '2025-09-20T00:00:00Z',
    lastUpdated: '2025-10-12T06:00:00Z',
    features: ['umbrella_station', 'return_bonus']
  }
];

// Mock sponsorship deals
export const mockSponsorshipDeals: import('@/types').SponsorshipDeal[] = [
  {
    id: 'deal-1',
    sponsorId: 'sponsor-1',
    partnerStoreId: 'partner-1',
    dealType: 'points_bonus',
    description: 'Fukui Coffeeでの返却で追加ポイント',
    value: 2,
    active: true,
    startDate: '2025-09-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z'
  },
  {
    id: 'deal-2',
    sponsorId: 'sponsor-2',
    partnerStoreId: 'partner-2',
    dealType: 'discount',
    description: 'さばえ書店での文具割引',
    value: 10,
    active: true,
    startDate: '2025-09-15T00:00:00Z',
    endDate: '2025-11-30T23:59:59Z'
  },
  {
    id: 'deal-3',
    sponsorId: 'sponsor-3',
    partnerStoreId: 'partner-3',
    dealType: 'points_bonus',
    description: '生協ストアでの返却で学生特典',
    value: 3,
    active: true,
    startDate: '2025-08-20T00:00:00Z'
  }
];