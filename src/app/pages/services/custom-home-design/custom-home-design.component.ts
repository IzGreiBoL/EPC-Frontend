import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  services: Service[] = [];

  constructor(
    private servicesService: ServicesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.services = this.servicesService.getServices().filter(
      s => s.category === 'custom-home-design'
    );
  }

  navigateToCustomQuote(): void {
    this.router.navigate(['/quotes/custom']);
  }
}