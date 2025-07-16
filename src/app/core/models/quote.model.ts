export interface Quote {
  id: number;
  name: string;
  size: number;
  bedrooms?: number; // Optional number of bedrooms
  bathrooms?: number; // Optional number of bathrooms
  folder: string;
  basePrice: number; // Optional base price for quotes
  categories: QuoteCategory[];
}

export interface QuoteCategory {
  id: number;
  name: string;
  icon: string;
  basePrice: number;
  options: (SubCategory | Option)[];
  fields?: FieldDescriptor[];
}

export interface SubCategory {
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  price: number | string;
}

export interface FieldDescriptor {
  key: 'sqft' | 'bedrooms' | 'bathrooms';
  label: string;
  type: 'number' | 'text';
}