import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from '../routes/app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { PdfGeneratorService } from '../../shared/services/pdf-generator.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions()
    ), 
    provideClientHydration(), 
    provideHttpClient(),
    PdfGeneratorService
  ]
};
