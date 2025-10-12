export interface Station {
  id: string;
  name: string;
  nameJa: string; // Japanese name
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  addressJa: string; // Japanese address
  capacity: number; // max umbrellas
  currentCount: number; // available umbrellas
  type: 'university' | 'store' | 'public'; // station type
  operatingHours: {
    open: string; // "09:00"
    close: string; // "21:00"
  };
  isActive: boolean;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export interface StationWithUmbrellas extends Station {
  umbrellas: import('./umbrella').Umbrella[];
}