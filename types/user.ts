export type UserRole = 'student' | 'shop' | 'admin';

export interface User {
  id: string;
  name: string;
  nameJa: string; // Japanese name
  email: string;
  role: UserRole;
  studentId?: string; // for students
  department?: string; // for students/staff
  phone?: string;
  totalBorrows: number;
  totalReturns: number;
  points: number; // gamification points
  isActive: boolean;
  createdAt: string; // ISO date string
  lastLoginAt: string; // ISO date string
}

export interface Transaction {
  id: string;
  umbrellaId: string;
  action: 'borrow' | 'return'; // Updated field name for clarity
  userId: string;
  stationId: string;
  timestamp: string; // ISO date string
  type?: 'borrow' | 'return'; // Legacy support
  location?: {
    lat: number;
    lng: number;
  };
  weather?: string; // weather condition at time of transaction
  pointsEarned?: number; // points for returning
}