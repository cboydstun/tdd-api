import '@testing-library/jest-dom';

// Add TextEncoder polyfill
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
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
global.process.env.VITE_API_URL = 'http://localhost:8080';

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
