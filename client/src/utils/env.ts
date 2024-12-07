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

export const env = {
    VITE_API_URL: getApiUrl(),
    VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string,
    VITE_CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY as string,
    VITE_CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET as string,
    VITE_CLOUDINARY_API_CLOUDINARY_URL: import.meta.env.VITE_CLOUDINARY_API_CLOUDINARY_URL as string
};
