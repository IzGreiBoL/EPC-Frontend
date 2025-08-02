import { Injectable } from '@angular/core';
import { Quote, QuoteCategory } from '../models/quote.model';
import { Home, DoorOpen, Blinds, ShowerHead, Lightbulb, Grid, Vault, Table, Paintbrush, Microwave } from 'lucide-angular';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(private config: ConfigService) { }

  get BASIC_QUOTE_BASE_PRICE(): number {
    return this.config.basicQuoteBasePrice;
  }

  get ADVANCED_QUOTE_BASE_PRICE(): number {
    return this.config.advancedQuoteBasePrice;
  }

  get REMODEL_QUOTE_BASE_PRICE(): number {
    return this.config.remodelQuoteBasePrice;
  }

  get CUSTOM_QUOTE_BASE_PRICE(): number {
    return this.config.customQuoteBasePrice;
  }

  // Usar configuración centralizada para categorías y modelos
  private get basicCategories() {
    return this.config.getBasicCategories();
  }

  private get advancedCategories() {
    return this.config.getAdvancedCategories();
  }

  private get items() {
    return this.config.getHouseModels().map((model: any) => ({
      ...model,
      categories: model.id === 999 ? [] : this.advancedCategories
    }));
  }

  private iconMap: Record<string, unknown> = {
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

  getItems(): Quote[] {
    return this.items;
  }

  getItemById(id: number): Quote | undefined {
    return this.items.find((item: any) => item.id === id);
  }

  getImagesFromFolder(folder: string): string[] {
    // Busca el item, pero si no existe, usa un valor por defecto
    const item = this.items.find((i: any) => i.folder === folder);
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

  getIcon(iconName: string): unknown {
    return this.iconMap[iconName] || null;
  }

  getIconByCategory(category: QuoteCategory): unknown {
    return this.getIcon(category.icon);
  }

  getCategoriesByType(type: 'basic' | 'advanced'): QuoteCategory[] {
    return type === 'basic' ? this.basicCategories : this.advancedCategories;
  }

  buildCustomCategory(): QuoteCategory[] {
    return this.config.getCustomCategories();
  }

  buildRemodelCategory(): QuoteCategory[] {
    return this.config.getRemodelCategories();
  }
}