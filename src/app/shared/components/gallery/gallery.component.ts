import { AfterViewInit, Component, ElementRef, Input, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID, OnInit, Renderer2, OnChanges, SimpleChanges, OnDestroy, HostListener, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Optimiza la detección de cambios
})
export class GalleryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() items: { image: string, title: string }[] = [];
  @Input() itemsPerPage = 1;
  @Input() size?: 'small' | 'medium' | 'large' | string;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @ViewChild('galleryContainer', { static: false }) galleryContainer!: ElementRef;

  private sizeMap: { [key: string]: string } = {
    small: '200px',
    medium: '350px',
    large: '450px'
  };

  currentIndex = 0;
  pages: number[] = [];
  showPrevButton$ = new BehaviorSubject<boolean>(false);
  showNextButton$ = new BehaviorSubject<boolean>(true);

  private swipeData = { startX: 0, endX: 0, startTime: 0, endTime: 0 };
  private resizeListener!: () => void;
  private isBrowser: boolean = false;
  public isHomeRoute = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Asegurar que se evalúa correctamente
  }

  // Ciclo de vida de Angular

  /**
   * ngOnInit: Se ejecuta cuando el componente es inicializado, se verifica si está en un navegador y se establece el listener para el cambio de tamaño.
   */
  ngOnInit(): void {
    if (this.isBrowser) {
      this.resizeListener = this.renderer.listen(window, 'resize', () => this.setItemsPerPageCSSVariable());
      this.updateIndicators();  // Calcula los indicadores al inicio
    }

    this.checkIfHomeRoute(); // Verificar si estamos en home
    this.router.events.subscribe(() => this.checkIfHomeRoute()); // Detectar cambios de ruta
  }

  /**
   * ngOnChanges: Se ejecuta cuando hay cambios en las entradas del componente, en este caso actualiza el número de elementos por página si es necesario.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsPerPage'] && this.isBrowser) {
      this.setItemsPerPageCSSVariable();
    }
  }

  /**
   * ngAfterViewInit: Se ejecuta después de la inicialización de las vistas del componente, realizando la detección de cambios si estamos en el navegador.
   */
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.cdr.detectChanges();  // Fuerza la detección de cambios
      this.setItemsPerPageCSSVariable();
    }
  }

  /**
   * ngOnDestroy: Limpia el listener cuando el componente se destruye para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    if (this.isBrowser && this.resizeListener) {
      this.resizeListener();  // Limpia el listener en el destroy
    }
  }

  private checkIfHomeRoute(): void {
    this.isHomeRoute = this.router.url === '/';
  }

  // Lógica de galería

  /**
   * getItemsPerPage: Devuelve la cantidad de elementos a mostrar por página según el tamaño de la pantalla.
   */
  public getItemsPerPage(): number {
    return window.innerWidth <= 768 ? 1 : this.itemsPerPage;  // Ajusta según el tamaño de pantalla
  }

  /**
   * setItemsPerPageCSSVariable: Establece el número de elementos por página en una variable CSS personalizada para ser utilizada en el CSS.
   */
  private setItemsPerPageCSSVariable(): void {
    if (!this.isBrowser || !this.galleryContainer?.nativeElement) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.galleryContainer.nativeElement.style.setProperty('--items-per-page', `${this.getItemsPerPage()}`);
      });
    });
  }

  // Funciones de navegación

  /**
   * scrollLeft: Desplaza la galería hacia la izquierda.
   */
  scrollLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.getItemsPerPage(), 0);
      this.scrollToIndex(this.currentIndex);
    }
  }

  /**
   * scrollRight: Desplaza la galería hacia la derecha.
   */
  scrollRight(): void {
    const maxIndex = this.items.length - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.getItemsPerPage(), maxIndex);
      this.scrollToIndex(this.currentIndex);
    }
  }

  /**
   * scrollToIndex: Desplaza la galería a un índice específico y actualiza los indicadores.
   * @param index El índice al que se debe desplazar la galería.
   */
  public scrollToIndex(index: number): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    carousel.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
    this.currentIndex = index;
    this.updateIndicators();
    this.activateCurrentItem();
    this.updateButtonVisibility();
  }

  /**
   * activateCurrentItem: Activa la clase "active" en el ítem actual de la galería.
   */
  private activateCurrentItem(): void {
    const items = this.carousel.nativeElement.querySelectorAll('li');
    items.forEach((item: HTMLElement, index: number) => {
      item.classList.toggle('active', index === this.currentIndex);
    });
  }

  // Funciones de gestos táctiles (swipe)

  /**
   * onTouchStart: Maneja el inicio del gesto táctil, guardando la posición inicial del toque.
   * @param event El evento de toque.
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.swipeData.startX = event.touches[0].clientX;
      this.swipeData.startTime = Date.now();
    }
  }

  /**
   * onTouchEnd: Maneja el final del gesto táctil y calcula la acción correspondiente (desplazamiento).
   * @param event El evento de toque finalizado.
   */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      this.swipeData.endX = event.changedTouches[0].clientX;
      this.swipeData.endTime = Date.now();
      this.handleSwipe();
    }
  }

  /**
   * handleSwipe: Calcula la dirección y velocidad del deslizamiento y realiza la acción de desplazamiento correspondiente.
   */
  private handleSwipe(): void {
    const deltaX = this.swipeData.endX - this.swipeData.startX;
    const deltaTime = Math.max(1, this.swipeData.endTime - this.swipeData.startTime);
    const velocity = Math.abs(deltaX) / deltaTime;

    const threshold = 50;  // Umbral para el desplazamiento
    const minVelocity = 0.3;  // Velocidad mínima para considerar swipe

    if (Math.abs(deltaX) > threshold || velocity > minVelocity) {
      if (deltaX > 0) {
        this.scrollLeft();
      } else {
        this.scrollRight();
      }
    } else {
      this.snapToClosest();
    }
  }

  /**
   * snapToClosest: Ajusta el desplazamiento a la posición más cercana al índice de los elementos.
   */
  private snapToClosest(): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    const newIndex = Math.round(carousel.scrollLeft / itemWidth);
    this.scrollToIndex(newIndex);
  }

  // Funciones de indicadores y botones

  /**
   * updateIndicators: Actualiza los indicadores de la galería y la visibilidad de los botones de navegación.
   */
  private updateIndicators(): void {
    this.pages = Array.from({ length: Math.ceil(this.items.length / this.getItemsPerPage()) }, (_, i) => i);
    this.showPrevButton$.next(this.currentIndex > 0);
    this.showNextButton$.next(this.currentIndex < this.items.length - this.getItemsPerPage());
  }

  /**
   * getCurrentPage: Devuelve la página actual según el índice de los elementos.
   */
  getCurrentPage(): number {
    return Math.floor(this.currentIndex / this.getItemsPerPage());
  }

  /**
   * updateButtonVisibility: Actualiza la visibilidad de los botones de navegación (anterior y siguiente).
   */
  private updateButtonVisibility(): void {
    this.showPrevButton$.next(this.currentIndex > 0);
    this.showNextButton$.next(this.currentIndex < this.items.length - this.getItemsPerPage());
  }

  get computedHeight(): string | null {
    return this.size ? this.sizeMap[this.size] || this.size : null;
  }
}
