import { Injectable } from '@angular/core';
import { Quote, QuoteCategory } from '../models/quote.model';
import { Home, DoorOpen, Blinds, ShowerHead, Lightbulb, Grid, Vault, Table, Paintbrush, Microwave } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private basicCategories: QuoteCategory[] = [
    {
      id: 1,
      name: 'Kitchen Cabinets',
      basePrice: 0, //TODO: cambiar a un precio base real
      icon: 'vault',
      options: [
        { name: 'Shaker', price: 6000 },
        { name: 'Modern Flat-Panel', price: 5500 },
        { name: 'Traditional Raised-Panel', price: 5000 },
        { name: 'Rustic', price: 6500 }
      ]
    },
    {
      id: 2,
      name: 'Exterior Design',
      basePrice: 0, //TODO: cambiar a un precio base real
      icon: 'home',
      options: [
        { name: 'Modern', price: 7000 },
        { name: 'Traditional', price: 6000 },
        { name: 'Contemporary', price: 8000 },
        { name: 'Craftsman', price: 7500 }
      ]
    },
    {
      id: 3,
      name: 'Interior Finish Level',
      basePrice: 0, //TODO: cambiar a un precio base real
      icon: 'paintbrush',
      options: [
        { name: 'Standard', price: 5000 },
        { name: 'Premium', price: 7000 },
        { name: 'Luxury', price: 10000 },
        { name: 'Custom', price: 12000 }
      ]
    },
    {
      id: 4,
      name: 'Number of Bedrooms',
      basePrice: 0, //TODO: cambiar a un precio base real
      icon: 'door-open',
      options: [
        { name: '2', price: 2000 },
        { name: '3', price: 3000 },
        { name: '4', price: 4000 },
        { name: '5+', price: 5000 }
      ]
    },
    {
      id: 5,
      name: 'Number of Bathrooms',
      basePrice: 0, //TODO: cambiar a un precio base real
      icon: 'shower-head',
      options: [
        { name: '1', price: 1000 },
        { name: '2', price: 2000 },
        { name: '2.5', price: 2500 },
        { name: '3+', price: 3000 }
      ]
    }
  ];

  private categories: QuoteCategory[] = [
    {
      id: 1,
      name: 'Exterior Design',
      icon: 'home',
      basePrice: 3.79,
      options: [
        {
          name: 'Siding Materials', options: [
            { name: 'Fiber cement', price: 0 },
            { name: 'Wood', price: 2.50 },
            { name: 'Stone', price: 5.05 },
            { name: 'Brick', price: 5.05 },
            { name: 'Stucco', price: 5.05 }
          ]
        },
        {
          name: 'Roofing Styles', options: [
            { name: 'Shingle', price: 0 },
            { name: 'Metal', price: 2.91 },
            { name: 'Tile', price: 4.34 },
            { name: 'Clay', price: 10.25 }
          ]
        },
        {
          name: 'Driveway', options: [
            { name: 'As Is', price: 0 },
            { name: 'Custom', price: "+c" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Front Door Material',
      basePrice: 1.22,
      icon: 'door-open',
      options: [
        {
          name: 'Material', options: [
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
      basePrice: 2.48,
      icon: 'blinds',
      options: [
        {
          name: 'Window Colors', options: [
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
      basePrice: 3.37,
      icon: 'shower-head',
      options: [
        {
          name: 'Fixture Colors', options: [
            { name: 'Brass', price: 0 },
            { name: 'Black', price: 0 },
            { name: 'Brushed Nickel', price: 0 },
            { name: 'Chrome', price: 0 },
            { name: 'Gold', price: 0 },
            { name: 'Matte Black', price: 0.55 }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Lighting Fixtures',
      basePrice: 1.86,
      icon: 'lightbulb',
      options: [
        {
          name: 'Lighting Colors', options: [
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
      basePrice: 1.87,
      icon: 'grid',
      options: [
        {
          name: 'Flooring Materials', options: [
            { name: 'Hardwood', price: 0 },
            { name: 'Luxury Vinyl', price: 0 },
            { name: 'Carpet', price: 0 },
            { name: 'Concrete', price: 0 },
            { name: 'Tile', price: 0.27 }
          ]
        },
        {
          name: 'Backsplash', options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 0.33 }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'Cabinetry',
      basePrice: 6.83,
      icon: 'vault',
      options: [
        {
          name: 'Cabinet Styles', options: [
            { name: 'Shaker', price: 0 },
            { name: 'Modern', price: 0 },
            { name: 'Traditional', price: 0 },
            { name: 'Full Overlay', price: 0.70 }
          ]
        },
        {
          name: 'Cabinet Colors', options: [
            { name: 'Painted', price: 0 },
            { name: 'Stain', price: 1 },
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Countertops',
      basePrice: 46.95,
      icon: 'table',
      options: [
        {
          name: 'Materials', options: [
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
      basePrice: 3.96,
      icon: 'paintbrush',
      options: [
        {
          name: 'Paint Colors', options: [
            { name: 'Neutral', price: 0 },
            { name: 'Bold', price: 0 },
            { name: 'Pastels', price: 0 },
            { name: 'Custom', price: "+c" }
          ]
        },
        {
          name: 'Accent Wall', options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: "+c" },
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'Appliance Selection & Upgrades',
      basePrice: 0,
      icon: 'microwave', options: [
        {
          name: 'Appliances', options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 7.08 },
            { name: 'Custom Design', price: "+c" }
          ]
        }
      ]
    }
  ];

  private items: Quote[] = [
    { id: 1, name: 'Avalon', size: 1620, folder: 'avalon', basePrice: 114.76, categories: this.categories },
    { id: 2, name: 'Cascade', size: 1470, folder: 'cascade', basePrice: 114.76, categories: this.categories },
    { id: 3, name: 'Estates', size: 1443, folder: 'estates', basePrice: 114.76, categories: this.categories },
    { id: 4, name: 'Jewel', size: 1470, folder: 'jewel', basePrice: 114.76, categories: this.categories },
    { id: 5, name: 'Pandora', size: 1400, folder: 'pandora', basePrice: 114.76, categories: this.categories }
  ];

  private iconMap: Record<string, any> = {
    home: Home,
    'door-open': DoorOpen,
    blinds: Blinds,
    'shower-head': ShowerHead,
    lightbulb: Lightbulb,
    grid: Grid,
    vault: Vault,
    table: Table,
    paintbrush: Paintbrush,
    microwave: Microwave
  };

  constructor() { }

  getItems(): Quote[] {
    return this.items;
  }

  getItemById(id: number): Quote | undefined {
    return this.items.find(item => item.id === id);
  }

  getImagesFromFolder(folder: string): string[] {
    return [
      `images/${folder}/image1.jpg`,
      `images/${folder}/image2.jpg`,
      `images/${folder}/image3.jpg`,
      `images/${folder}/image4.jpg`
    ];
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
    return type === 'basic' ? this.basicCategories : this.categories;
  }
}