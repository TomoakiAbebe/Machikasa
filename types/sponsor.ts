export interface Sponsor {
  id: string;
  name: string;
  nameEn?: string; // English name for international users
  logoUrl: string;
  message: string;
  messageEn?: string; // English message
  websiteUrl?: string;
  active: boolean;
  joinedDate: string; // ISO date string
  contactEmail?: string;
  category: 'local_business' | 'university' | 'government' | 'npo' | 'other';
}

export interface PartnerStore {
  id: string;
  name: string;
  nameEn?: string;
  type: 'restaurant' | 'cafe' | 'supermarket' | 'pharmacy' | 'bookstore' | 'convenience' | 'other';
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  hours?: string; // e.g., "9:00-21:00"
  sponsorId?: string; // link to Sponsor if applicable
  offers: string[]; // e.g., ["返却でドリンク10円引き", "ポイント2倍"]
  availableUmbrellas: number;
  maxCapacity: number;
  isActive: boolean;
  joinedDate: string; // ISO date string
  lastUpdated: string; // ISO date string
  features: ('umbrella_station' | 'return_bonus' | 'sponsor_benefits' | 'student_discount')[];
}

export interface SponsorshipDeal {
  id: string;
  sponsorId: string;
  partnerStoreId: string;
  dealType: 'points_bonus' | 'discount' | 'free_item' | 'cashback';
  description: string;
  value: number; // points, discount percentage, or amount
  active: boolean;
  startDate: string;
  endDate?: string;
}

export interface PartnerStoreReturn {
  id: string;
  transactionId: string;
  partnerStoreId: string;
  userId: string;
  umbrellaId: string;
  bonusPoints: number;
  dealApplied?: string; // deal description if any
  timestamp: string;
}

// Utility type for map display
export interface MapLocation {
  id: string;
  name: string;
  type: 'campus_station' | 'partner_store';
  lat: number;
  lng: number;
  category?: string;
  umbrellaCount: number;
  offers?: string[];
  sponsorId?: string;
}

export default {};