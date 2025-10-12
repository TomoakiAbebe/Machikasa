import '@testing-library/jest-dom'

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
})

// Mock navigator.geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  writable: true,
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Suppress console warnings during tests
const originalWarn = console.warn
const originalError = console.error
const originalLog = console.log

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate') ||
        args[0].includes('validateDOMNesting') ||
        args[0].includes('Failed to read from storage') ||
        args[0].includes('Failed to write to storage') ||
        args[0].includes('Data is null/undefined') ||
        args[0].includes('Failed to save data for key'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
        args[0].includes('validateDOMNesting') ||
        args[0].includes('Error in SafeStorage') ||
        args[0].includes('Storage error') ||
        args[0].includes('Storage quota exceeded'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.log = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('🚀 LocalDB initialized') ||
        args[0].includes('🆘 LocalDB initialized') ||
        args[0].includes('🔄 LocalDB reset') ||
        args[0].includes('✅ Data integrity') ||
        args[0].includes('Fallback:'))
    ) {
      return
    }
    originalLog.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
  console.log = originalLog
})