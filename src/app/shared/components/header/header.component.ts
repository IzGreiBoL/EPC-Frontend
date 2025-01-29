import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, SidebarComponent, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isTransparent: boolean = false;
  isHomePage: boolean = false;
  isMobile: boolean = false;

  private resizeListener!: () => void;

  constructor(
    private location: Location,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object // Identifica si es navegador o servidor
  ) {
    // Detecta si estás en la página de inicio
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(this.router.url);
        // Detectamos si la URL es exactamente "/"
        this.isHomePage = this.router.url === '/' || this.router.url === '';
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo ejecuta en el cliente
      this.checkMobile();
      this.resizeListener = this.checkMobile.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }

  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Limpia el listener en el cliente
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  // Método para detectar si el dispositivo es móvil
  checkMobile(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  // Método para regresar a la página anterior
  goBack(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }
}
