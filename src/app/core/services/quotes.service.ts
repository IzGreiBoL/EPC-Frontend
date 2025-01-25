import { Injectable } from '@angular/core';
import { Quote, QuoteCategory } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private categories: QuoteCategory[] = [
    {
      id: 1, name: 'Exterior Design', options: [
        { name: 'Siding Materials', options: ['Vinyl', 'Wood', 'Stone', 'Brick', 'Stucco'] },
        { name: 'Roofing Styles', options: ['Shingle', 'Metal', 'Tile', 'Slate'] },
        { name: 'Driveway', options: ['As Is', 'Custom'] }
      ]
    },
    {
      id: 2, name: 'Front Door Material', options: [
        'Wood',
        'Fiberglass',
        'Steel',
        'Custom Design'
      ]
    },
    {
      id: 3, name: 'Window Design & Colors', options: [
        { name: 'Window Colors', options: ['White', 'Black', 'Natural Wood', 'Custom'] },
        { name: 'Frame Materials', options: ['Wood', 'Vinyl', 'Aluminum', 'Fiberglass'] }
      ]
    },
    {
      id: 4, name: 'Bathroom Fixtures', options: [
        { name: 'Fixture Colors', options: ['Brass', 'Black', 'Brushed Nickel', 'Chrome', 'Gold', 'Matte Black'] }
      ]
    },
    {
      id: 5, name: 'Lighting Fixtures', options: [
        { name: 'Lighting Colors', options: ['Black', 'White', 'Gold', 'Bronze', 'Silver', 'Wood', 'Custom'] }
      ]
    },
    {
      id: 6, name: 'Flooring & Backsplashes', options: [
        { name: 'Flooring Materials', options: ['Hardwood', 'Tile', 'Luxury Vinyl', 'Carpet', 'Concrete'] },
        { name: 'Backsplash', options: ['Yes', 'No'] }
      ]
    },
    {
      id: 7, name: 'Cabinetry', options: [
        { name: 'Cabinet Styles', options: ['Shaker', 'Modern', 'Traditional', 'Full Overlay'] },
        { name: 'Cabinet Colors', options: ['Stain', 'Painted'] }
      ]
    },
    {
      id: 8, name: 'Countertops', options: [
        { name: 'Materials', options: ['Granite', 'Quartz', 'Marble', 'Concrete', 'Butcher Block'] }
      ]
    },
    {
      id: 9, name: 'Paint & Accent Walls', options: [
        { name: 'Paint Colors', options: ['Neutral', 'Bold', 'Pastels', 'Custom'] },
        { name: 'Accent Wall', options: ['Yes', 'No'] }
      ]
    },
    {
      id: 10, name: 'Appliance Selection & Upgrades', options: [
        { name: 'Appliances', options: ['Yes', 'No', 'Custom Design'] },
        {
          name: 'Smart Home Integration', options: ['Climate Control',
            'Security',
            'Lighting',
            'Entertainment',
            'Tesla',
            'Custom Design']
        },
      ]
    }
  ];

  private items: Quote[] = [
    { id: 1, image: 'images/house.jpg', text: '7400 FT SQ', categories: this.categories },
    { id: 2, image: 'images/house1.jpg', text: '3200 FT SQ', categories: this.categories },
    { id: 3, image: 'images/house2.jpg', text: '7800 FT SQ', categories: this.categories },
    { id: 4, image: 'images/house3.jpg', text: '2230 FT SQ', categories: this.categories },
    { id: 5, image: 'images/house4.jpeg', text: '4444 FT SQ', categories: this.categories }
  ];

  constructor() { }

  getItems(): Quote[] {
    return this.items;
  }

  getItemById(id: number): Quote | undefined {
    return this.items.find(item => item.id === id);
  }
}