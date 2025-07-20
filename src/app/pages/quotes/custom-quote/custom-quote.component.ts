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
  selector: 'app-custom-quote',
  template: `<app-quote-configurator
    [item]="item"
    [categories]="categories"
    [galleryItems]="galleryItems"
    [quoteType]="'custom'"
    [isMobile]="isMobile"
    [gallerySize]="gallerySize"
    [pricingService]="pricing"
    (requestQuote)="requestQuote()"
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

      const images = this.quotesService.getImagesFromFolder(this.item.folder);
      this.galleryItems = images.map(image => ({ image, title: this.item?.size ?? 0 }));

      this.categories = this.buildCustomCategory();
    });
    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }

  buildCustomCategory(): QuoteCategory[] {
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
