export const getApiUrl = (): string => {
    // For Vite environment
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // For Jest environment
    if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
        return process.env.VITE_API_URL;
    }
    // Fallback for development and production
    return 'http://localhost:8080';
};
