export interface Quote {
  id: number;
  name: string; // Nombre del proyecto
  text: string; // Texto del proyecto
  folder: string; // Carpeta de imágenes
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