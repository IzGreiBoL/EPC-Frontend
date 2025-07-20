import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResizeService implements OnDestroy {
  private isMobileSubject = new BehaviorSubject<boolean>(window.innerWidth < 768);
  private gallerySizeSubject = new BehaviorSubject<'small' | 'large'>(window.innerWidth < 768 ? 'small' : 'large');
  private resizeListener = () => {
    const w = window.innerWidth;
    this.isMobileSubject.next(w < 768);
    this.gallerySizeSubject.next(w < 768 ? 'small' : 'large');
  };

  constructor() {
    window.addEventListener('resize', this.resizeListener);
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
    window.removeEventListener('resize', this.resizeListener);
  }
}
