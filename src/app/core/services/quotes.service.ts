import { Injectable } from '@angular/core';
import { Quote, QuoteCategory } from '../models/quote.model';
import { Home, DoorOpen, Blinds, ShowerHead, Lightbulb, Grid, Vault, Table, Paintbrush, Microwave } from 'lucide-angular';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private basicCategories: QuoteCategory[] = [
    {
      id: 1, name: 'Kitchen Cabinets', icon: 'vault', options: [
        { name: 'Shaker', price: 6000 },
        { name: 'Modern Flat-Panel', price: 5500 },
        { name: 'Traditional Raised-Panel', price: 5000 },
        { name: 'Rustic', price: 6500 }
      ]
    },
    {
      id: 2, name: 'Exterior Design', icon: 'home', options: [
        { name: 'Modern', price: 7000 },
        { name: 'Traditional', price: 6000 },
        { name: 'Contemporary', price: 8000 },
        { name: 'Craftsman', price: 7500 }
      ]
    },
    {
      id: 3, name: 'Interior Finish Level', icon: 'paintbrush', options: [
        { name: 'Standard', price: 5000 },
        { name: 'Premium', price: 7000 },
        { name: 'Luxury', price: 10000 },
        { name: 'Custom', price: 12000 }
      ]
    },
    {
      id: 4, name: 'Number of Bedrooms', icon: 'door-open', options: [
        { name: '2', price: 2000 },
        { name: '3', price: 3000 },
        { name: '4', price: 4000 },
        { name: '5+', price: 5000 }
      ]
    },
    {
      id: 5, name: 'Number of Bathrooms', icon: 'shower-head', options: [
        { name: '1', price: 1000 },
        { name: '2', price: 2000 },
        { name: '2.5', price: 2500 },
        { name: '3+', price: 3000 }
      ]
    }
  ];

  private categories: QuoteCategory[] = [
    {
      id: 1, name: 'Exterior Design', icon: 'home', options: [
        {
          name: 'Siding Materials', options: [
            { name: 'Vinyl', price: 3000 },
            { name: 'Wood', price: 5000 },
            { name: 'Stone', price: 7000 },
            { name: 'Brick', price: 6000 },
            { name: 'Stucco', price: 4000 }
          ]
        },
        {
          name: 'Roofing Styles', options: [
            { name: 'Shingle', price: 4000 },
            { name: 'Metal', price: 8000 },
            { name: 'Tile', price: 9000 },
            { name: 'Slate', price: 10000 }
          ]
        },
        {
          name: 'Driveway', options: [
            { name: 'As Is', price: 0 },
            { name: 'Custom', price: 5000 }
          ]
        }
      ]
    },
    {
      id: 2, name: 'Front Door Material', icon: 'door-open', options: [
        {
          name: 'Material', options: [
            { name: 'Wood', price: 3000 },
            { name: 'Fiberglass', price: 5000 },
            { name: 'Steel', price: 4000 },
            { name: 'Custom Design', price: 7000 }
          ]
        }
      ]
    },
    {
      id: 3, name: 'Window Design & Colors', icon: 'blinds', options: [
        {
          name: 'Window Colors', options: [
            { name: 'White', price: 2000 },
            { name: 'Black', price: 2500 },
            { name: 'Natural Wood', price: 3000 },
            { name: 'Custom', price: 5000 }
          ]
        },
        {
          name: 'Frame Materials', options: [
            { name: 'Wood', price: 3000 },
            { name: 'Vinyl', price: 2000 },
            { name: 'Aluminum', price: 4000 },
            { name: 'Fiberglass', price: 3500 }
          ]
        }
      ]
    },
    {
      id: 4, name: 'Bathroom Fixtures', icon: 'shower-head', options: [
        {
          name: 'Fixture Colors', options: [
            { name: 'Brass', price: 500 },
            { name: 'Black', price: 600 },
            { name: 'Brushed Nickel', price: 550 },
            { name: 'Chrome', price: 450 },
            { name: 'Gold', price: 700 },
            { name: 'Matte Black', price: 650 }
          ]
        }
      ]
    },
    {
      id: 5, name: 'Lighting Fixtures', icon: 'lightbulb', options: [
        {
          name: 'Lighting Colors', options: [
            { name: 'Black', price: 300 },
            { name: 'White', price: 300 },
            { name: 'Gold', price: 400 },
            { name: 'Bronze', price: 500 },
            { name: 'Silver', price: 350 },
            { name: 'Wood', price: 450 },
            { name: 'Custom', price: 600 }
          ]
        }
      ]
    },
    {
      id: 6, name: 'Flooring & Backsplashes', icon: 'grid', options: [
        {
          name: 'Flooring Materials', options: [
            { name: 'Hardwood', price: 7000 },
            { name: 'Tile', price: 6000 },
            { name: 'Luxury Vinyl', price: 5000 },
            { name: 'Carpet', price: 4000 },
            { name: 'Concrete', price: 3000 }
          ]
        },
        {
          name: 'Backsplash', options: [
            { name: 'Yes', price: 2000 },
            { name: 'No', price: 0 }
          ]
        }
      ]
    },
    {
      id: 7, name: 'Cabinetry', icon: 'vault', options: [
        {
          name: 'Cabinet Styles', options: [
            { name: 'Shaker', price: 6000 },
            { name: 'Modern', price: 5500 },
            { name: 'Traditional', price: 5000 },
            { name: 'Full Overlay', price: 6500 }
          ]
        },
        {
          name: 'Cabinet Colors', options: [
            { name: 'Stain', price: 3000 },
            { name: 'Painted', price: 3500 }
          ]
        }
      ]
    },
    {
      id: 8, name: 'Countertops', icon: 'table', options: [
        {
          name: 'Materials', options: [
            { name: 'Granite', price: 8000 },
            { name: 'Quartz', price: 9000 },
            { name: 'Marble', price: 10000 },
            { name: 'Concrete', price: 7000 },
            { name: 'Butcher Block', price: 6000 }
          ]
        }
      ]
    },
    {
      id: 9, name: 'Paint & Accent Walls', icon: 'paintbrush', options: [
        {
          name: 'Paint Colors', options: [
            { name: 'Neutral', price: 3000 },
            { name: 'Bold', price: 4000 },
            { name: 'Pastels', price: 3500 },
            { name: 'Custom', price: 5000 }
          ]
        },
        {
          name: 'Accent Wall', options: [
            { name: 'Yes', price: 2000 },
            { name: 'No', price: 0 }
          ]
        }
      ]
    },
    {
      id: 10, name: 'Appliance Selection & Upgrades', icon: 'microwave', options: [
        {
          name: 'Appliances', options: [
            { name: 'Yes', price: 15000 },
            { name: 'No', price: 0 },
            { name: 'Custom Design', price: 20000 }
          ]
        },
        {
          name: 'Smart Home Integration', options: [
            { name: 'Climate Control', price: 5000 },
            { name: 'Security', price: 6000 },
            { name: 'Lighting', price: 4000 },
            { name: 'Entertainment', price: 7000 },
            { name: 'Tesla', price: 10000 },
            { name: 'Custom Design', price: 12000 }
          ]
        }
      ]
    }
  ];

  private items: Quote[] = [
    { id: 1, name: 'Avalon', size: '7400 FT SQ', folder: 'avalon', categories: this.categories },
    { id: 2, name: 'Cascade', size: '3200 FT SQ', folder: 'cascade', categories: this.categories },
    { id: 3, name: 'Estates', size: '7800 FT SQ', folder: 'estates', categories: this.categories },
    { id: 4, name: 'Jewel', size: '2230 FT SQ', folder: 'jewel', categories: this.categories },
    { id: 5, name: 'Pandora', size: '4444 FT SQ', folder: 'pandora', categories: this.categories }
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