import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-other-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './other-services.component.html',
  styleUrls: ['./other-services.component.scss']
})
export class OtherServices implements OnInit, AfterViewInit {
  services: Service[] = [];

  constructor(
    private servicesService: ServicesService, 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.services = this.servicesService.getServices().filter(service => service.category === 'other-services');
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 100);
      }
    });

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            const element = document.getElementById(slug);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 100);
      }
    });
  }

  navigateToUrl(url: string): void {
    if (url.startsWith('/#')) {
      const fragment = url.substring(2);
      this.router.navigate(['/'], { fragment: fragment });
    } else if (url.startsWith('/')) {
      this.router.navigate([url]);
    } else {
      window.location.href = url;
    }
  }
}
