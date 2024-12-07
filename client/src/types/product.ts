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
    powerSource: boolean;
    surfaceType: string[];
}

export interface Specification {
    name: string;
    value: string | string[];
}

export interface AdditionalService {
    name: string;
    price: number;
}

export interface MaintenanceSchedule {
    lastMaintenance: string;
    nextMaintenance: string;
}

export type RentalDuration = 'hourly' | 'half-day' | 'full-day' | 'weekend';
export type Availability = 'available' | 'rented' | 'maintenance' | 'retired';

export interface Product {
    _id?: string;
    slug: string;
    name: string;
    description: string;
    category: string;
    price: ProductPrice;
    dimensions: ProductDimensions;
    capacity: number;
    ageRange: ProductAgeRange;
    setupRequirements: SetupRequirements;
    features: string[];
    safetyGuidelines: string;
    maintenanceSchedule: MaintenanceSchedule;
    weatherRestrictions: string[];
    additionalServices: AdditionalService[];
    specifications: Specification[];
    images: ProductImage[];
    rentalDuration: RentalDuration;
    availability: Availability;
    createdAt?: string;
    updatedAt?: string;
}

// Form data includes all fields except system-generated ones
export interface ProductFormData extends Omit<Product, '_id' | 'createdAt' | 'updatedAt'> {
    // All fields from Product except _id, createdAt, and updatedAt
    name: string;
    description: string;
    category: string;
    price: ProductPrice;
    dimensions: ProductDimensions;
    capacity: number;
    ageRange: ProductAgeRange;
    setupRequirements: SetupRequirements;
    features: string[];
    safetyGuidelines: string;
    maintenanceSchedule: MaintenanceSchedule;
    weatherRestrictions: string[];
    additionalServices: AdditionalService[];
    specifications: Specification[];
    rentalDuration: RentalDuration;
    availability: Availability;
}
