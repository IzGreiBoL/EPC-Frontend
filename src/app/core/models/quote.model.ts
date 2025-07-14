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
}

export interface SubCategory {
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  price: number | string;
}