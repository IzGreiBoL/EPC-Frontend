import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResizeService implements OnDestroy {
  private getWindowWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  }

  private isMobileSubject = new BehaviorSubject<boolean>(this.getWindowWidth() < 768);
  private gallerySizeSubject = new BehaviorSubject<'small' | 'large'>(this.getWindowWidth() < 768 ? 'small' : 'large');
  private resizeListener = () => {
    const w = this.getWindowWidth();
    this.isMobileSubject.next(w < 768);
    this.gallerySizeSubject.next(w < 768 ? 'small' : 'large');
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  get isMobile$() {
    return this.isMobileSubject.asObservable();
  }

  get gallerySize$() {
    return this.gallerySizeSubject.asObservable();
  }

  get isMobile() {
    return this.isMobileSubject.value;
  }

  get gallerySize() {
    return this.gallerySizeSubject.value;
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
