import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-other-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './other-services.component.html',
  styleUrls: ['./other-services.component.scss']
})
export class OtherServices implements OnInit, AfterViewInit {
  services: Service[] = [];

  constructor(private servicesService: ServicesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.services = this.servicesService.getServices().filter(service => service.slug !== 'custom-home-design');
  }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug'); // Obtiene el slug de la URL
      if (slug) {
        setTimeout(() => {
          if (typeof document !== 'undefined' && document.getElementById(slug)) {
            const element = document.getElementById(slug);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 100);
      }
    });
  }
}
