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
  @Input() items: { image: string, title: string | number }[] = [];
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

  /** Variables para la visualización ampliada */
  isImageViewerOpen = false;
  selectedImageIndex = 0;

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

    // Asegurar que el scroll del cuerpo se restaure si el componente se destruye mientras el modal está abierto
    if (this.isBrowser && this.isImageViewerOpen) {
      document.body.style.overflow = '';
    }
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

  //#region FUNCIONES DE VISUALIZACIÓN AMPLIADA

  /**
   * Abre el visualizador de imágenes en pantalla completa.
   * @param index - Índice de la imagen a mostrar.
   */
  openImageViewer(index: number): void {
    this.selectedImageIndex = index;
    this.isImageViewerOpen = true;
    this.cdr.detectChanges();

    // Prevenir el scroll del cuerpo cuando el modal está abierto
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';

      // Esperar a que el DOM se actualice y ajustar el tamaño del contenedor
      setTimeout(() => {
        this.adjustImageViewerSize();
      }, 100);
    }
  }

  /**
   * Cierra el visualizador de imágenes.
   */
  closeImageViewer(): void {
    this.isImageViewerOpen = false;
    this.cdr.detectChanges();

    // Restaurar el scroll del cuerpo cuando el modal se cierra
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Navega a la imagen anterior o siguiente dentro del visualizador.
   * @param direction - Dirección de navegación (-1 para anterior, 1 para siguiente).
   */
  navigateImage(direction: number): void {
    const newIndex = this.selectedImageIndex + direction;
    if (newIndex >= 0 && newIndex < this.items.length) {
      this.selectedImageIndex = newIndex;
      this.cdr.detectChanges();
      
      // Ajustar el contenedor para la imagen actual
      this.adjustImageForViewer();
    }
  }

  /**
   * Ajusta la visualización de la imagen actual sin cambiar el tamaño del contenedor.
   * Esto evita el efecto de zoom en imágenes secundarias.
   */
  private adjustImageForViewer(): void {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      const imgElement = document.querySelector('.fullscreen-image') as HTMLImageElement;
      if (imgElement) {
        // Asegurar que la imagen se muestre con sus proporciones originales
        imgElement.style.width = 'auto';
        imgElement.style.height = 'auto';
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '100%';
        imgElement.style.objectFit = 'contain';
      }
    }, 50);
  }

  /**
   * Ajusta el tamaño del visualizador según la primera imagen.
   * Esto garantiza que los botones de navegación siempre estén en la misma posición.
   */
  private adjustImageViewerSize(): void {
    if (!this.isBrowser || this.items.length === 0) return;

    const container = document.querySelector('.image-viewer-container') as HTMLElement;
    const firstImage = new Image();

    firstImage.onload = () => {
      // Detectar si estamos en móvil
      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      if (isMobile) {
        // En móvil, el contenedor se ajustará automáticamente a través de CSS
        this.cdr.detectChanges();
        return;
      }

      // Para escritorio, usar exactamente las dimensiones naturales de la imagen
      const naturalWidth = firstImage.naturalWidth;
      const naturalHeight = firstImage.naturalHeight;

      // Verificar si las dimensiones son demasiado grandes para el viewport
      const maxViewportWidth = window.innerWidth * 0.9;
      const maxViewportHeight = window.innerHeight * 0.9;

      let finalWidth = naturalWidth;
      let finalHeight = naturalHeight;

      // Escalar proporcionalmente si excede el viewport
      if (finalWidth > maxViewportWidth) {
        const ratio = maxViewportWidth / finalWidth;
        finalWidth = maxViewportWidth;
        finalHeight = finalHeight * ratio;
      }

      if (finalHeight > maxViewportHeight) {
        const ratio = maxViewportHeight / finalHeight;
        finalHeight = maxViewportHeight;
        finalWidth = finalWidth * ratio;
      }

      // Aplicar dimensiones exactas
      container.style.width = `${finalWidth}px`;
      container.style.height = `${finalHeight}px`;

      // Eliminar cualquier fondo o borde que pueda causar problemas
      container.style.backgroundColor = 'transparent';
      container.style.border = 'none';
      container.style.padding = '0';
      container.style.margin = '0';

      // Guardar dimensiones como variables CSS
      const root = document.documentElement;
      root.style.setProperty('--lightbox-width', `${finalWidth}px`);
      root.style.setProperty('--lightbox-height', `${finalHeight}px`);

      this.cdr.detectChanges();
    };

    // Cargar la primera imagen para determinar tamaño
    firstImage.src = this.items[0].image;
  }

  /**
   * Maneja las teclas de navegación cuando el visualizador está abierto.
   * @param event - Evento de teclado.
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isImageViewerOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeImageViewer();
        break;
      case 'ArrowLeft':
        if (this.selectedImageIndex > 0) {
          this.navigateImage(-1);
        }
        break;
      case 'ArrowRight':
        if (this.selectedImageIndex < this.items.length - 1) {
          this.navigateImage(1);
        }
        break;
    }
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