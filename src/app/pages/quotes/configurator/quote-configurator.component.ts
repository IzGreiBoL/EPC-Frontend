import { Component, Input, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Quote, QuoteCategory, SubCategory } from '../../../core/models/quote.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { QuotesService } from '../../../core/services/quotes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';

@Component({
    selector: 'app-quote-configurator',
    templateUrl: './quote-configurator.component.html',
    styleUrls: ['./quote-configurator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CurrencyPipe,
        LucideAngularModule,
        GalleryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuoteConfiguratorComponent {
    @Input() pricingService?: {
        calcStandard: (
            categories: QuoteCategory[],
            userSelections: Record<string, string>,
            basePrice: number
        ) => { pricePerFt: number; hasCustom: boolean }
    };

    constructor(private quotesService: QuotesService,
        private modalService: NgbModal
    ) { }

    @Input() item?: Quote;
    @Input() categories: QuoteCategory[] = [];
    @Input() galleryItems: { image: string; title: number }[] = [];
    @Input() quoteType: 'basic' | 'advanced' | 'custom' | 'remodel' = 'basic';
    @Input() isMobile = false;
    @Input() gallerySize: 'small' | 'large' = 'large';

    userSelections: Record<string, string> = {};
    customValues: Record<string, number> = { sqft: 2000, bedrooms: 3, bathrooms: 2 };
    currentCategoryIndex = 0;
    totalNumeric = 0;
    pricePerSqFtNum = 0;
    hasCustomOption = false;
    formattedSelections: { category: string; subcategories: string[] }[] = [];
    showBreakdown = false;
    breakdownItems: { name: string; price: number | string }[] = [];
    basePrice = 0;
    private touched: Record<number, Set<number>> = {};

    ngOnInit(): void {
        if (this.quoteType === 'basic') {
            this.initPreSelectionsBasic();
        } else {
            this.initPreSelectionsAdvanced();
        }
        this.updateFormattedSelections();
        this.calculateTotal();
    }

    get currentCategory(): QuoteCategory | undefined {
        return this.categories[this.currentCategoryIndex];
    }

    get totalSteps(): number {
        return this.categories.length;
    }

    isSubcategory(option: unknown): option is SubCategory {
        return typeof option === 'object' && option !== null && 'name' in option && Array.isArray((option as { options?: unknown }).options);
    }

    // Para versión básica: solo categorías con opciones simples
    initPreSelectionsBasic(): void {
        this.userSelections = {};
        this.categories.forEach((cat, catIdx) => {
            if (cat.options.length) {
                const opt = cat.options[0];
                this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
            }
        });
    }

    // Para versión avanzada: categorías con subcategorías y opciones dentro de subcategorías
    initPreSelectionsAdvanced(): void {
        this.userSelections = {};
        this.categories.forEach((cat, catIdx) => {
            cat.options.forEach((opt, subIdx) => {
                if (this.isSubcategory(opt)) {
                    // Preselecciona la primera opción de la subcategoría
                    const firstSub = opt.options[0];
                    if (firstSub) {
                        this.userSelections[`${catIdx}_${subIdx}`] = `${opt.name}: ${firstSub.name}`;
                    }
                } else {
                    // Si hay opciones simples, preselecciona la primera
                    if (subIdx === 0) {
                        this.userSelections[`${catIdx}_${subIdx}`] = `${cat.name}: ${opt.name}`;
                    }
                }
            });
        });
    }

    selectOption(event: { subIdx: number; optIdx: number }): void {
        const category = this.currentCategory;
        if (!category?.options) return;
        const option = category.options[event.subIdx];
        // Si es versión básica o remodel, solo puede haber una opción seleccionada por categoría
        if (this.quoteType === 'basic' || this.quoteType === 'remodel') {
            // Elimina todas las selecciones de la categoría actual
            Object.keys(this.userSelections).forEach(k => {
                if (k.startsWith(`${this.currentCategoryIndex}_`)) delete this.userSelections[k];
            });
        } else {
            // Solo elimina la selección previa de este subíndice
            delete this.userSelections[`${this.currentCategoryIndex}_${event.subIdx}`];
        }
        if (this.isSubcategory(option)) {
            const subOpt = option.options[event.optIdx];
            if (subOpt) {
                this.userSelections[`${this.currentCategoryIndex}_${event.subIdx}`] = `${option.name}: ${subOpt.name}`;
            }
        } else {
            this.userSelections[`${this.currentCategoryIndex}_${event.subIdx}`] = `${category.name}: ${option.name}`;
        }
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
        if (!this.item || !this.pricingService) return;
        const { pricePerFt, hasCustom } = this.pricingService.calcStandard(
            this.categories,
            this.userSelections,
            this.basePrice,
        );
        const size = this.item.size ?? 0;
        const total = pricePerFt * size;
        this.totalNumeric = total;
        this.hasCustomOption = hasCustom;
        this.pricePerSqFtNum = pricePerFt;
    }

    toggleBreakdown(): void {
        this.showBreakdown = !this.showBreakdown;
        if (this.showBreakdown) this.updateBreakdown();
    }

    requestQuote(): void {
        this.modalService.open(QuoteModalComponent, { centered: true });
    }

    onCustomFieldChange(event: { key: string; value: number }): void {
        this.customValues[event.key] = Number(event.value);
        this.calculateTotal();
        this.updateFormattedSelections();
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

    getIconByCategory(name: string): readonly any[] | undefined {
        const cat = this.item?.categories.find(c => c.name === name) || this.categories.find(c => c.name === name);
        const icon = cat ? this.quotesService.getIconByCategory(cat) : undefined;
        if (!icon || typeof icon === 'string') {
            // Devuelve undefined para que lucide-angular no intente renderizar nada
            return undefined;
        }
        // Si el icono es un array válido, lo retorna
        return icon as readonly object[];
    }
}
