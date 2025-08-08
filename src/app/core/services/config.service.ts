import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Service } from '../models/service.model';

/**
 * Servicio para acceder a configuraciones centralizadas
 * Proporciona acceso fácil a todas las configuraciones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  constructor(private appConfig: AppConfigService) {}

  // === COMPANY INFO ===
  get companyName(): string {
    return this.appConfig.company.name;
  }

  get companyTagline(): string {
    return this.appConfig.company.tagline;
  }

  get displayPhone(): string {
    return this.appConfig.company.phone.display;
  }

  get businessPhone(): string {
    return this.appConfig.company.phone.business;
  }

  get companyEmail(): string {
    return this.appConfig.company.email;
  }

  get companyWebsite(): string {
    return this.appConfig.company.website.url;
  }

  get companyWebsiteDisplay(): string {
    return this.appConfig.company.website.display;
  }

  get companyLocation(): string {
    return this.appConfig.company.location;
  }

  get serviceArea(): string {
    return this.appConfig.company.serviceArea;
  }

  // === ABOUT US CONTENT ===
  get aboutUsWelcome(): string {
    return this.appConfig.company.aboutUs.welcome;
  }

  get aboutUsCommitment(): string {
    return this.appConfig.company.aboutUs.commitment;
  }

  get aboutUsClosing(): string {
    return this.appConfig.company.aboutUs.closing;
  }

  // === SOCIAL MEDIA ===
  get socialMediaInstagram() {
    return this.appConfig.company.socialMedia.instagram;
  }

  get socialMediaLinkedin() {
    return this.appConfig.company.socialMedia.linkedin;
  }

  get showInstagram(): boolean {
    return this.appConfig.company.socialMedia.instagram.show;
  }

  get showLinkedin(): boolean {
    return this.appConfig.company.socialMedia.linkedin.show;
  }

  // === API CONFIGURATION ===
  get apiBaseUrl(): string {
    return this.appConfig.apiBaseUrl;
  }

  get mailApiUrl(): string {
    return this.appConfig.getEmailSendUrl();
  }

  get quotePdfUrl(): string {
    return this.appConfig.getPdfUrl();
  }

  // === PRICING ===
  get basicQuoteBasePrice(): number {
    return this.appConfig.pricing.basePerSqft.basic;
  }

  get advancedQuoteBasePrice(): number {
    return this.appConfig.pricing.basePerSqft.advanced;
  }

  get remodelQuoteBasePrice(): number {
    return this.appConfig.pricing.basePerSqft.remodel;
  }

  get customQuoteBasePrice(): number {
    return this.appConfig.pricing.basePerSqft.custom;
  }

  get bedroomExtraPrice(): number {
    return this.appConfig.pricing.customPricing.bedroomPricePerExtra;
  }

  get bathroomExtraPrice(): number {
    return this.appConfig.pricing.customPricing.bathroomPricePerExtra;
  }

  get defaultBedrooms(): number {
    return this.appConfig.pricing.customPricing.defaultBedrooms;
  }

  get defaultBathrooms(): number {
    return this.appConfig.pricing.customPricing.defaultBathrooms;
  }

  // === GARAGE PRICING ===
  get garageOneCarPrice(): number {
    return this.appConfig.pricing.garage.oneCar;
  }

  get garageTwoCarPrice(): number {
    return this.appConfig.pricing.garage.twoCar;
  }

  get garageThreeCarPrice(): number {
    return this.appConfig.pricing.garage.threeCar;
  }

  // === DEFAULT VALUES ===
  get defaultCustomSqft(): number {
    return this.appConfig.defaults.custom.sqft;
  }

  get minCustomSqft(): number {
    return this.appConfig.defaults.custom.minSqft;
  }

  get defaultRemodelSqft(): number {
    return this.appConfig.defaults.remodel.sqft;
  }

  get minRemodelSqft(): number {
    return this.appConfig.defaults.remodel.minSqft;
  }

  get maxBedrooms(): number {
    return this.appConfig.defaults.custom.maxBedrooms;
  }

  get minBedrooms(): number {
    return this.appConfig.defaults.custom.minBedrooms;
  }

  get minBathrooms(): number {
    return this.appConfig.defaults.custom.minBathrooms;
  }

  get bathroomStep(): number {
    return this.appConfig.defaults.custom.bathroomStep;
  }

  // === BUSINESS RULES ===
  get quoteValidityDays(): number {
    return this.appConfig.business.quoteValidityDays;
  }

  // === THEME COLORS ===
  get primaryColor(): string {
    return this.appConfig.theme.colors.primary;
  }

  get primaryDarkColor(): string {
    return this.appConfig.theme.colors.primaryDark;
  }

  // === LEGAL TEXTS ===
  get quoteDisclaimer(): string {
    return this.appConfig.legal.quoteDisclaimer;
  }

  get quoteValidityText(): string {
    return this.appConfig.legal.quoteValidityText;
  }

  get quoteExpirationText(): string {
    return this.appConfig.legal.quoteExpirationText;
  }

  // === EMAIL CONFIGURATION ===
  get emailPdfFilename(): string {
    return this.appConfig.emailConfig.pdfFilename;
  }

  // === IMAGES ===
  get logoImage(): string {
    return this.appConfig.images.logo;
  }

  get thankYouImage(): string {
    return this.appConfig.images.thankYou;
  }

  get quoteLogoImage(): string {
    return this.appConfig.images.quoteLogo;
  }

  // === MÉTODOS HELPER ===
  
  /**
   * Calcula el precio extra por habitaciones adicionales
   */
  calculateBedroomExtra(bedrooms: number): number {
    const extra = bedrooms - this.defaultBedrooms;
    return extra > 0 ? extra * this.bedroomExtraPrice : 0;
  }

  /**
   * Calcula el precio extra por baños adicionales
   */
  calculateBathroomExtra(bathrooms: number): number {
    const extra = bathrooms - this.defaultBathrooms;
    return extra > 0 ? extra * this.bathroomExtraPrice : 0;
  }

  /**
   * Obtiene el precio del garaje según el número de carros
   */
  getGaragePrice(cars: number): number {
    switch (cars) {
      case 1: return this.garageOneCarPrice;
      case 2: return this.garageTwoCarPrice;
      case 3: return this.garageThreeCarPrice;
      default: return 0;
    }
  }

  /**
   * Verifica si un tamaño de casa puede acomodar cierto número de habitaciones
   */
  canAccommodateBedrooms(sqft: number, bedrooms: number): boolean {
    if (bedrooms <= 3) return sqft >= 1300;
    if (bedrooms <= 4) return sqft >= 1500;
    if (bedrooms <= 5) return sqft >= 2200;
    return false; // Más de 5 habitaciones requiere contacto
  }

  /**
   * Obtiene la configuración completa (para casos especiales)
   */
  getAllSettings() {
    return this.appConfig;
  }

  // === HOUSE MODELS ===
  getHouseModels() {
    return JSON.parse(JSON.stringify(this.appConfig.houseModels));
  }

  getHouseModelById(id: number) {
    const models = this.getHouseModels();
    return models.find((model: any) => model.id === id);
  }

  // === QUOTE CATEGORIES ===
  getBasicCategories() {
    return JSON.parse(JSON.stringify(this.appConfig.basicCategories));
  }

  getAdvancedCategories() {
    return JSON.parse(JSON.stringify(this.appConfig.advancedCategories));
  }

  getCustomCategories() {
    return JSON.parse(JSON.stringify(this.appConfig.customCategories));
  }

  getRemodelCategories() {
    return JSON.parse(JSON.stringify(this.appConfig.remodelCategories));
  }

  getCategoriesByType(type: 'basic' | 'advanced' | 'custom' | 'remodel') {
    switch (type) {
      case 'basic': return this.getBasicCategories();
      case 'advanced': return this.getAdvancedCategories();
      case 'custom': return this.getCustomCategories();
      case 'remodel': return this.getRemodelCategories();
      default: return [];
    }
  }

  // === SERVICES ===
  getServices() {
    return JSON.parse(JSON.stringify(this.appConfig.services));
  }

  getServicesSlugs(): string[] {
    return this.appConfig.services.filter(s => s.showInHeader).map(service => service.slug);
  }

  getServiceBySlug(slug: string): Service | undefined {
    const services = this.getServices();
    return services.find((service: Service) => service.slug === slug);
  }
}
