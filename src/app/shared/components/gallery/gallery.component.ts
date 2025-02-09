import { AfterViewInit, Component, ElementRef, Input, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements AfterViewInit {
  @Input() items: { image: string, title: string }[] = [];
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  currentIndex = 0;
  startX = 0;
  endX = 0;
  pages: number[] = [];

  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateIndicators();
      this.carousel.nativeElement.addEventListener('touchstart', this.onTouchStart.bind(this));
      this.carousel.nativeElement.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
  }

  scrollLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.getItemsPerPage(), 0);
      this.scrollToIndex(this.currentIndex);
    }
  }

  scrollRight(): void {
    const maxIndex = this.items.length - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.getItemsPerPage(), maxIndex);
      this.scrollToIndex(this.currentIndex);
      setTimeout(() => this.updateIndicators(), 100);
    }
  }

  scrollToIndex(index: number): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    carousel.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    this.currentIndex = index;
    this.updateIndicators();
  }

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const threshold = 50; // Minimum distance for a swipe to be detected
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
    this.cdr.detectChanges(); // Forzar la detección de cambios
    const indicators = document.querySelectorAll('.carousel-indicators span');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.getCurrentPage());
    });
  }

  getCurrentPage(): number {
    return Math.floor(this.currentIndex / this.getItemsPerPage());
  }

  getItemsPerPage(): number {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth >= 768 ? 3 : 1;
    }
    return 1; // Valor predeterminado para el servidor
  }
}