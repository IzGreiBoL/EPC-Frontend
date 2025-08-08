import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';
import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { Quote, QuoteCategory } from '../../../core/models/quote.model';
import { QuoteConfiguratorComponent } from "../configurator/quote-configurator.component";
import { ScrollUtils } from '../../../core/utils/scroll.utils';

@Component({
  selector: 'app-basic-quote',
  template: `<app-quote-configurator
    [item]="item"
    [categories]="categories"
    [galleryItems]="galleryItems"
    [quoteType]="'basic'"
    [isMobile]="isMobile"
    [gallerySize]="gallerySize"
    [pricingService]="pricingAdapter"
    (previousCategory)="previousCategory()"
    (nextCategory)="nextCategory()"
    (requestQuote)="requestQuote()"
    (toggleBreakdown)="toggleBreakdown()"
  ></app-quote-configurator>`,
  standalone: true,
  imports: [QuoteConfiguratorComponent],
})
export class BasicQuoteComponent implements OnInit {
  item?: Quote;
  categories: QuoteCategory[] = [];
  galleryItems: { image: string; title: number }[] = [];
  userSelections: Record<string, string> = {};
  customValues = { sqft: 2000, bedrooms: 3, bathrooms: 2 };
  currentCategoryIndex = 0;
  isMobile = false;
  gallerySize: 'small' | 'large' = 'large';
  totalNumeric = 0;
  pricePerSqFtNum = 0;
  hasCustomOption = false;
  formattedSelections: { category: string; subcategories: string[] }[] = [];
  showBreakdown = false;
  breakdownItems: { name: string; price: number | string }[] = [];
  basePrice = 0;
  private touched: Record<number, Set<number>> = {};
  pricingAdapter: any;

  constructor(
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    public pricing: QuotePricingService,
    private resizeService: ResizeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Reset scroll position when component loads
    ScrollUtils.scrollToTop();
    
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.item = this.quotesService.getItemById(id);
      if (!this.item) return;

      this.basePrice = this.quotesService.BASIC_QUOTE_BASE_PRICE;
      const images = this.quotesService.getImagesFromFolder(this.item.folder);
      this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

      this.categories = this.quotesService.getCategoriesByType('basic');
      this.initPreSelections();
      this.updateFormattedSelections();
      this.calculateTotal();

      this.pricingAdapter = {
        calcStandard: (
          categories: QuoteCategory[],
          userSelections: Record<string, string>,
          basePrice: number,
          size: number
        ) => {
          const result = this.pricing.calcStandard(
            categories, 
            userSelections, 
            basePrice,
            size
          );
          return {
            total: result.total,
            pricePerFt: result.pricePerFt,
            hasCustom: result.hasCustom
          };
        }
      };
    });
    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  get currentCategory(): QuoteCategory | undefined {
    return this.categories[this.currentCategoryIndex];
  }

  get totalSteps(): number {
    return this.categories.length;
  }

  initPreSelections(): void {
    this.userSelections = {};
    this.categories.forEach((cat, catIdx) => {
      if (cat.options.length) {
        const opt = cat.options[0];
        this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
      }
    });
  }

  selectOption(event: { subIdx: number; optIdx: number }): void {
    const category = this.currentCategory;
    if (!category?.options) return;

    Object.keys(this.userSelections).forEach(k => {
      if (k.startsWith(`${this.currentCategoryIndex}_`)) delete this.userSelections[k];
    });

    const option = category.options[event.optIdx];
    this.userSelections[`${this.currentCategoryIndex}_${event.optIdx}`] = `${category.name}: ${option.name}`;
    this.updateFormattedSelections();
    this.calculateTotal();
  }

  previousCategory(): void {
    if (this.currentCategoryIndex > 0) {
      this.currentCategoryIndex--;
      this.updateFormattedSelections();
    }
  }

  nextCategory(): void {
    if (this.currentCategoryIndex < this.categories.length - 1) {
      this.currentCategoryIndex++;
      this.updateFormattedSelections();
    }
  }

  updateFormattedSelections(): void {
    const grouped: { category: string; subcategories: string[] }[] = [];
    this.categories.forEach((cat, catIdx) => {
      const subcategories: string[] = [];
      cat.options.forEach((_opt, subIdx) => {
        const key = `${catIdx}_${subIdx}`;
        if (this.userSelections[key]) {
          subcategories.push(this.userSelections[key]);
        }
      });
      if (subcategories.length) {
        grouped.push({ category: cat.name, subcategories });
      }
    });
    this.formattedSelections = grouped;
  }

  calculateTotal(): void {
    if (!this.item) return;
    const { pricePerFt, hasCustom } = this.pricing.calcStandard(
      this.categories,
      this.userSelections,
      this.quotesService.BASIC_QUOTE_BASE_PRICE,
      this.item.size
    );
    const size = this.item.size ?? 0;
    const total = pricePerFt * size;
    this.totalNumeric = total;
    this.hasCustomOption = hasCustom;
    this.pricePerSqFtNum = pricePerFt;
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  toggleBreakdown(): void {
    this.showBreakdown = !this.showBreakdown;
    if (this.showBreakdown) this.updateBreakdown();
  }

  updateBreakdown(): void {
    this.breakdownItems = Object.values(this.userSelections).map(sel => {
      const selName = sel.split(': ')[1];
      const cat = this.categories.find(c =>
        c.options.some(o => o.name === selName)
      );
      const opt = cat?.options.find(o => o.name === selName && Object.prototype.hasOwnProperty.call(o, 'price'));
      return { name: sel, price: opt && typeof (opt as { price?: number }).price === 'number' ? (opt as { price: number }).price : 0 };
    });
  }
}