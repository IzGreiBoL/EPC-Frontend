import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
    @Input() initialCategoryIndex = 0;
    @Input() initialCustomValues?: Record<string, number>;

    @Output() requestQuote = new EventEmitter<void>();
    @Output() personalize = new EventEmitter<Record<string, number>>();

    userSelections: Record<string, string> = {};
    customValues: Record<string, number> = { sqft: 1300, bedrooms: 3, bathrooms: 2, garage: 1 };
    bathroomBasePricing: number = 0;
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
        if (this.initialCustomValues) {
            Object.keys(this.initialCustomValues).forEach(key => {
                if (key in this.customValues) {
                    this.customValues[key] = this.initialCustomValues![key];
                }
            });

            this.calculateBathroomPricing();
        }

        if (this.initialCategoryIndex > 0 && this.initialCategoryIndex < this.categories.length) {
            this.currentCategoryIndex = this.initialCategoryIndex;
        }

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

    initPreSelectionsBasic(): void {
        this.userSelections = {};
        this.categories.forEach((cat, catIdx) => {
            if (cat.options.length) {
                const opt = cat.options[0];
                this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
            }
        });
    }

    initPreSelectionsAdvanced(): void {
        this.userSelections = {};
        this.categories.forEach((cat, catIdx) => {
            cat.options.forEach((opt, subIdx) => {
                if (this.isSubcategory(opt)) {
                    const firstSub = opt.options[0];
                    if (firstSub) {
                        this.userSelections[`${catIdx}_${subIdx}`] = `${opt.name}: ${firstSub.name}`;
                    }
                } else {
                    if (
                        !cat.options.some(o => this.isSubcategory(o))
                        && subIdx === 0
                    ) {
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
        if (this.quoteType === 'basic' || this.quoteType === 'remodel') {
            Object.keys(this.userSelections).forEach(k => {
                if (k.startsWith(`${this.currentCategoryIndex}_`)) delete this.userSelections[k];
            });
        } else {
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

    calculateBathroomPricing(): void {
        const bathrooms = this.customValues['bathrooms'] || 0;
        this.bathroomBasePricing = 0;

        if (bathrooms > 2.5) {
            if (bathrooms === 3) {
                this.bathroomBasePricing = 10;
            } else {
                const halfBathsOver3 = Math.max(0, Math.round((bathrooms - 3) * 2));
                this.bathroomBasePricing = 10 + (halfBathsOver3 * 5);
            }
        }
    }

    onCustomFieldChange(event: { key: string; value: number }): void {
        if (event.key === 'sqft') {
            event.value = Math.max(1300, event.value);
        } else if (event.key === 'bathrooms') {
            event.value = Math.max(2, Math.round(event.value * 2) / 2);
        } else if (event.key === 'bedrooms') {
            event.value = Math.round(event.value);
        }
        this.customValues[event.key] = Number(event.value);

        this.calculateBathroomPricing();

        this.calculateTotal();
        this.updateFormattedSelections();
    }

    adjustBedrooms(): void {
        const sqft = this.customValues['sqft'] || 0;
        const bedrooms = this.customValues['bedrooms'] || 0;

        if (sqft < 1500 && bedrooms > 3) {
            this.customValues['bedrooms'] = 3;
        } else if (sqft < 2200 && bedrooms > 4) {
            this.customValues['bedrooms'] = 4;
        }

        this.calculateTotal();
        this.updateFormattedSelections();
    }

    adjustSquareFootage(): void {
        const bedrooms = this.customValues['bedrooms'] || 0;

        if (bedrooms > 3 && bedrooms <= 4 && this.customValues['sqft'] < 1500) {
            this.customValues['sqft'] = 1500;
        } else if (bedrooms > 4 && this.customValues['sqft'] < 2200) {
            this.customValues['sqft'] = 2200;
        }

        this.calculateTotal();
        this.updateFormattedSelections();
    }

    adjustBathrooms(): void {
        const sqft = this.customValues['sqft'] || 0;

        if (sqft >= 1500 && sqft < 2200) {
            this.customValues['bathrooms'] = Math.max(this.customValues['bathrooms'], 3);
        } else if (sqft >= 2200) {
            this.customValues['bathrooms'] = Math.max(this.customValues['bathrooms'], 4);
        }

        this.calculateBathroomPricing();
        this.calculateTotal();
        this.updateFormattedSelections();
    }

    calculateTotal(): void {
        if (!this.item || !this.pricingService) return;
        let result: { pricePerFt: number; hasCustom: boolean };
        const size = this.customValues['sqft'] || this.item.size || 0;

        if ('calcStandard' in this.pricingService) {
            const adjustedBasePrice = this.basePrice + this.bathroomBasePricing;

            result = (this.pricingService as any).calcStandard(
                this.categories,
                this.userSelections,
                adjustedBasePrice,
                size
            );

            const bathroomPricePerSqft = size > 0 ? this.bathroomBasePricing / size : 0;

            this.totalNumeric = result.pricePerFt * size;
            this.hasCustomOption = result.hasCustom;
            this.pricePerSqFtNum = result.pricePerFt + bathroomPricePerSqft;
        } else {
            return;
        }
    }

    toggleBreakdown(): void {
        this.showBreakdown = !this.showBreakdown;
        if (this.showBreakdown) this.updateBreakdown();
    }

    openQuoteModal(): void {
        // Prepara los datos de la cotización a enviar al modal
        const quoteData = {
            quoteNo: this.item?.id ? String(this.item.id) : '',
            date: new Date().toLocaleDateString(),
            clientName: '', // Se llenará en el modal
            modelOfHouse: this.item?.name || '',
            selections: this.formattedSelections,
            pricePerSqft: this.pricePerSqFtNum,
            sqftTotal: this.item?.size || '',
            total: this.totalNumeric,
            hasCustomOption: this.hasCustomOption,
            customValues: this.customValues,
            item: this.item,
            stampImageUrl: (this.galleryItems[0]?.image ?? '') // Usa la imagen principal del modelo
        };
        const modalRef = this.modalService.open(QuoteModalComponent, { centered: true });
        modalRef.componentInstance.quoteData = quoteData;
    }

    personalizeQuote(): void {
        // Calculate bathroom pricing before emitting
        this.calculateBathroomPricing();
        this.calculateTotal();

        // Pass the custom values to the parent component
        this.personalize.emit(this.customValues);
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