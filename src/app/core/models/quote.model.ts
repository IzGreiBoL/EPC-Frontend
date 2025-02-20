export interface Quote {
  id: number;
  name: string;
  text: string;
  folder: string;
  categories: QuoteCategory[];
}

export interface QuoteCategory {
  id: number;
  name: string;
  icon: string;
  options: SubCategory[];
}

export interface SubCategory {
  name: string;
  options: { name: string; price: number }[];
}
