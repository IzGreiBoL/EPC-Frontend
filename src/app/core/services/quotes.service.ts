import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private items: Quote[] = [
    { id: 1, image: 'images/house.jpg', text: '7400 FT SQ' },
    { id: 2, image: 'images/house1.jpg', text: '3200 FT SQ' },
    { id: 3, image: 'images/house2.jpg', text: '7800 FT SQ' },
    { id: 4, image: 'images/house3.jpg', text: '2230 FT SQ' },
    { id: 5, image: 'images/house4.jpeg', text: '4444 FT SQ' },
  ];

  constructor() {}

  getItems(): Quote[] {
    return this.items;
  }

  getItemById(id: number): Quote | undefined {
    return this.items.find(item => item.id === id);
  }
}