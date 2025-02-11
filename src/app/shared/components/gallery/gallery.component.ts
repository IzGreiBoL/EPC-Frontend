import { AfterViewInit, Component, ElementRef, Input, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() items: { image: string, title: string }[] = [];
  @Input() itemsPerPage: number = 1;
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @ViewChild('galleryContainer', { static: false }) galleryContainer!: ElementRef;
  currentIndex = 0;
  pages: number[] = [];
  showPrevButton = false;
  showNextButton = true;
  routeClass = '';
  private startX = 0;
  private endX = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsPerPage']) {
      setTimeout(() => this.setItemsPerPageCSSVariable(), 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateIndicators();
      this.carousel.nativeElement.addEventListener('touchstart', this.onTouchStart.bind(this));
      this.carousel.nativeElement.addEventListener('touchend', this.onTouchEnd.bind(this));
      this.activateCurrentItem();
      this.updateButtonVisibility();
      setTimeout(() => this.setItemsPerPageCSSVariable(), 0);
    }
  }

  setItemsPerPageCSSVariable(): void {
    if (this.galleryContainer?.nativeElement) {
      this.renderer.setStyle(this.galleryContainer.nativeElement, '--items-per-page', this.itemsPerPage.toString());
    }
  }

  scrollLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.getItemsPerPage(), 0);
      this.scrollToIndex(this.currentIndex);
      this.updateButtonVisibility();
    }
  }

  scrollRight(): void {
    const maxIndex = this.items.length - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.getItemsPerPage(), maxIndex);
      this.scrollToIndex(this.currentIndex);
      setTimeout(() => {
        this.updateIndicators();
        this.updateButtonVisibility();
      }, 100);
    }
  }

  scrollToIndex(index: number): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    carousel.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    this.currentIndex = index;
    this.updateIndicators();
    this.activateCurrentItem();
    this.updateButtonVisibility();
  }

  activateCurrentItem(): void {
    const items = this.carousel.nativeElement.querySelectorAll('li');
    items.forEach((item: HTMLElement, index: number) => {
      item.classList.toggle('active', index === this.currentIndex);
    });
  }

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const threshold = 50;
    const deltaX = this.endX - this.startX;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.scrollLeft();
      } else {
        this.scrollRight();
      }
    } else {
      this.snapToClosest();
    }
  }

  snapToClosest(): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    const newIndex = Math.round(carousel.scrollLeft / itemWidth);
    this.scrollToIndex(newIndex);
  }

  updateIndicators(): void {
    const totalPages = Math.ceil(this.items.length / this.getItemsPerPage());
    this.pages = Array.from({ length: totalPages }, (_, i) => i);
    this.cdr.detectChanges();
  }

  getCurrentPage(): number {
    return Math.floor(this.currentIndex / this.getItemsPerPage());
  }

  getItemsPerPage(): number {
    return this.itemsPerPage;
  }

  updateButtonVisibility(): void {
    this.showPrevButton = this.currentIndex > 0;
    this.showNextButton = this.currentIndex < this.items.length - this.getItemsPerPage();
    this.cdr.detectChanges();
  }
}