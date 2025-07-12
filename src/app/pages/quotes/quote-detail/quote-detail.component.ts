import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote, SubCategory } from '../../../core/models/quote.model';
import { NgFor, CurrencyPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { LucideAngularModule, Mail } from 'lucide-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from './quote-modal/quote-modal.component';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, LucideAngularModule, GalleryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuoteDetailComponent implements OnInit {

  /* propiedades de la vista */
  item: Quote | undefined;
  galleryItems: { image: string; title: number }[] = [];
  currentCategoryIndex = 0;
  /** clave:  `${catIdx}_${subIdx}`  →  texto mostrado */
  userSelections: Record<string, string> = {};
  estimatedTotal: number | string = 0;
  basePrice = 0;
  showBreakdown = false;
  formattedSelections: { category: string; subcategories: string[] }[] = [];
  breakdownItems: { name: string; price: number | string }[] = [];
  mailIcon = Mail;
  quoteType: 'basic' | 'advanced' = 'basic';
  gallerySize: 'small' | 'large' = 'large';
  pricePerSqFtNum = 0;
  numericTotal = 0;
  hasCustomOption = false;

  /* registra qué subcategorías el usuario ya tocó            */
  /** índiceDeCategoría → conjunto de subíndices ya clicados */
  private touched: Record<number, Set<number>> = {};

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public quotesService: QuotesService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) { }

  /* ciclo de vida*/
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      const type = this.route.snapshot.paramMap.get('type') as 'basic' | 'advanced';
      this.quoteType = type || 'basic';

      this.item = this.quotesService.getItemById(id);
      if (!this.item) { return; }

      this.basePrice = (this.item as any).basePrice;
      const images = this.quotesService.getImagesFromFolder(this.item.folder);
      this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

      /* categorías según versión */
      this.item.categories = this.quotesService.getCategoriesByType(this.quoteType);

      /* pre‑selecciones (no cuentan como “tocadas”) */
      this.item.categories.forEach((cat, catIdx) => {
        if (this.quoteType === 'basic') {
          if (cat.options.length) {
            const opt = cat.options[0];
            this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
          }
        } else {
          cat.options.forEach((opt, subIdx) => {
            if (this.isSubcategory(opt)) {
              this.userSelections[`${catIdx}_${subIdx}`] = `${opt.name}: ${opt.options[0]?.name ?? ''}`;
            } else {
              this.userSelections[`${catIdx}_${subIdx}`] = `${cat.name}: ${opt.name}`;
            }
          });
        }
      });

      this.updateFormattedSelections();
      this.calculateTotal();
    });

    this.updateGallerySize();
  }

  /*eventos de ventana */
  @HostListener('window:resize')
  onResize(): void { this.updateGallerySize(); }

  private updateGallerySize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const w = window.innerWidth;
      this.gallerySize = w < 768 ? 'small' : 'large';
    }
  }

  /* getters rápidos */
  get currentCategory() { return this.item?.categories[this.currentCategoryIndex]; }
  get totalSteps() { return this.item?.categories.length ?? 0; }
  get progress() { return ((this.currentCategoryIndex + 1) / (this.totalSteps || 1)) * 100; }

  /*handler principal*/
  selectOption(subIdx: number, optIdx: number): void {
    const category = this.currentCategory;
    if (!category?.options) { return; }

    const option = category.options[subIdx];

    /* limpieza y escritura según modo */
    if (this.quoteType === 'basic') {
      Object.keys(this.userSelections).forEach(k => {
        if (k.startsWith(`${this.currentCategoryIndex}_`)) { delete this.userSelections[k]; }
      });
      this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
        `${category.name}: ${option.name}`;
    } else { /* advanced */
      Object.keys(this.userSelections).forEach(k => {
        if (k === `${this.currentCategoryIndex}_${subIdx}`) { delete this.userSelections[k]; }
      });

      if (this.isSubcategory(option)) {
        const subOpt = option.options[optIdx];
        if (subOpt) {
          this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
            `${option.name}: ${subOpt.name}`;
        }
      } else {
        this.userSelections[`${this.currentCategoryIndex}_${subIdx}`] =
          `${category.name}: ${option.name}`;
      }
    }

    /*marcar subcategoría como “tocada” */
    if (!this.touched[this.currentCategoryIndex]) {
      this.touched[this.currentCategoryIndex] = new Set<number>();
    }
    this.touched[this.currentCategoryIndex].add(subIdx);

    /* avance automático */
    if (this.isCurrentCategoryComplete()) { this.goToNextCategory(); }

    this.updateFormattedSelections();
    this.calculateTotal();
  }

  /* helpers de formato */
  updateFormattedSelections(): void {
    const grouped: { category: string; subcategories: string[] }[] = [];

    Object.entries(this.userSelections).forEach(([key, value]) => {
      const [catIdx] = key.split('_');
      const cat = this.item?.categories[+catIdx];
      if (!cat) { return; }

      let group = grouped.find(g => g.category === cat.name);
      if (!group) { group = { category: cat.name, subcategories: [] }; grouped.push(group); }
      group.subcategories.push(value);
    });

    this.formattedSelections = grouped;
  }

  /* cálculo de totales*/
  calculateTotal(): void {
    const counted = new Set<number>();
    let extraPerFt = 0;
    let hasCustom = false;

    Object.values(this.userSelections).forEach(sel => {
      const selName = sel.split(': ')[1];

      const cat = this.item?.categories.find(c =>
        c.options.some(o =>
          this.isSubcategory(o)
            ? o.options.some(s => s.name === selName)
            : o.name === selName
        )
      );
      if (!cat) { return; }

      const opt = cat.options
        .flatMap(o => this.isSubcategory(o) ? o.options : [o])
        .find(o => o.name === selName);
      if (!opt) { return; }

      if (!counted.has(cat.id)) {
        extraPerFt += cat.basePrice ?? 0;
        counted.add(cat.id);
      }

      if (typeof opt.price === 'number') { extraPerFt += opt.price; }
      else if (opt.price === '+c') { hasCustom = true; }
    });

    const pricePerFt = this.basePrice + extraPerFt;
    const size = (this.item as any)?.size ?? 0;
    const total = pricePerFt * size;

    this.numericTotal = total;
    this.hasCustomOption = hasCustom;
    this.estimatedTotal = hasCustom ? `${total.toFixed(2)} + c` : total.toFixed(2);
    this.pricePerSqFtNum = pricePerFt;
  }

  /* ────────────utilidades──────────── */
  isSelected(subIdx: number, optIdx: number): boolean {
    const category = this.currentCategory;
    if (!category?.options) { return false; }

    const option = category.options[subIdx];

    if (this.isSubcategory(option)) {
      const selName = option.options[optIdx]?.name;
      return Object.values(this.userSelections).includes(`${option.name}: ${selName}`);
    }
    return Object.values(this.userSelections).includes(`${category.name}: ${option.name}`);
  }

  isSubcategory(item: unknown): item is SubCategory {
    return typeof item === 'object' && item !== null &&
      'name' in item && 'options' in item;
  }

  /* completa solo lo que tocó el usuario */
  private isCurrentCategoryComplete(): boolean {
    const cat = this.currentCategory;
    if (!cat) { return false; }

    const touchedSet = this.touched[this.currentCategoryIndex] ?? new Set<number>();
    return cat.options.every((_o, idx) => touchedSet.has(idx));
  }

  /* navegación */
  private goToNextCategory(): void {
    if (this.hasNext()) {
      this.currentCategoryIndex++;
      /* crear set vacío para la nueva categoría */
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
  nextCategory(): void { if (this.hasNext()) { this.goToNextCategory(); } }

  hasPrevious(): boolean { return this.currentCategoryIndex > 0; }
  hasNext(): boolean { return this.currentCategoryIndex < (this.totalSteps - 1); }

  /* ────────────modal y breakdown──────────── */
  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  toggleBreakdown(): void {
    this.showBreakdown = !this.showBreakdown;
    if (this.showBreakdown) { this.updateBreakdown(); }
  }

  updateBreakdown(): void {
    this.breakdownItems = Object.values(this.userSelections).map(sel => {
      const selName = sel.split(': ')[1];
      const cat = this.item?.categories.find(c =>
        c.options.some(o =>
          this.isSubcategory(o)
            ? o.options.some(s => s.name === selName)
            : o.name === selName
        )
      );
      const opt = cat?.options
        .flatMap(o => this.isSubcategory(o) ? o.options : [o])
        .find(o => o.name === selName);

      return { name: sel, price: opt?.price ?? 0 };
    });
  }

  getIconByCategory(name: string): any {
    const cat = this.item?.categories.find(c => c.name === name);
    return cat ? this.quotesService.getIconByCategory(cat) : null;
  }
}
