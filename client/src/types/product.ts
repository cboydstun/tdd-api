export interface Specification {
  name: string;
  value: string;
}

export interface Price {
  base: number;
  discounted?: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface Image {
  url: string;
  alt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: Price;
  rentalDuration: string;
  dimensions?: Dimensions;
  specifications: Specification[];
  images: Image[];
}
