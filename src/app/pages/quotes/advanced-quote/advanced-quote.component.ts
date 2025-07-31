import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { Quote, QuoteCategory } from '../../../core/models/quote.model';
import { QuoteConfiguratorComponent } from "../configurator/quote-configurator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';

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

  constructor(
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    public pricing: QuotePricingService,
    private resizeService: ResizeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = Number(params.get('id'));
        this.item = this.quotesService.getItemById(id);
        if (!this.item) return;

        this.route.queryParams.subscribe(queryParams => {
            const fromCustomBuilder = queryParams['fromCustomBuilder'] === 'true';

            if (fromCustomBuilder) {
                this.initialCategoryIndex = 1;
                this.customInitialValues = {
                    sqft: Number(queryParams['customSize']) || 1300,
                    bedrooms: Number(queryParams['customBedrooms']) || 3,
                    bathrooms: Number(queryParams['customBathrooms']) || 2.5,
                    garage: Number(queryParams['customGarage']) || 2
                };
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
                    userSelections: Record<string, string>
                ) => {
                    const size = this.item?.size && this.item.size > 0 ? this.item.size : 1;
                    const result = this.pricing.calcStandard(
                        categories, 
                        userSelections, 
                        this.quotesService.ADVANCED_QUOTE_BASE_PRICE,
                        size
                    );
                    return {
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
}
