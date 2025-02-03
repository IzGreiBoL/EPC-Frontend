import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../../core/services/services.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-custom-home-design',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-home-design.component.html',
  styleUrls: ['./custom-home-design.component.scss']
})
export class CustomHomeDesignComponent implements OnInit {
  service: Service | undefined;

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.service = this.servicesService.getServiceBySlug('custom-home-design');
    console.log (this.service);
  }
}