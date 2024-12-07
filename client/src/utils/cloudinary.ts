import { env } from './env'

export const cloudinaryConfig = {
    cloudName: env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: env.VITE_CLOUDINARY_API_KEY,
    apiSecret: env.VITE_CLOUDINARY_API_SECRET,
    cloudinaryUrl: env.VITE_CLOUDINARY_API_CLOUDINARY_URL
}

export const getCloudinaryUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    // If it's already a Cloudinary URL, return as is
    if (imagePath.includes('cloudinary.com')) {
        return imagePath;
    }

    // If it's a local path starting with /uploads, transform to Cloudinary URL
    const filename = imagePath.startsWith('/uploads/')
        ? imagePath.replace('/uploads/', '')
        : imagePath;

    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/v1/${filename}`;
}

export const getCloudinaryImageProps = (imagePath: string) => {
    const url = getCloudinaryUrl(imagePath);
    return {
        src: url,
        loading: "lazy" as const,
        crossOrigin: "anonymous" as const,
    };
}
