import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../services/resize.service';
import { QuotesService } from '../../../core/services/quotes.service';
import { QuotePricingService } from '../../../core/services/quote-pricing.service';
import { Quote, QuoteCategory } from '../../../core/models/quote.model';
import { QuoteConfiguratorComponent } from "../configurator/quote-configurator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from '../shared/quote-modal/quote-modal.component';

@Component({
  selector: 'app-remodel-quote',
  template: `<app-quote-configurator
    [item]="item"
    [categories]="categories"
    [galleryItems]="galleryItems"
    [quoteType]="'remodel'"
    [isMobile]="isMobile"
    [gallerySize]="gallerySize"
    [pricingService]="pricing"
    (requestQuote)="requestQuote()"
  ></app-quote-configurator>`,
  standalone: true,
  imports: [QuoteConfiguratorComponent],
})
export class RemodelQuoteComponent implements OnInit {
  item: Quote = {
    id: 0,
    name: 'Remodel',
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    folder: 'remodel',
    basePrice: 0,
    categories: [],
    imagesCount: 5
  };
  categories: QuoteCategory[] = [];
  galleryItems: { image: string; title: number }[] = [];
  isMobile = false;
  gallerySize: 'small' | 'large' = 'large';

  constructor(
    private quotesService: QuotesService,
    public pricing: QuotePricingService,
    private resizeService: ResizeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.categories = this.quotesService.buildRemodelCategory();
    this.galleryItems = this.quotesService.getImagesFromFolder(this.item.folder)
      .map(image => ({ image, title: this.item.size }));
    this.isMobile = this.resizeService.isMobile;
    this.gallerySize = this.resizeService.gallerySize;
    this.resizeService.isMobile$.subscribe(val => this.isMobile = val);
    this.resizeService.gallerySize$.subscribe(val => this.gallerySize = val);
  }

  requestQuote(): void {
    this.modalService.open(QuoteModalComponent, { centered: true });
  }
}
