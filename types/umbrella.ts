export interface Umbrella {
  id: string;
  code: string; // same as in QR: "machikasa://umbrella/{id}"
  qrCode: string; // "machikasa://umbrella/{id}" (legacy support)
  status: 'available' | 'in_use' | 'maintenance' | 'lost';
  stationId: string;
  lastUpdated: string; // ISO date string
  borrowedBy?: string; // userId when in_use
  condition: 'good' | 'fair' | 'poor';
  batteryLevel?: number; // for smart umbrellas (0-100)
}

export interface UmbrellaWithStation extends Umbrella {
  station: import('./station').Station;
}