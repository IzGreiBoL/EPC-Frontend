import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { ServicesService } from '../../../core/services/services.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './services-detail.component.html',
  styleUrls: ['./services-detail.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ServiceDetailComponent implements OnInit {
  service: Service | undefined;

  constructor(
    private route: ActivatedRoute,
    private servicesService: ServicesService
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.service = this.servicesService.getServiceBySlug(slug);
    }
  }
}