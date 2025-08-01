import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { Router } from '@angular/router';
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
    private router: Router,
    private quotesService: QuotesService,
    public pricing: QuotePricingService,
    private resizeService: ResizeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Custom quote siempre usa un item por defecto sin depender de ID
    this.item = {
      id: 999,
      name: 'Custom Build',
      size: 1300,
      bedrooms: 3,
      bathrooms: 2,
      folder: 'custom',
      categories: [],
      imagesCount: 1
    };
    
    const images = this.quotesService.getImagesFromFolder(this.item.folder);
    this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));
    
    this.categories = this.quotesService.buildCustomCategory();

    // Adaptador para cumplir la firma esperada
    this.pricingAdapter = {
      calcStandard: (
        categories: QuoteCategory[],
        userSelections: Record<string, string>,
        basePrice: number,
        size: number
      ) => {
        size = size && size > 0 ? size : 1300;
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
      }
    };

    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  personalizeQuote(customValues: Record<string, number>): void {
    this.router.navigate(['/quotes/advanced'], { 
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
