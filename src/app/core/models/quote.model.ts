export interface Quote {
  id: number;
  name: string;
  size: number;
  bedrooms?: number; // Optional number of bedrooms
  bathrooms?: number; // Optional number of bathrooms
  folder: string;
  categories: QuoteCategory[];
  imagesCount?: number; // Optional number of images
}

export interface QuoteCategory {
  id: number;
  name: string;
  icon: string;
  basePrice?: number;
  options: (SubCategory | Option)[];
  fields?: FieldDescriptor[];
}

export interface SubCategory {
  name: string;
  basePrice?: number;
  options: Option[];
}

export interface Option {
  name: string;
  price: number | string;
}

export interface FieldDescriptor {
  key: string;
  label: string;
  type: string;
  min?: number;
  max?: number;
  step?: number;
}