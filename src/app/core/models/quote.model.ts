export interface Quote {
  id: number;
  name: string;
  size: string;
  folder: string;
  categories: QuoteCategory[];
}

export interface QuoteCategory {
  id: number;
  name: string;
  icon: string;
  options: (SubCategory | Option)[];
}

export interface SubCategory {
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  price: number;
}