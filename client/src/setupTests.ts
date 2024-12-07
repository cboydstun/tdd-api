import '@testing-library/jest-dom';
import * as util from 'util';

declare global {
    interface Window {
        matchMedia: (query: string) => MediaQueryList;
    }
    namespace NodeJS {
        interface ProcessEnv {
            VITE_API_URL: string;
        }
    }
}

// Set up TextEncoder/TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
    (globalThis as any).TextEncoder = util.TextEncoder;
    (globalThis as any).TextDecoder = util.TextDecoder;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:8080';

// Mock Vite's import.meta.env
(global as any).import = {
    meta: {
        env: {
            VITE_API_URL: 'http://localhost:8080'
        }
    }
};

// Mock modules that might cause issues
jest.mock('lucide-react', () => ({
    ArrowRight: () => null,
    Star: () => null,
    StarHalf: () => null,
    Quote: () => null,
    Phone: () => null,
    Mail: () => null,
    MapPin: () => null,
    Facebook: () => null,
    Instagram: () => null,
    Twitter: () => null,
    Clock: () => null,
    Shield: () => null,
    Package: () => null,
    DollarSign: () => null
}));
