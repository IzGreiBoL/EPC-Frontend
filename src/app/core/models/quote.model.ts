export interface Quote {
    id: number;
    image: string;
    text: string;
    categories: QuoteCategory[];
  }
  
  export interface QuoteCategory {
    id: number;
    name: string;
    options: (string | { name: string; options: string[] })[];
  }
  
  export interface SubCategory {
    name: string;
    options: string[];
  }