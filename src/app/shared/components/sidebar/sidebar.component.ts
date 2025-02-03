import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [ServicesService],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private servicesService: ServicesService, private router: Router) {}

  @Input() isOpen: boolean = false;
  isSubmenuOpen: boolean = true;
  services: Service[] = [];

  ngOnInit(): void {
    this.getServices();
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleSubmenu(event: Event): void {
    event.stopPropagation(); // Detener la propagación del evento de clic
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  getServices(): void {
    this.services = this.servicesService.getServices().filter(service => service.slug);
  }

  navigateToService(slug: string): void {
    this.router.navigate(['/services', slug]).then(() => {
      this.toggleSidebar();
    });
  }
}