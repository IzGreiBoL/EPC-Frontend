import { Injectable } from '@angular/core';
import { Option, QuoteCategory } from '../models/quote.model';

export interface CustomInput {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
}

@Injectable({ providedIn: 'root' })
export class QuotePricingService {

  calcStandard(
    categories: QuoteCategory[],
    userSelections: Record<string, string>,
    basePrice: number,
  ): { pricePerFt: number; hasCustom: boolean } {

    const counted = new Set<number>();
    let extraPerFt = 0;
    let hasCustom = false;

    Object.values(userSelections).forEach(sel => {
      const selName = sel.split(': ')[1];

      const cat = categories.find(c =>
        c.options.some(o =>
          this.isSub(o)
            ? o.options.some(s => s.name === selName)
            : (o as Option).name === selName
        )
      );
      if (!cat) { return; }

      const opt = cat.options
        .flatMap(o => this.isSub(o) ? o.options : [o as Option])
        .find(o => o.name === selName);
      if (!opt) { return; }

      if (!counted.has(cat.id)) {
        extraPerFt += cat.basePrice ?? 0;
        counted.add(cat.id);
      }

      if (typeof opt.price === 'number')  extraPerFt += opt.price;
      if (opt.price === '+c')             hasCustom  = true;
    });

    return { pricePerFt: basePrice + extraPerFt, hasCustom };
  }

  /* CUSTOM */
  calcCustom(i: CustomInput): { total: number; pricePerFt: number } {
    const pricePerFt = i.basePrice;
    const total = pricePerFt * i.sqft
      + (i.bedrooms  - 3) * 7500
      + (i.bathrooms - 2) * 6000;
    return { total, pricePerFt };
  }

  private isSub(item: unknown): item is { options: Option[] } {
    return !!item && typeof item === 'object' && 'options' in item;
  }
}
