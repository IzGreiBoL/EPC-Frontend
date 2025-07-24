import { Injectable } from '@angular/core';
import type { Option } from '../models/quote.model';
import { QuoteCategory } from '../models/quote.model';

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
    size: number
  ): { total: number; pricePerFt: number; hasCustom: boolean } {

    let sum = 0;
    let hasCustom = false;
    const counted = new Set<any>();

    Object.values(userSelections).forEach(sel => {
      const [catOrSubcat, selName] = sel.split(': ').map(s => s.trim());

      // Busca la categoría y la subcategoría (si aplica)
      const cat = categories.find(c =>
        c.options.some(o =>
          this.isSub(o)
            ? o.name === catOrSubcat
            : c.name === catOrSubcat
        )
      );
      if (!cat) { return; }

      // Busca la subcategoría u opción
      let subOpt;
      if (cat.options.some(o => this.isSub(o) && o.name === catOrSubcat)) {
        subOpt = cat.options.find(o => this.isSub(o) && o.name === catOrSubcat);
      } else {
        subOpt = cat.options.find(o => !this.isSub(o) && cat.name === catOrSubcat);
      }

      if (subOpt && this.isSub(subOpt)) {
        if (!counted.has(subOpt)) {
          sum += (subOpt as any).basePrice ?? 0;
          counted.add(subOpt);
          // Debug
          console.log(`+ basePrice subcat: ${subOpt.name} = ${(subOpt as any).basePrice ?? 0}`);
        }
        const opt = subOpt.options.find(o => o.name === selName);
        if (!opt) return;
        if (typeof opt.price === 'number') {
          sum += opt.price;
          // Debug
          console.log(`+ option price: ${opt.name} = ${opt.price}`);
        }
        if (opt.price === '+c') hasCustom = true;
      } else if (subOpt && !this.isSub(subOpt)) {
        if (!counted.has(cat)) {
          sum += cat.basePrice ?? 0;
          counted.add(cat);
          // Debug
          console.log(`+ basePrice cat: ${cat.name} = ${cat.basePrice ?? 0}`);
        }
        const opt = subOpt as Option;
        if (typeof opt.price === 'number') {
          sum += opt.price;
          // Debug
          console.log(`+ option price: ${opt.name} = ${opt.price}`);
        }
        if (opt.price === '+c') hasCustom = true;
      }
    });

    // Debug
    console.log(`basePrice modelo: ${basePrice}, sum: ${sum}, size: ${size}`);

    const pricePerFt = basePrice + sum;
    const total = size * pricePerFt;

    return { total, pricePerFt, hasCustom };
  }

  /* CUSTOM */
  calcCustom(i: CustomInput): { total: number; pricePerFt: number } {
    const pricePerFt = i.basePrice;
    const total = pricePerFt * i.sqft
      + (i.bedrooms - 3) * 7500
      + (i.bathrooms - 2) * 6000;
    return { total, pricePerFt };
  }

  private isSub(item: unknown): item is { options: Option[] } {
    return !!item && typeof item === 'object' && 'options' in item;
  }
}