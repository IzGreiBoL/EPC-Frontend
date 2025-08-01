import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ServicesService]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isTransparent: boolean = false;
  isHomePage: boolean = false;
  isMobile: boolean = false;

  // Sidebar logic
  isSidebarOpen: boolean = false;
  isSubmenuOpen: boolean = true;
  services: Service[] = [];
  private routerSubscription!: Subscription;

  private resizeListener!: () => void;

  constructor(
    private location: Location,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private servicesService: ServicesService
  ) {
    // Detecta si estás en la página de inicio
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Detectamos si la URL es exactamente "/"
        this.isHomePage = this.router.url === '/' || this.router.url === '';
        this.isSidebarOpen = false;
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      this.resizeListener = this.checkMobile.bind(this);
      window.addEventListener('resize', this.resizeListener);
    }
    this.getServices();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
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

  // Sidebar methods
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSubmenu(event: Event): void {
    event.stopPropagation();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  getServices(): void {
    this.services = this.servicesService.getServices().filter(service => service.showInHeader);
  }

  navigateToService(slug: string): void {
    const service = this.servicesService.getServiceBySlug(slug);
    
    if (service?.category === 'other-services') {
      this.router.navigate(['/services/other-services'], { fragment: slug });
    } else {
      this.router.navigate(['/services', slug]);
    }
    
    this.isSidebarOpen = false;
  }

  navigateToHome(event: Event): void {
    event.preventDefault();
    this.isSidebarOpen = false;
    this.router.navigate(['/']).then(() => {
      this.scrollToTop();
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToProjects(event: Event): void {
    event.preventDefault();
    this.isSidebarOpen = false;
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.router.navigate(['/'], { fragment: 'projects' }).then(() => {
          this.scrollToProjects();
        });
      }, 100);
    });
  }

  private scrollToProjects(): void {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToContactUs(event: Event): void {
    event.preventDefault();
    this.isSidebarOpen = false;
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.router.navigate(['/'], { fragment: 'contact-us' }).then(() => {
          this.scrollToContactUs();
        });
      }, 100);
    });
  }

  private scrollToContactUs(): void {
    const element = document.getElementById('contact-us');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
