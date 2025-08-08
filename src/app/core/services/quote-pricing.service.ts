import { Injectable } from '@angular/core';
import type { Option } from '../models/quote.model';
import { QuoteCategory } from '../models/quote.model';
import { ConfigService } from './config.service';

export interface CustomInput {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
}

@Injectable({ providedIn: 'root' })
export class QuotePricingService {

  constructor(private config: ConfigService) { }

  calcStandard(
    categories: QuoteCategory[],
    userSelections: Record<string, string>,
    basePrice: number,
    size: number
  ): { total: number; pricePerFt: number; hasCustom: boolean } {

    let sum = 0;
    let hasCustom = false;
    const counted = new Set<unknown>();

    Object.values(userSelections).forEach(sel => {
      const [catOrSubcat, selName] = sel.split(': ').map(s => s.trim());

      // Busca la categoría
      const cat = categories.find(c => c.name === catOrSubcat || c.options.some(o =>
        this.isSub(o) ? o.name === catOrSubcat : false
      ));
      if (!cat) { return; }

      // Si la categoría tiene subcategorías (avanzado)
      if (cat.options.some(o => this.isSub(o))) {
        const subOpt = cat.options.find(o => this.isSub(o) && o.name === catOrSubcat);
        if (subOpt && this.isSub(subOpt)) {
          if (!counted.has(subOpt)) {
            sum += (subOpt as unknown as { basePrice?: number }).basePrice ?? 0;
            counted.add(subOpt);
          }
          const opt = subOpt.options.find(o => o.name === selName);
          if (!opt) return;
          if (typeof opt.price === 'number') sum += opt.price;
          if (opt.price === '+c') hasCustom = true;
        }
      } else {
        // Categoría básica: buscar opción por nombre
        const opt = cat.options.find(o => o.name === selName);
        if (!counted.has(cat)) {
          sum += cat.basePrice ?? 0;
          counted.add(cat);
        }
        // Solo sumar si opt es Option y tiene price
        if (opt && 'price' in opt && typeof opt.price === 'number') sum += opt.price;
        if (opt && 'price' in opt && opt.price === '+c') hasCustom = true;
      }
    });

    const pricePerFt = basePrice + sum;
    const total = size * pricePerFt;

    return { total, pricePerFt, hasCustom };
  }

  /* CUSTOM */
  calcCustom(i: CustomInput): { total: number; pricePerFt: number } {
    const pricePerFt = i.basePrice;
    const total = pricePerFt * i.sqft
      + (i.bedrooms - this.config.defaultBedrooms) * this.config.bedroomExtraPrice
      + (i.bathrooms - this.config.defaultBathrooms) * this.config.bathroomExtraPrice;
    return { total, pricePerFt };
  }

  private isSub(item: unknown): item is { options: Option[] } {
    return !!item && typeof item === 'object' && 'options' in item;
  }
}