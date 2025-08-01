import { Injectable } from '@angular/core';
import { Quote, QuoteCategory } from '../models/quote.model';
import { Home, DoorOpen, Blinds, ShowerHead, Lightbulb, Grid, Vault, Table, Paintbrush, Microwave } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  // Precios base para diferentes tipos de cotizaciones
  readonly BASIC_QUOTE_BASE_PRICE = 190;
  readonly ADVANCED_QUOTE_BASE_PRICE = 101.42;
  readonly REMODEL_QUOTE_BASE_PRICE = 0;
  readonly CUSTOM_QUOTE_BASE_PRICE = 190;

  private basicCategories: QuoteCategory[] = [
    {
      id: 1,
      name: 'Kitchen Cabinets',
      basePrice: 0,
      icon: 'vault',
      options: [
        { name: 'Shaker', price: 0 },
        { name: 'Rustic', price: 5 },
        { name: 'Traditional Raised-Panel', price: 8 },
        { name: 'Modern Flat-Panel', price: 20 },
      ]
    },
    {
      id: 2,
      name: 'Exterior Design',
      basePrice: 0,
      icon: 'home',
      options: [
        { name: 'Modern', price: 0 },
        { name: 'Traditional', price: 0 },
        { name: 'Craftsman', price: 8 },
        { name: 'Contemporary', price: 15 },
      ]
    },
    {
      id: 3,
      name: 'Interior Finish Level',
      basePrice: 0,
      icon: 'paintbrush',
      options: [
        { name: 'Standard', price: 0 },
        { name: 'Premium', price: 15 },
        { name: 'Luxury', price: 30 },
        { name: 'Custom', price: "+c" }
      ]
    },
    {
      id: 4,
      name: 'Number of Bedrooms',
      basePrice: 0,
      icon: 'door-open',
      options: [
        { name: '2', price: 0 },
        { name: '3', price: 0 },
        { name: '4', price: 14 },
        { name: '5+', price: 28 }
      ]
    },
    {
      id: 5,
      name: 'Number of Bathrooms',
      basePrice: 0,
      icon: 'shower-head',
      options: [
        { name: '1', price: 0 },
        { name: '2', price: 0 },
        { name: '2.5', price: 8 },
        { name: '3+', price: 15 }
      ]
    }
  ];

  private advancedCategories: QuoteCategory[] = [
    {
      id: 1,
      name: 'Exterior Design',
      icon: 'home',
      options: [
        {
          name: 'Siding Materials',
          basePrice: 3.79,
          options: [
            { name: 'Fiber cement', price: 0 },
            { name: 'Wood', price: 2.50 },
            { name: 'Stone', price: 5.05 },
            { name: 'Brick', price: 5.05 },
            { name: 'Stucco', price: 5.05 }
          ]
        },
        {
          name: 'Roofing Styles',
          basePrice: 2.91,
          options: [
            { name: 'Shingle', price: 0 },
            { name: 'Metal', price: 4.34 },
            { name: 'Tile', price: 10.25 },
            { name: 'Clay', price: 30.84 }
          ]
        },
        {
          name: 'Driveway',
          basePrice: 13.34,
          options: [
            { name: 'As Is', price: 0 },
            { name: 'Custom', price: "+c" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Front Door Material',
      icon: 'door-open',
      options: [
        {
          name: 'Material',
          basePrice: 1.22,
          options: [
            { name: 'Fiberglass', price: 0 },
            { name: 'Steel', price: 0.10 },
            { name: 'Wood', price: 0.64 },
            { name: 'Custom Design', price: "+c" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Window Design & Colors',
      icon: 'blinds',
      options: [
        {
          name: 'Window Colors',
          basePrice: 2.48,
          options: [
            { name: 'White', price: 0 },
            { name: 'Black', price: 1.18 },
            { name: 'Natural Wood', price: 20.09 },
            { name: 'Custom', price: "+c" }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Bathroom Fixtures',
      icon: 'shower-head',
      options: [
        {
          name: 'Fixture Colors',
          basePrice: 3.37,
          options: [
            { name: 'Black', price: 0 },
            { name: 'Brushed Nickel', price: 0 },
            { name: 'Chrome', price: 0 },
            { name: 'Gold', price: 0 },
            { name: 'Matte Black', price: 0.55 },
            { name: 'Bronze', price: 1.8 },
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Lighting Fixtures',
      icon: 'lightbulb',
      options: [
        {
          name: 'Lighting Colors',
          basePrice: 1.86,
          options: [
            { name: 'Black', price: 0 },
            { name: 'White', price: 0 },
            { name: 'Brass', price: 0.62 },
            { name: 'Silver', price: 0.93 },
            { name: 'Wood', price: 0.93 },
            { name: 'Custom', price: "+c" }
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'Flooring & Backsplashes',
      icon: 'grid',
      options: [
        {
          name: 'Flooring Materials',
          basePrice: 1.87,
          options: [
            { name: 'Carpet', price: 0 },
            { name: 'Concrete', price: 0 },
            { name: 'Tile', price: 0 },
            { name: 'Luxury Vinyl', price: 0.27 },
            { name: 'Hardwood', price: 2.17 },
          ]
        },
        {
          name: 'Backsplash',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 0.33 }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'Cabinetry',
      icon: 'vault',
      options: [
        {
          name: 'Cabinet Styles',
          basePrice: 6.83,
          options: [
            { name: 'Shaker', price: 0 },
            { name: 'Modern', price: 0 },
            { name: 'Traditional', price: 0 },
            { name: 'Full Overlay', price: 0.70 }
          ]
        },
        {
          name: 'Cabinet Colors',
          basePrice: 0,
          options: [
            { name: 'Painted', price: 0 },
            { name: 'Stain', price: 1 },
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Countertops',
      icon: 'table',
      options: [
        {
          name: 'Materials',
          basePrice: 46.95,
          options: [
            { name: 'Granite', price: 0 },
            { name: 'Concrete', price: 0 },
            { name: 'Butcher Block', price: 0 },
            { name: 'Quartz', price: 11.75 },
            { name: 'Marble', price: 40.85 },
          ]
        }
      ]
    },
    {
      id: 9,
      name: 'Paint & Accent Walls',
      icon: 'paintbrush',
      options: [
        {
          name: 'Paint Colors',
          basePrice: 3.96,
          options: [
            { name: 'Neutral', price: 0 },
            { name: 'Custom', price: 2.90 }
          ]
        },
        {
          name: 'Accent Wall',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: "+c" },
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'Appliance Selection & Upgrades',
      icon: 'microwave', options: [
        {
          name: 'Appliances',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 4.73 },
            { name: 'Custom Design', price: 7.08 }
          ]
        }
      ]
    }
  ];

  private items: Quote[] = [
    { id: 1, name: 'Avalon', size: 1620, bedrooms: 4, bathrooms: 2, folder: 'avalon', categories: this.advancedCategories, imagesCount: 5 },
    { id: 2, name: 'Cascade', size: 1470, bedrooms: 3, bathrooms: 2.5, folder: 'cascade', categories: this.advancedCategories, imagesCount: 5 },
    { id: 3, name: 'Estates', size: 1443, bedrooms: 3, bathrooms: 2, folder: 'estates', categories: this.advancedCategories, imagesCount: 5 },
    { id: 4, name: 'Jewel', size: 1470, bedrooms: 3, bathrooms: 2, folder: 'jewel', categories: this.advancedCategories, imagesCount: 5 },
    { id: 5, name: 'Pandora', size: 1400, bedrooms: 3, bathrooms: 2, folder: 'pandora', categories: this.advancedCategories, imagesCount: 1 },
    {
      id: 999,
      name: 'Custom Build',
      size: 1300,
      bedrooms: 3,
      bathrooms: 2,
      folder: 'custom',
      categories: [],
      imagesCount: 1
    }
  ];

  private iconMap: Record<string, any> = {
    'home': Home,
    'door-open': DoorOpen,
    'blinds': Blinds,
    'shower-head': ShowerHead,
    'lightbulb': Lightbulb,
    'grid': Grid,
    'vault': Vault,
    'table': Table,
    'paintbrush': Paintbrush,
    'microwave': Microwave
  };

  constructor() { }

  getItems(): Quote[] {
    return this.items;
  }

  getItemById(id: number): Quote | undefined {
    return this.items.find(item => item.id === id);
  }

  getImagesFromFolder(folder: string): string[] {
    // Busca el item, pero si no existe, usa un valor por defecto
    const item = this.items.find(i => i.folder === folder);
    const count = item?.imagesCount ?? 5;
    const images: string[] = [];
    for (let i = 1; i <= count; i++) {
      images.push(`images/${folder}/image${i}.jpg`);
    }
    return images;
  }

  getFirstImageFromFolder(folder: string): string {
    return `images/${folder}/image1.jpg`;
  }

  getIcon(iconName: string): string | null {
    return this.iconMap[iconName] || null;
  }

  getIconByCategory(category: QuoteCategory): string | null {
    return this.getIcon(category.icon);
  }

  getCategoriesByType(type: 'basic' | 'advanced'): QuoteCategory[] {
    return type === 'basic' ? this.basicCategories : this.advancedCategories;
  }

  buildCustomCategory(): QuoteCategory[] {
        //TODO: SQFT minimo 1300
    //TODO: Agregarle otra opción de Garage space con opciones de 1, 2, 3 y 4.
    //TODO: BATHROOMS es decimal, pero solo en .5
    //TODO: BATHROOMS: Empieza en 2.5 pero a partir 3 se suman 10 dolares, pero a partir de 3.5 se suman 5 dólares.
    //TODO: BEDROOMS: A partir de 1500 caben 4 cuartos. Poner como mensaje en rojo debajo del campo: Si require 4 cuartos, una casa de 1500 sqft es recomendadable, hasta 2200 es cuando se pueden 5 cuartos. si tienes preguntas, ponerle el link de contacto.
    //TODO: Si no caben los pinches cuartos en el sqft, pues ponerle un mensaje para darle la opción de cambio automático.

    //TODO: Garage: por 1 20, por 2 37 y por 3 55

    //RECORDATORIO:
    //1300 = 3 cuartos hasta 2.5 baños
    //1500 = 4 cuartos, mínimo 3 baños pero puede ponerle los que quiera
    //2200 = 5 cuartos, mínimo 4 baños pero puede ponerle los que quiera
    //si requiere una casa de más de 6 cuartos, poner como mensaje por favor contáctenos.

    //Después de darle next, darle dos botones, uno con request y otro para personalizar. Si le da al personalizar
    //Pues le damos todas las categorías y opciones del avanzado, pero sin los precios base de cada opción y utilizando los
    //paraámetros que el usuario ingresó en el paso 1.
    return [{
      id: 999,
      name: 'Custom parameters',
      icon: 'home',
      basePrice: 0,
      fields: [
        { key: 'sqft', label: 'Square footage (min: 1300)', type: 'number', min: 1300 },
        { key: 'bedrooms', label: 'Bedrooms', type: 'number', min: 1, max: 6 },
        { key: 'bathrooms', label: 'Bathrooms', type: 'number', step: 0.5, min: 1 },
      ],
      options: [
        {
          name: 'Garage Space',
          basePrice: 0,
          options: [
            { name: 'No garage space', price: 0 },
            { name: '1 car garage space', price: 20 },
            { name: '2 car garage space', price: 37 },
            { name: '3 car garage space', price: 55 }
          ]
        }
      ]
    }];
  }

  buildRemodelCategory(): QuoteCategory[] {
    return [
      {
        id: 1001,
        name: 'Remodel Configuration',
        icon: 'home',
        basePrice: 0,
        fields: [
          { key: 'sqft', label: 'Sq ft', type: 'number', min: 300 }
        ],
        options: [
          {
            name: 'Remodel Selections',
            basePrice: 0,
            options: [
              { name: 'Foundation', price: 38 },
              { name: 'Framing and crafts', price: 38 },
              { name: 'Sheet rock', price: 38 },
              { name: 'Bathrooms', price: 38 },
              { name: 'Finishes', price: 38 }
            ]
          }
        ]
      }
    ];
  }
}