import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { APP_SETTINGS } from '../config/app-settings.config';

/**
 * Servicio que combina configuraciones de environment y app-settings
 * Provee acceso unificado a todas las configuraciones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  // === CONFIGURACIONES DE ENTORNO ===
  
  get isProduction(): boolean {
    return environment.production;
  }

  get apiBaseUrl(): string {
    return environment.api.baseUrl;
  }

  get apiEndpoints() {
    return environment.api.endpoints;
  }

  get emailConfig() {
    return {
      ...environment.email,
      ...APP_SETTINGS.email // Combina configuraciones de SMTP (environment) con contenido (app-settings)
    };
  }

  get pdfConfig() {
    return environment.pdf;
  }

  get serverConfig() {
    return environment.server;
  }

  // === CONFIGURACIONES DE NEGOCIO ===

  get company() {
    return APP_SETTINGS.company;
  }

  get business() {
    return APP_SETTINGS.business;
  }

  get pricing() {
    return APP_SETTINGS.pricing;
  }

  get defaults() {
    return APP_SETTINGS.defaults;
  }

  get theme() {
    return APP_SETTINGS.theme;
  }

  get legal() {
    return APP_SETTINGS.legal;
  }

  get images() {
    return APP_SETTINGS.images;
  }

  get houseModels() {
    return APP_SETTINGS.houseModels;
  }

  get basicCategories() {
    return APP_SETTINGS.basicCategories;
  }

  get advancedCategories() {
    return APP_SETTINGS.advancedCategories;
  }

  get customCategories() {
    return APP_SETTINGS.customCategories;
  }

  get remodelCategories() {
    return APP_SETTINGS.remodelCategories;
  }

  get services() {
    return APP_SETTINGS.services;
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Obtiene la URL completa de un endpoint
   */
  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }

  /**
   * Obtiene la URL completa para enviar emails
   */
  getEmailSendUrl(): string {
    return this.getApiUrl(this.apiEndpoints.sendEmail);
  }

  /**
   * Obtiene la URL completa para generar PDFs
   */
  getPdfUrl(): string {
    return this.getApiUrl(this.apiEndpoints.quotePdf);
  }

  /**
   * Obtiene configuración combinada para emails
   */
  getFullEmailConfig() {
    return {
      smtp: environment.email.smtp,
      sender: environment.email.sender,
      recipient: environment.email.recipient,
      pdfFilename: APP_SETTINGS.email.pdfFilename,
      footerText: APP_SETTINGS.email.footerText,
      signature: APP_SETTINGS.email.signature
    };
  }
}
