import {
  AfterViewInit, Component, ElementRef, Input, ViewChild, ChangeDetectorRef,
  Inject, PLATFORM_ID, OnInit, Renderer2, OnChanges, SimpleChanges, OnDestroy,
  HostListener, ChangeDetectionStrategy, NgZone
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  //#region INPUTS Y VARIABLES DE ESTADO

  /** Inputs **/
  @Input() items: { image: string, title: string }[] = [];
  @Input() itemsPerPage = 1;
  @Input() size?: 'small' | 'medium' | 'large' | string;

  /** ViewChilds **/
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @ViewChild('galleryContainer', { static: false }) galleryContainer!: ElementRef;

  /** Variables de estado **/
  currentIndex = 0;
  pages: number[] = [];
  showPrevButton$ = new BehaviorSubject<boolean>(false);
  showNextButton$ = new BehaviorSubject<boolean>(true);
  public isHomeRoute = false;
  private isBrowser: boolean = false;

  /** Mapeo de tamaños **/
  private sizeMap: { [key: string]: string } = {
    small: '200px',
    medium: '350px',
    large: '450px'
  };

  /** Datos de deslizamiento **/
  private swipeData = { startX: 0, endX: 0, startTime: 0, endTime: 0 };

  /** Suscripciones y listeners **/
  private resizeListener!: () => void;
  private routeSubscription!: Subscription;

  //#endregion

  //#region CONSTRUCTOR

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  //#endregion

  //#region CICLO DE VIDA

  /*
   * Inicializa eventos y suscripciones al iniciar el componente
   */
  ngOnInit(): void {
    if (this.isBrowser) {
      this.resizeListener = this.renderer.listen(window, 'resize', () => this.setItemsPerPageCSSVariable());
      this.updateIndicators();
    }
    this.checkIfHomeRoute();
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => this.checkIfHomeRoute(), 0);
      }
    });
  }

  /**
   * Detecta cambios en los inputs del componente.
   * @param changes - Contiene los cambios en los inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemsPerPage'] && this.isBrowser) {
      this.setItemsPerPageCSSVariable();
    }
  }

  /*
   * Ejecuta lógica después de que la vista ha sido renderizada
   */
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.cdr.detectChanges();
      this.setItemsPerPageCSSVariable();
    }
  }

  /*
   * Limpia suscripciones y eventos al destruir el componente
   */
  ngOnDestroy(): void {
    if (this.isBrowser && this.resizeListener) {
      this.resizeListener();
    }
    this.routeSubscription?.unsubscribe();
  }

  //#endregion

  //#region LÓGICA DE LA RUTA, RUTA HOME

  /*
   * Verifica si la ruta actual es la home y actualiza la variable isHomeRoute
   */
  private checkIfHomeRoute(): void {
    this.isHomeRoute = this.router.url.startsWith('/#') || this.router.url === '/';
    this.cdr.detectChanges();
  }

  //#endregion

  //#region FUNCIONES DE PAGINACIÓN

  /**
   * Retorna la cantidad de elementos por página, dependiendo del tamaño de pantalla.
   * @returns {number} - Número de elementos por página.
   */
  public getItemsPerPage(): number {
    return window.matchMedia('(max-width: 768px)').matches ? 1 : this.itemsPerPage;
  }

  /*
   * Actualiza la variable CSS que define los elementos por página
   */
  private setItemsPerPageCSSVariable(): void {
    if (!this.isBrowser || !this.galleryContainer?.nativeElement) return;
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.galleryContainer.nativeElement.style.setProperty('--items-per-page', `${this.getItemsPerPage()}`);
      });
    });
  }

  /*
   * Actualiza la paginación del carrusel
   */
  private updateIndicators(): void {
    this.pages = Array.from({ length: Math.ceil(this.items.length / this.getItemsPerPage()) }, (_, i) => i);
    this.updateButtonVisibility();
  }

  /**
   * Obtiene el número de la página actual.
   * @returns {number} - Número de la página actual.
   */
  getCurrentPage(): number {
    return Math.floor(this.currentIndex / this.getItemsPerPage());
  }

  /*
   * Muestra u oculta los botones de navegación según la posición actual
   */
  private updateButtonVisibility(): void {
    this.showPrevButton$.next(this.currentIndex > 0);
    this.showNextButton$.next(this.currentIndex < this.items.length - this.getItemsPerPage());
  }

  //#endregion

  //#region FUNCIONES DE NAVEGACIÓN

  /*
   * Mueve el carrusel hacia la izquierda
   */
  scrollLeft(): void {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(this.currentIndex - this.getItemsPerPage(), 0);
      this.scrollToIndex(this.currentIndex);
    }
  }

  /*
   * Mueve el carrusel hacia la derecha
   */
  scrollRight(): void {
    const maxIndex = this.items.length - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex = Math.min(this.currentIndex + this.getItemsPerPage(), maxIndex);
      this.scrollToIndex(this.currentIndex);
    }
  }

  /**
   * Desplaza el carrusel a un índice específico.
   * @param index - Índice del elemento al que se quiere desplazar.
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

  /*
   * Agrega la clase `active` al elemento actualmente visible
   */
  private activateCurrentItem(): void {
    const items = this.carousel.nativeElement.querySelectorAll('li');
    items.forEach((item: HTMLElement, index: number) => {
      item.classList.toggle('active', index === this.currentIndex);
    });
  }

  //#endregion

  //#region FUNCIONES DE DESLIZAMIENTO TÁCTIL

  /*
   * Captura el inicio de un deslizamiento táctil
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.swipeData.startX = event.touches[0].clientX;
      this.swipeData.startTime = Date.now();
    }
  }

  /*
   * Captura el final de un deslizamiento táctil y lo procesa
   */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      this.swipeData.endX = event.changedTouches[0].clientX;
      this.swipeData.endTime = Date.now();
      this.handleSwipe();
    }
  }

  /*
   * Procesa el deslizamiento y determina si se mueve el carrusel
   */
  private handleSwipe(): void {
    const deltaX = this.swipeData.endX - this.swipeData.startX;
    const deltaTime = Math.max(1, this.swipeData.endTime - this.swipeData.startTime);
    const velocity = Math.abs(deltaX) / deltaTime;

    const threshold = 50;
    const minVelocity = 0.3;

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

  /*
   * Ajusta el carrusel para que se alinee con el ítem más cercano
   */
  private snapToClosest(): void {
    const carousel = this.carousel.nativeElement;
    const itemWidth = carousel.scrollWidth / this.items.length;
    const newIndex = Math.round(carousel.scrollLeft / itemWidth);
    this.scrollToIndex(newIndex);
  }

  //#endregion

  //#region FUNCIONES DE ESTILO 

  /**
   * Calcula la altura del carrusel según el tamaño especificado.
   * @returns {string | null} - Altura calculada del carrusel o `null` si no hay tamaño definido.
   */
  get computedHeight(): string | null {
    return this.size ? this.sizeMap[this.size] || this.size : null;
  }

  //#endregion
}
