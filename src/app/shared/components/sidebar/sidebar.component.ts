import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ServicesService],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isOpen: boolean = false;
  isSubmenuOpen: boolean = true;
  services: Service[] = [];
  private routerSubscription!: Subscription;

  constructor(
    private servicesService: ServicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getServices();

    // 🔹 Detecta cuando la navegación ha terminado y cierra el sidebar
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isOpen = false; // Cierra el sidebar después de la navegación
    });
  }

  ngOnDestroy(): void {
    // 🔹 Evita fugas de memoria cancelando la suscripción cuando el componente se destruye
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Alterna el estado de apertura/cierre del sidebar.
   */
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Alterna la visibilidad del submenu dentro del sidebar.
   * Detiene la propagación del evento para evitar que se cierre el sidebar.
   */
  toggleSubmenu(event: Event): void {
    event.stopPropagation();
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  /**
   * Obtiene la lista de servicios y los filtra para mostrar solo los que tienen un slug.
   */
  getServices(): void {
    this.services = this.servicesService.getServices().filter(service => service.slug);
  }

  /**
   * Navega a la página del servicio seleccionado.
   * @param slug - Slug del servicio al que se va a navegar.
   */
  navigateToService(slug: string): void {
    this.router.navigate(['/services', slug]);
  }

  /**
   * Navega a la página de inicio y realiza el desplazamiento a la parte superior.
   */
  navigateToHome(event: Event): void {
    event.preventDefault();
    this.isOpen = false; // Cierra el sidebar

    this.router.navigate(['/']).then(() => {
      this.scrollToTop();
    });
  }

  /**
   * Desplaza la página hacia la parte superior de manera suave.
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Navega a la sección 'projects' en la página de inicio.
   */
  navigateToProjects(event: Event): void {
    event.preventDefault();
    this.isOpen = false; // Cierra el sidebar

    this.router.navigate(['/']).then(() => { // 🔹 Navegar a home sin fragmento
      setTimeout(() => { // 🔹 Esperar un poco y luego navegar con fragmento
        this.router.navigate(['/'], { fragment: 'projects' }).then(() => {
          this.scrollToProjects();
        });
      }, 100);
    });
  }

  /**
   * Desplaza la página hasta el elemento con id 'projects'.
   */
  private scrollToProjects(): void {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Elemento #projects no encontrado en el DOM.');
    }
  }

  /**
   * Espera a que la navegación se complete y luego realiza el desplazamiento a la sección de 'projects'.
   */
  private waitForRenderAndScroll(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToProjects();
      });
  }

  /**
   * Navega a la sección de contacto.
   */
  navigateToContactUs(event: Event): void {
    event.preventDefault();
    this.isOpen = false; // Cierra el sidebar

    this.router.navigate(['/']).then(() => { // 🔹 Navegar a home sin fragmento
      setTimeout(() => { // 🔹 Esperar y luego agregar el fragmento
        this.router.navigate(['/'], { fragment: 'contact-us' }).then(() => {
          this.scrollToContactUs();
        });
      }, 100);
    });
  }

  /**
   * Desplaza la página hasta el elemento con id 'contact-us'.
   */
  private scrollToContactUs(): void {
    const element = document.getElementById('contact-us');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Elemento #contact-us no encontrado en el DOM.');
    }
  }

  /**
   * Espera a que la navegación se complete y luego realiza el desplazamiento a la sección de 'contact-us'.
   */
  private waitForRenderAndScrollContactUs(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToContactUs();
      });
  }
}
