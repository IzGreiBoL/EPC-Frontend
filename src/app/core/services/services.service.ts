import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private config: ConfigService) { }

  getServices(): Service[] {
    return this.config.getServices();
  }

  getServicesSlugs(): string[] {
    return this.config.getServicesSlugs();
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.config.getServiceBySlug(slug);
  }
}
