import {
  Component, HostListener, Inject, OnInit, PLATFORM_ID,
  CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import {
  Quote, SubCategory, QuoteCategory, Option,
} from '../../../core/models/quote.model';
import {
  NgFor, CurrencyPipe, CommonModule, isPlatformBrowser,
} from '@angular/common';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { LucideAngularModule, Mail } from 'lucide-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from './quote-modal/quote-modal.component';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    CurrencyPipe,
    LucideAngularModule,
    FormsModule,
    GalleryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuoteDetailComponent implements OnInit {
  item?: Quote;
  galleryItems: { image: string; title: number }[] = [];
  currentCategoryIndex = 0;
  userSelections: Record<string, string> = {};
  estimatedTotal = '0';
  basePrice = 0;
  showBreakdown = false;
  formattedSelections: { category: string; subcategories: string[] }[] = [];
  breakdownItems: { name: string; price: number | string }[] = [];
  mailIcon = Mail;
  quoteType: 'basic' | 'advanced' | 'custom' = 'basic';
  gallerySize: 'small' | 'large' = 'large';
  isMobile = window.innerWidth < 768;
  pricePerSqFtNum = 0;
  numericTotal = 0;
  hasCustomOption = false;

  customValues: Record<'sqft' | 'bedrooms' | 'bathrooms', number> = {
    sqft: 2000,
    bedrooms: 3,
    bathrooms: 2,
  };

  private touched: Record<number, Set<number>> = {};

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    public quotesService: QuotesService,
    private pricing: QuotePricingService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      const type = this.route.snapshot.paramMap.get('type') as 'basic' | 'advanced' | 'custom';
      this.quoteType = type || 'basic';

      this.item = this.quotesService.getItemById(id);
      if (!this.item) return;

      this.basePrice = this.item.basePrice ?? 0;
      const images = this.quotesService.getImagesFromFolder(this.item.folder);
      this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

      if (this.quoteType === 'custom') {
        this.item.categories = this.buildCustomCategory();
      } else {
        this.item.categories = this.quotesService.getCategoriesByType(this.quoteType);
      }

      this.initPreSelections();
      this.updateFormattedSelections();
      this.calculateTotal();
    });

    this.updateGallerySize();
  }

  @HostListener('window:resize')
  onResize(): void { this.updateGallerySize(); }

  private updateGallerySize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const w = window.innerWidth;
      this.gallerySize = w < 768 ? 'small' : 'large';
      this.isMobile = w < 768;
    }
  }

  get currentCategory(): QuoteCategory | undefined {
    return this.item?.categories[this.currentCategoryIndex];
  }
  get totalSteps(): number {
    return this.item?.categories.length ?? 0;
  }
  get progress(): number {
    return ((this.currentCategoryIndex + 1) / (this.totalSteps || 1)) * 100;
  }
  get totalNumeric(): number {
    return Number(this.estimatedTotal);
  }

  optionlessCategoryHasFields(): boolean {
    return this.quoteType === 'custom' && !!(this.currentCategory as QuoteCategory)?.fields;
  }

  private initPreSelections(): void {
    this.userSelections = {};
    if (!this.item) return;

    if (this.quoteType !== 'custom') {
      this.item.categories.forEach((cat, catIdx) => {
        if (this.quoteType === 'basic') {
          if (cat.options.length) {
            const opt = cat.options[0] as Option;
            this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
          }
        } else {
          cat.options.forEach((opt, subIdx) => {
            if (this.isSubcategory(opt)) {
              this.userSelections[`${catIdx}_${subIdx}`] =
                `${opt.name}: ${opt.options[0]?.name ?? ''}`;
            } else {
              this.userSelections[`${catIdx}_${subIdx}`] =
                `${cat.name}: ${(opt as Option).name}`;
            }
          });
        }
      });
    }
  }

  selectOption(subIdx: number, optIdx: number): void {
    if (this.quoteType === 'custom') return;

    const category = this.currentCategory;
    if (!category?.options) return;

    const option = category.options[subIdx];

    if (this.quoteType === 'basic') {
      Object.keys(this.userSelections).forEach(k => {
        if (k.startsWith(`${this.currentCategoryIndex}_`)) delete this.userSelections[k];
      });
      this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
        `${category.name}: ${(option as Option).name}`;
    } else {
      delete this.userSelections[`${this.currentCategoryIndex}_${subIdx}`];

      if (this.isSubcategory(option)) {
        const subOpt = option.options[optIdx];
        if (subOpt) {
          this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
            `${option.name}: ${subOpt.name}`;
        }
      } else {
        this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
          `${category.name}: ${(option as Option).name}`;
      }
    }

    if (!this.touched[this.currentCategoryIndex]) {
      this.touched[this.currentCategoryIndex] = new Set<number>();
    }
    this.touched[this.currentCategoryIndex].add(subIdx);

    if (this.isCurrentCategoryComplete()) {
      this.goToNextCategory();
      this.cdr.detectChanges();
    }

    this.updateFormattedSelections();
    this.calculateTotal();
  }

  onCustomFieldChange<K extends keyof typeof this.customValues>(k: K, v: any): void {
    this.customValues[k] = Number(v);
    this.calculateTotal();
  }

  updateFormattedSelections(): void {
    if (this.quoteType === 'custom') {
      this.formattedSelections = [{
        category: 'Custom parameters',
        subcategories: [
          `sqft: ${this.customValues.sqft}`,
          `Bedrooms: ${this.customValues.bedrooms}`,
          `Bathrooms: ${this.customValues.bathrooms}`,
        ],
      }];
      return;
    }

    const grouped: { category: string; subcategories: string[] }[] = [];

    Object.entries(this.userSelections).forEach(([key, value]) => {
      const [catIdx] = key.split('_');
      const cat = this.item?.categories[+catIdx];
      if (!cat) return;

      let group = grouped.find(g => g.category === cat.name);
      if (!group) {
        group = { category: cat.name, subcategories: [] };
        grouped.push(group);
      }
      group.subcategories.push(value);
    });

    this.formattedSelections = grouped;
  }

  calculateTotal(): void {
    if (!this.item) return;

    if (this.quoteType === 'custom') {
      const { total, pricePerFt } = this.pricing.calcCustom({
        ...this.customValues,
        basePrice: this.basePrice,
      });
      this.numericTotal = total;
      this.estimatedTotal = total.toFixed(2);
      this.pricePerSqFtNum = pricePerFt;
      this.hasCustomOption = false;
      return;
    }

    const { pricePerFt, hasCustom } = this.pricing.calcStandard(
      this.item.categories,
      this.userSelections,
      this.basePrice,
    );

    const size = this.item.size ?? 0;
    const total = pricePerFt * size;

    this.numericTotal = total;
    this.hasCustomOption = hasCustom;
    this.estimatedTotal = total.toFixed(2);
    this.pricePerSqFtNum = pricePerFt;
  }

  isSelected(subIdx: number, optIdx: number): boolean {
    const category = this.currentCategory;
    if (!category?.options) return false;

    const option = category.options[subIdx];

    if (this.isSubcategory(option)) {
      const selName = option.options[optIdx]?.name;
      return Object.values(this.userSelections).includes(`${option.name}: ${selName}`);
    }
    return Object.values(this.userSelections).includes(`${category.name}: ${(option as Option).name}`);
  }

  isSubcategory(item: unknown): item is SubCategory {
    return typeof item === 'object' && item !== null &&
      'name' in item && 'options' in item;
  }

  private isCurrentCategoryComplete(): boolean {
    const cat = this.currentCategory;
    if (!cat) return false;

    const touchedSet = this.touched[this.currentCategoryIndex] ?? new Set<number>();
    return cat.options.every((_o, idx) => touchedSet.has(idx));
  }

  private goToNextCategory(): void {
    if (this.hasNext()) {
      this.currentCategoryIndex++;
      if (!this.touched[this.currentCategoryIndex]) {
        this.touched[this.currentCategoryIndex] = new Set<number>();
      }
      this.updateFormattedSelections();
    }
  }

  previousCategory(): void {
    if (this.hasPrevious()) {
      this.currentCategoryIndex--;
      this.updateFormattedSelections();
    }
  }
  nextCategory(): void { if (this.hasNext()) this.goToNextCategory(); }

  hasPrevious(): boolean { return this.currentCategoryIndex > 0; }
  hasNext(): boolean { return this.currentCategoryIndex < (this.totalSteps - 1); }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  toggleBreakdown(): void {
    this.showBreakdown = !this.showBreakdown;
    if (this.showBreakdown) this.updateBreakdown();
  }

  updateBreakdown(): void {
    if (this.quoteType === 'custom') {
      this.breakdownItems = [
        { name: 'Square footage', price: this.customValues.sqft },
        { name: 'Bedrooms', price: this.customValues.bedrooms },
        { name: 'Bathrooms', price: this.customValues.bathrooms },
      ];
      return;
    }

    this.breakdownItems = Object.values(this.userSelections).map(sel => {
      const selName = sel.split(': ')[1];
      const cat = this.item?.categories.find(c =>
        c.options.some(o =>
          this.isSubcategory(o)
            ? o.options.some(s => s.name === selName)
            : (o as Option).name === selName
        )
      );
      const opt = cat?.options
        .flatMap(o => this.isSubcategory(o) ? o.options : [o as Option])
        .find(o => o.name === selName);

      return { name: sel, price: opt?.price ?? 0 };
    });
  }

  getIconByCategory(name: string): readonly any[] | undefined {
    const cat = this.item?.categories.find(c => c.name === name);
    const icon = cat ? this.quotesService.getIconByCategory(cat) : undefined;
    return typeof icon === 'string' || icon == null ? undefined : icon;
  }

  private buildCustomCategory(): QuoteCategory[] {
    return [{
      id: 999,
      name: 'Custom parameters',
      icon: 'home',
      basePrice: 0,
      options: [],
      fields: [
        { key: 'sqft', label: 'Square footage', type: 'number' },
        { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
        { key: 'bathrooms', label: 'Bathrooms', type: 'number' },
      ],
    }];
  }
}
