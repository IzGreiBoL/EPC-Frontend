import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { Quote, QuoteCategory } from '../../../core/models/quote.model';
import { QuoteConfiguratorComponent } from "../configurator/quote-configurator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';

@Component({
  selector: 'app-custom-quote',
  template: `<app-quote-configurator
    [item]="item"
    [categories]="categories"
    [galleryItems]="galleryItems"
    [quoteType]="'custom'"
    [isMobile]="isMobile"
    [gallerySize]="gallerySize"
    [pricingService]="pricingAdapter"
    (requestQuote)="requestQuote()"
    (personalize)="personalizeQuote($event)"
  ></app-quote-configurator>`,
  standalone: true,
  imports: [QuoteConfiguratorComponent],
})
export class CustomQuoteComponent implements OnInit {
  item?: Quote;
  categories: QuoteCategory[] = [];
  galleryItems: { image: string; title: number }[] = [];
  isMobile = false;
  gallerySize: 'small' | 'large' = 'large';
  pricingAdapter: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

      const images = this.quotesService.getImagesFromFolder(this.item.folder);
      this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

      this.categories = this.quotesService.buildCustomCategory();

      // Pre-select the 2-car garage option by default
      setTimeout(() => {
        if (this.categories && this.categories.length > 1) {
          this.pricingAdapter.selectGarageOption?.(1);  // Select 2-Car Garage (index 1)
        }
      }, 100);

      // Adaptador para cumplir la firma esperada
      this.pricingAdapter = {
        calcStandard: (
          categories: QuoteCategory[],
          userSelections: Record<string, string>,
          basePrice: number,
          size: number
        ) => {
          size = size && size > 0 ? size : 1300; // Ensure minimum size
          const result = this.pricing.calcStandard(
            categories, 
            userSelections, 
            this.quotesService.CUSTOM_QUOTE_BASE_PRICE,
            size
          );
          return {
            pricePerFt: result.pricePerFt,
            hasCustom: result.hasCustom
          };
        },
        selectGarageOption: (index: number) => {
          // Logic to select the garage option
          if (this.categories && this.categories.length > 1) {
            const garageCategory = this.categories[1];
            const option = garageCategory.options[index];
            if (option) {
              // Set the selection
            }
          }
        }
      };
    });
    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  personalizeQuote(customValues: Record<string, number>): void {
    // Navega usando el nuevo mínimo de baños
    this.router.navigate(['/quotes/detail', this.item?.id, 'advanced'], { 
        queryParams: { 
            customSize: customValues['sqft'],
            customBedrooms: customValues['bedrooms'],
            customBathrooms: Math.max(2, customValues['bathrooms']),
            customGarage: customValues['garage'],
            fromCustomBuilder: true
        } 
    });
  }
}
