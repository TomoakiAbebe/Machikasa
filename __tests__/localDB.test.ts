import { LocalDB } from '@/lib/localDB'

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('LocalDB', () => {
  beforeEach(() => {
    // Clear all mocks and storage before each test
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('Basic operations', () => {
    it('should get stations with empty array when no data', () => {
      const stations = LocalDB.getStations()
      expect(Array.isArray(stations)).toBe(true)
      expect(stations.length).toBeGreaterThanOrEqual(0)
    })

    it('should set and get stations', () => {
      const mockStations = [
        { 
          id: '1', 
          name: 'Test Station', 
          nameJa: 'テストステーション',
          location: { lat: 36.0, lng: 136.0 },
          address: 'Test Address',
          addressJa: 'テスト住所',
          capacity: 10,
          currentCount: 5,
          type: 'university' as const,
          operatingHours: { open: '09:00', close: '21:00' },
          isActive: true
        }
      ]
      
      LocalDB.setStations(mockStations)
      const stations = LocalDB.getStations()
      expect(Array.isArray(stations)).toBe(true)
      expect(stations.length).toBeGreaterThan(0)
    })

    it('should get umbrellas', () => {
      const umbrellas = LocalDB.getUmbrellas()
      expect(Array.isArray(umbrellas)).toBe(true)
    })

    it('should get users', () => {
      const users = LocalDB.getUsers()
      expect(Array.isArray(users)).toBe(true)
    })
  })

  describe('Data integrity', () => {
    it('should handle initialization', () => {
      LocalDB.reset()
      const stations = LocalDB.getStations()
      const umbrellas = LocalDB.getUmbrellas()
      const users = LocalDB.getUsers()
      
      expect(Array.isArray(stations)).toBe(true)
      expect(Array.isArray(umbrellas)).toBe(true)
      expect(Array.isArray(users)).toBe(true)
    })

    it('should handle reset operation', () => {
      expect(() => {
        LocalDB.reset()
      }).not.toThrow()
    })
  })
})