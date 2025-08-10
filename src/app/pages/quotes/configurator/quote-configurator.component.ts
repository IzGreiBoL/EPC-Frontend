import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Quote, QuoteCategory, SubCategory } from '../../../core/models/quote.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { QuotesService } from '../../../core/services/quotes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfigService } from '../../../core/services/config.service';
import { ScrollUtils } from '../../../core/utils/scroll.utils';

@Component({
    selector: 'app-quote-configurator',
    templateUrl: './quote-configurator.component.html',
    styleUrls: ['./quote-configurator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyPipe,
        LucideAngularModule,
        GalleryComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuoteConfiguratorComponent implements OnDestroy, AfterViewInit {
    @Input() pricingService?: {
        calcStandard: (
            categories: QuoteCategory[],
            userSelections: Record<string, string>,
            basePrice: number,
            size: number
        ) => { total: number; pricePerFt: number; hasCustom: boolean }
    };

    form: FormGroup;
    private formSub?: Subscription;
    private routerSubscription?: Subscription;
    constructor(
        private quotesService: QuotesService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private configService: ConfigService,
        private router: Router
    ) {
        this.form = this.fb.group({
            sqft: [1300, [Validators.required, Validators.min(1300)]],
            bedrooms: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
            bathrooms: [2.5, [Validators.required, Validators.min(2.5)]],
            garage: [0, [Validators.required, Validators.min(0), Validators.max(4)]]
        });
    }

    @Input() item?: Quote;
    @Input() categories: QuoteCategory[] = [];
    @Input() galleryItems: { image: string; title: number }[] = [];
    @Input() quoteType: 'basic' | 'advanced' | 'custom' | 'remodel' = 'basic';
    @Input() isMobile = false;
    @Input() gallerySize: 'small' | 'large' = 'large';
    @Input() initialCategoryIndex = 0;
    @Input() initialCustomValues?: Record<string, number>;
    @Input() initialUserSelections?: Record<string, string>;

    @Output() requestQuote = new EventEmitter<void>();
    @Output() personalize = new EventEmitter<Record<string, number>>();

    userSelections: Record<string, string> = {};
    customValues: Record<string, number> = { sqft: 1300, bedrooms: 3, bathrooms: 2.5, garage: 0 };
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
        ScrollUtils.forceScrollToTop();

        setTimeout(() => {
            ScrollUtils.forceScrollToTop();
        }, 0);

        // Establecer el basePrice según el tipo de quote
        if (this.quoteType === 'custom') {
            this.basePrice = this.quotesService.CUSTOM_QUOTE_BASE_PRICE;
        } else if (this.quoteType === 'advanced') {
            this.basePrice = this.quotesService.ADVANCED_QUOTE_BASE_PRICE;
        } else if (this.quoteType === 'basic') {
            this.basePrice = this.quotesService.BASIC_QUOTE_BASE_PRICE;
        } else if (this.quoteType === 'remodel') {
            this.basePrice = this.quotesService.REMODEL_QUOTE_BASE_PRICE;
        }

        if (this.quoteType === 'remodel' && this.customValues['sqft'] === 1300) {
            this.customValues['sqft'] = 300;
        }

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
        } else if (this.quoteType === 'remodel') {
            this.initPreSelectionsRemodel();
        } else {
            this.initPreSelectionsAdvanced();
        }

        this.updateFormattedSelections();
        this.calculateTotal();

        this.initForm();
    }

    ngAfterViewInit(): void {
        // Segundo reset de scroll después de que la vista esté completamente inicializada
        setTimeout(() => {
            ScrollUtils.forceScrollToTop();
        }, 50);

        // Suscripción a eventos de navegación del router para manejar el botón "atrás" del navegador
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                // Scroll al top cuando se navega, incluyendo con el botón atrás
                setTimeout(() => {
                    ScrollUtils.forceScrollToTop();
                }, 0);
            });
    }

    initForm(): void {
        if (this.formSub) {
            this.formSub.unsubscribe();
        }
        const fields = this.categories[this.currentCategoryIndex]?.fields;
        const group: any = {};

        const sqftField = fields?.find(f => f.key === 'sqft');
        const sqftMin = sqftField?.min ?? (this.quoteType === 'remodel' ? 300 : 1300);
        const sqftDefault = sqftField?.min ?? (this.quoteType === 'remodel' ? 300 : 1300);

        group['sqft'] = [
            (this.initialCustomValues && this.initialCustomValues['sqft'] !== undefined)
                ? this.initialCustomValues['sqft']
                : (this.customValues['sqft'] ?? sqftDefault),
            [Validators.required, Validators.min(sqftMin)]
        ];
        group['bedrooms'] = [
            (this.initialCustomValues && this.initialCustomValues['bedrooms'] !== undefined)
                ? this.initialCustomValues['bedrooms']
                : (this.customValues['bedrooms'] ?? 3),
            [Validators.required, Validators.min(1), Validators.max(6)]
        ];
        group['bathrooms'] = [
            (this.initialCustomValues && this.initialCustomValues['bathrooms'] !== undefined)
                ? this.initialCustomValues['bathrooms']
                : (this.customValues['bathrooms'] ?? 2.5),
            [Validators.required, Validators.min(2.5)]
        ];

        if (fields) {
            fields.forEach(f => {
                if (!group[f.key]) {
                    group[f.key] = [
                        (this.initialCustomValues && this.initialCustomValues[f.key] !== undefined)
                            ? this.initialCustomValues[f.key]
                            : (this.customValues[f.key] ?? f.min ?? 0),
                        this.getValidatorsForField(f)
                    ];
                }
            });
        }

        if (this.categories[this.currentCategoryIndex]?.options) {
            const garageOption = this.categories[this.currentCategoryIndex].options.find(opt => opt.name === 'Garage Space');
            if (garageOption) {
                group['garage'] = [
                    (this.initialCustomValues && this.initialCustomValues['garage'] !== undefined)
                        ? this.initialCustomValues['garage']
                        : (this.customValues['garage'] ?? 0),
                    [Validators.required, Validators.min(0), Validators.max(4)]
                ];
            }
        }

        this.form = this.fb.group(group);

        if (this.initialCustomValues) {
            this.form.patchValue(this.initialCustomValues);
        }

        this.formSub = this.form.valueChanges.subscribe(values => {
            Object.assign(this.customValues, values);
            this.calculateBathroomPricing();
            this.calculateTotal();
            this.updateFormattedSelections();
        });
    }

    getValidatorsForField(f: any) {
        const validators = [];
        if (f.min !== undefined) validators.push(Validators.min(f.min));
        if (f.max !== undefined) validators.push(Validators.max(f.max));
        if (f.type === 'number') validators.push(Validators.required);
        return validators;
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
        if (this.initialUserSelections && Object.keys(this.initialUserSelections).length > 0) {
            this.userSelections = { ...this.initialUserSelections };
        } else {
            this.userSelections = {};
        }

        this.categories.forEach((cat, catIdx) => {
            cat.options.forEach((opt, subIdx) => {
                const selectionKey = `${catIdx}_${subIdx}`;

                if (!this.userSelections[selectionKey]) {
                    if (this.isSubcategory(opt)) {
                        const firstSub = opt.options[0];
                        if (firstSub) {
                            this.userSelections[selectionKey] = `${opt.name}: ${firstSub.name}`;
                        }
                    } else {
                        if (
                            !cat.options.some(o => this.isSubcategory(o))
                            && subIdx === 0
                        ) {
                            this.userSelections[selectionKey] = `${cat.name}: ${opt.name}`;
                        }
                    }
                }
            });
        });
    }

    initPreSelectionsRemodel(): void {
        this.userSelections = {};
        this.categories.forEach((cat, catIdx) => {
            if (cat.name === 'Remodel Configuration') {
                cat.options.forEach((option, subIdx) => {
                    if (this.isSubcategory(option) && option.name === 'Remodel Selections') {
                        option.options.forEach((subOpt, optIdx) => {
                            if (optIdx < 2) {
                                const subSelectionKey = `${catIdx}_${subIdx}_${optIdx}`;
                                this.userSelections[subSelectionKey] = `${option.name}: ${subOpt.name}`;
                            }
                        });
                    }
                });
            } else {
                if (cat.options.length) {
                    const opt = cat.options[0];
                    this.userSelections[`${catIdx}_0`] = `${cat.name}: ${opt.name}`;
                }
            }
        });
    }

    selectOption(event: { subIdx: number; optIdx: number }): void {
        const category = this.currentCategory;
        if (!category?.options) return;
        const option = category.options[event.subIdx];

        const selectionKey = `${this.currentCategoryIndex}_${event.subIdx}`;

        if (this.quoteType === 'remodel' && category.name === 'Remodel Configuration') {
            if (this.isSubcategory(option)) {
                const subOpt = option.options[event.optIdx];
                if (subOpt) {
                    const subSelectionKey = `${this.currentCategoryIndex}_${event.subIdx}_${event.optIdx}`;
                    if (this.userSelections[subSelectionKey]) {
                        delete this.userSelections[subSelectionKey];
                    } else {
                        this.userSelections[subSelectionKey] = `${option.name}: ${subOpt.name}`;
                    }
                }
            } else {
                if (this.userSelections[selectionKey]) {
                    delete this.userSelections[selectionKey];
                } else {
                    this.userSelections[selectionKey] = `${category.name}: ${option.name}`;
                }
            }
        } else if (this.quoteType === 'basic') {
            Object.keys(this.userSelections).forEach(k => {
                if (k.startsWith(`${this.currentCategoryIndex}_`)) delete this.userSelections[k];
            });

            if (this.isSubcategory(option)) {
                const subOpt = option.options[event.optIdx];
                if (subOpt) {
                    this.userSelections[selectionKey] = `${option.name}: ${subOpt.name}`;
                }
            } else {
                this.userSelections[selectionKey] = `${category.name}: ${option.name}`;
            }
        } else {
            delete this.userSelections[selectionKey];

            if (this.isSubcategory(option)) {
                const subOpt = option.options[event.optIdx];
                if (subOpt) {
                    this.userSelections[selectionKey] = `${option.name}: ${subOpt.name}`;
                }
            } else {
                this.userSelections[selectionKey] = `${category.name}: ${option.name}`;
            }
        }

        this.updateFormattedSelections();
        this.calculateTotal();

        this.cdr.detectChanges();
    }

    previousCategory(): void {
        if (this.currentCategoryIndex > 0) {
            this.currentCategoryIndex--;
            this.initForm();
            this.updateFormattedSelections();
        }
    }

    nextCategory(): void {
        if (this.currentCategoryIndex < this.categories.length - 1) {
            this.currentCategoryIndex++;
            this.initForm();
            this.updateFormattedSelections();
        }
    }

    ngOnDestroy(): void {
        if (this.formSub) {
            this.formSub.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
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

        if ((this.quoteType === 'custom' || (this.quoteType === 'advanced' && this.initialCustomValues)) && this.bathroomBasePricing > 0) {
            const bathroomGroup = grouped.find(g => g.category === 'Custom parameters');
            if (bathroomGroup) {
                const bathrooms = this.customValues['bathrooms'] || 0;
                bathroomGroup.subcategories.push(`Additional Bathrooms: ${bathrooms} bathrooms (+$${this.bathroomBasePricing} per sq ft)`);
            } else {
                grouped.push({
                    category: 'Custom parameters',
                    subcategories: [`Additional Bathrooms: ${this.customValues['bathrooms'] || 0} bathrooms (+$${this.bathroomBasePricing} per sq ft)`]
                });
            }
        }

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

    adjustBedrooms(): void {
        const sqft = this.form.value.sqft || 0;
        const bedrooms = this.form.value.bedrooms || 0;

        if (sqft < 1500 && bedrooms > 3) {
            this.form.patchValue({ bedrooms: 3 });
        } else if (sqft < 2200 && bedrooms > 4) {
            this.form.patchValue({ bedrooms: 4 });
        }

        this.calculateTotal();
        this.updateFormattedSelections();
    }

    adjustSquareFootage(): void {
        const bedrooms = this.form.value.bedrooms || 0;

        if (bedrooms > 3 && bedrooms <= 4 && this.form.value.sqft < 1500) {
            this.form.patchValue({ sqft: 1500 });
        } else if (bedrooms > 4 && this.form.value.sqft < 2200) {
            this.form.patchValue({ sqft: 2200 });
        }

        this.calculateTotal();
        this.updateFormattedSelections();
    }

    adjustBathrooms(): void {
        const sqft = this.form.value.sqft || 0;
        let newBathrooms = this.form.value.bathrooms || 0;

        if (sqft < 1500 && newBathrooms > 2.5) {
            newBathrooms = 2.5;
        } else if (sqft >= 1500 && sqft < 2200 && newBathrooms < 3) {
            newBathrooms = 3;
        } else if (sqft >= 2200 && newBathrooms < 4) {
            newBathrooms = 4;
        }
        this.form.patchValue({ bathrooms: newBathrooms });

        this.calculateBathroomPricing();
        this.calculateTotal();
        this.updateFormattedSelections();
    }

    calculateTotal(): void {
        if (!this.item || !this.pricingService) return;
        let result: { total: number; pricePerFt: number; hasCustom: boolean };

        // Para quotes custom/advanced con customValues, usar el sqft personalizado
        // Para quotes basic/predefinidos, usar el tamaño del modelo
        // Para remodel, siempre usar el sqft del form
        let size: number;
        if (this.quoteType === 'remodel') {
            size = this.customValues['sqft'] || 300;  // Para remodel usar sqft del form
        } else if (this.quoteType === 'custom' || (this.quoteType === 'advanced' && this.initialCustomValues)) {
            size = this.customValues['sqft'] || 1300;
        } else {
            size = this.item.size || 1300;
        }

        if ('calcStandard' in this.pricingService) {
            const adjustedBasePrice = this.basePrice + this.bathroomBasePricing;

            result = (this.pricingService as any).calcStandard(
                this.categories,
                this.userSelections,
                adjustedBasePrice,
                size
            );

            this.totalNumeric = Math.round(result.total * 100) / 100;
            this.hasCustomOption = result.hasCustom;
            this.pricePerSqFtNum = Math.round(result.pricePerFt * 100) / 100;
        } else {
            return;
        }
    }

    toggleBreakdown(): void {
        this.showBreakdown = !this.showBreakdown;
        if (this.showBreakdown) this.updateBreakdown();
    }

    openQuoteModal(): void {
        // Determinar el sqft correcto según el tipo de quote
        let sqftToUse: number;
        if (this.quoteType === 'custom' || (this.quoteType === 'advanced' && this.initialCustomValues)) {
            sqftToUse = this.customValues['sqft'] || 1300;
        } else {
            sqftToUse = this.item?.size || 1300;
        }

        const quoteData = {
            quoteNo: this.item?.id ? String(this.item.id) : '',
            date: new Date().toLocaleDateString(),
            clientName: '',
            modelOfHouse: this.item?.name || '',
            houseModel: this.item?.name || '',
            selections: this.formattedSelections,
            pricePerSqft: this.pricePerSqFtNum,
            sqftTotal: sqftToUse,
            sqft: sqftToUse,
            total: this.totalNumeric,
            totalPrice: this.totalNumeric,
            bedrooms: this.customValues['bedrooms'] || 3,
            bathrooms: this.customValues['bathrooms'] || 2.5,
            hasCustomOption: this.hasCustomOption,
            customValues: this.customValues,
            item: this.item,
            stampImageUrl: this.createAbsoluteImageUrl(this.galleryItems[0]?.image || `images/${(this.item?.name || 'custom').toLowerCase()}/image1.jpg`)
        };

        const modalRef = this.modalService.open(QuoteModalComponent, { centered: true });
        modalRef.componentInstance.quoteData = quoteData;
    }

    // Función para crear URLs absolutas de imágenes
    private createAbsoluteImageUrl(imagePath: string): string {
        const baseUrl = this.configService.apiBaseUrl;

        let cleanPath = imagePath;

        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        if (cleanPath.startsWith(baseUrl)) {
            return cleanPath;
        }

        return `${baseUrl}/${cleanPath}`;
    }

    // Función para contar selecciones de remodel
    getRemodelSelectionsCount(): number {
        if (this.quoteType !== 'remodel') return 0;

        const remodelCategory = this.categories.find(cat => cat.name === 'Remodel Configuration');
        if (!remodelCategory) return 0;

        const remodelCategoryIndex = this.categories.indexOf(remodelCategory);

        return Object.keys(this.userSelections).filter(key => {
            const parts = key.split('_');
            return parts.length === 3 && parts[0] === remodelCategoryIndex.toString();
        }).length;
    }

    // Función para validar que al menos 2 opciones estén seleccionadas en remodel
    isRemodelSelectionsValid(): boolean {
        if (this.quoteType !== 'remodel') return true;
        return this.getRemodelSelectionsCount() >= 2;
    }

    personalizeQuote(): void {
        this.calculateBathroomPricing();
        this.calculateTotal();

        const valuesWithGarage = { ...this.customValues };

        const garageSelection = Object.entries(this.userSelections).find(([, value]) =>
            value.includes('Garage Space:')
        );

        if (garageSelection) {
            const [, selectionText] = garageSelection;
            const garageName = selectionText.split(': ')[1];

            const garageOptions = [
                'No garage space',
                '1 car garage space',
                '2 car garage space',
                '3 car garage space'
            ];

            const garageIndex = garageOptions.findIndex(option => option === garageName);
            if (garageIndex !== -1) {
                valuesWithGarage['garage'] = garageIndex;
            }
        }

        this.personalize.emit(valuesWithGarage);
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

    isOptionSelected(categoryIndex: number, subIndex: number, optIndex: number): boolean {
        if (this.quoteType === 'remodel') {
            const key = `${categoryIndex}_${subIndex}_${optIndex}`;
            const isSelected = !!this.userSelections[key];
            return isSelected;
        }

        const altKey = `${categoryIndex}_${subIndex}`;
        const selection = this.userSelections[altKey];

        if (!selection) return false;

        const currentCategory = this.categories[categoryIndex];
        if (!currentCategory?.options) return false;

        const option = currentCategory.options[subIndex];
        if (!option) return false;

        if (this.isSubcategory(option) && option.options && option.options[optIndex]) {
            const subOptionName = option.options[optIndex].name;
            return selection.includes(subOptionName);
        }

        return selection.includes(option.name);
    }

    isMainOptionSelected(categoryIndex: number, subIndex: number): boolean {
        if (this.quoteType === 'remodel') {
            const key = `${categoryIndex}_${subIndex}`;
            return !!this.userSelections[key];
        }

        return !!this.userSelections[`${categoryIndex}_${subIndex}`];
    }

    getIconByCategory(name: string): readonly any[] | undefined {
        const cat = this.item?.categories.find(c => c.name === name) || this.categories.find(c => c.name === name);
        const icon = cat ? this.quotesService.getIconByCategory(cat) : undefined;
        if (!icon || typeof icon === 'string') {
            return undefined;
        }
        return icon as readonly object[];
    }

    hasBusinessWarnings(): boolean {
        if (this.quoteType === 'remodel') return false;
        
        const v = this.form.value;
        // Bedrooms warnings
        if (v.sqft < 1500 && v.bedrooms > 3) return true;
        if (v.sqft < 2200 && v.bedrooms > 4) return true;
        if (v.bedrooms > 5) return true;
        // Bathrooms warnings
        if (v.sqft < 1500 && v.bathrooms > 2.5) return true;
        if (v.sqft >= 1500 && v.sqft < 2200 && v.bathrooms < 3) return true;
        if (v.sqft >= 2200 && v.bathrooms < 4) return true;
        return false;
    }
}