import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../core/models/service.model';
import { ServicesService } from '../../core/services/services.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.services = this.servicesService.getServices();
  }
}