export interface ProductPrice {
    base: number;
    currency: string;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'feet' | 'meters' | 'inches';
}

export interface ProductImage {
    url: string;
    alt?: string;
    isPrimary: boolean;
}

export interface ProductAgeRange {
    min: number;
    max: number;
}

export interface SetupRequirements {
    space: string;
    powerSource?: boolean;
    surfaceType?: string[];
}

export type RentalDuration = 'hourly' | 'half-day' | 'full-day' | 'weekend';
export type Availability = 'available' | 'rented' | 'maintenance' | 'retired';

export interface Product {
    _id: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    price: ProductPrice;
    dimensions: ProductDimensions;
    capacity: number;
    ageRange: ProductAgeRange;
    setupRequirements: SetupRequirements;
    safetyGuidelines: string;
    images: ProductImage[];
    rentalDuration: RentalDuration;
    availability: Availability;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    category: string;
    price: {
        base: number;
        currency: string;
    };
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: 'feet' | 'meters' | 'inches';
    };
    capacity: number;
    ageRange: {
        min: number;
        max: number;
    };
    setupRequirements: {
        space: string;
        powerSource?: boolean;
        surfaceType?: string[];
    };
    safetyGuidelines: string;
    rentalDuration: RentalDuration;
    availability: Availability;
}
