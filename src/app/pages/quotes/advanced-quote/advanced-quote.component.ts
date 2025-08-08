import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { Quote, QuoteCategory } from '../../../core/models/quote.model';
import { QuoteConfiguratorComponent } from "../configurator/quote-configurator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';
import { ScrollUtils } from '../../../core/utils/scroll.utils';

@Component({
  selector: 'app-advanced-quote',
  template: `<app-quote-configurator
    [item]="item"
    [categories]="categories"
    [galleryItems]="galleryItems"
    [quoteType]="'advanced'"
    [isMobile]="isMobile"
    [gallerySize]="gallerySize"
    [pricingService]="pricingAdapter"
    [initialCategoryIndex]="initialCategoryIndex"
    [initialCustomValues]="customInitialValues"
    [initialUserSelections]="initialUserSelections"
    (requestQuote)="requestQuote()"
  ></app-quote-configurator>`,
  standalone: true,
  imports: [QuoteConfiguratorComponent],
})
export class AdvancedQuoteComponent implements OnInit {
  item?: Quote;
  categories: QuoteCategory[] = [];
  galleryItems: { image: string; title: number }[] = [];
  isMobile = false;
  gallerySize: 'small' | 'large' = 'large';
  pricingAdapter: any;
  customInitialValues: Record<string, number> | undefined = undefined;
  initialCategoryIndex = 0;
  initialUserSelections: Record<string, string> = {};

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
        const id = params.get('id');
        
        this.route.queryParams.subscribe(queryParams => {
            const fromCustomBuilder = queryParams['fromCustomBuilder'] === 'true';

            if (id) {
                this.item = this.quotesService.getItemById(Number(id));
                if (!this.item) return;
            } else if (fromCustomBuilder) {
                this.item = {
                    id: 999,
                    name: 'Custom Build',
                    size: Number(queryParams['customSize']) || 1300,
                    bedrooms: Number(queryParams['customBedrooms']) || 3,
                    bathrooms: Number(queryParams['customBathrooms']) || 2.5,
                    folder: 'custom',
                    categories: [],
                    imagesCount: 1
                };
            } else {
                return;
            }

            if (fromCustomBuilder) {
                this.initialCategoryIndex = 1;
                this.customInitialValues = {
                    sqft: Number(queryParams['customSize']) || 1300,
                    bedrooms: Number(queryParams['customBedrooms']) || 3,
                    bathrooms: Number(queryParams['customBathrooms']) || 2.5,
                    garage: Number(queryParams['customGarage']) || 0
                };
                
                const garageValue = Number(queryParams['customGarage']) || 0;
                this.initialUserSelections['0_0'] = `Garage Space: ${this.getGarageOptionName(garageValue)}`;
                
                if (this.item && queryParams['customSize']) {
                    this.item.size = Number(queryParams['customSize']);
                }
            }

            const images = this.quotesService.getImagesFromFolder(this.item!.folder);
            this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

            const advancedCategories = this.quotesService.getCategoriesByType('advanced');
            if (fromCustomBuilder) {
                const customParamCategory = this.quotesService.buildCustomCategory()[0];
                this.categories = [customParamCategory, ...advancedCategories];
            } else {
                this.categories = [...advancedCategories];
            }

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
    });
    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  private getGarageOptionName(garageValue: number): string {
    const garageOptions = [
      'No garage space',
      '1 car garage space', 
      '2 car garage space',
      '3 car garage space'
    ];
    return garageOptions[garageValue] || '2 car garage space';
  }
}
