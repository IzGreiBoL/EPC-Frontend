import { Injectable } from '@angular/core';
import { APP_SETTINGS } from '../config/app-settings.config';
import { Service } from '../models/service.model';

/**
 * Servicio para acceder a configuraciones centralizadas
 * Proporciona acceso fácil a todas las configuraciones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly settings = APP_SETTINGS;

  // === COMPANY INFO ===
  get companyName(): string {
    return this.settings.company.name;
  }

  get companyTagline(): string {
    return this.settings.company.tagline;
  }

  get displayPhone(): string {
    return this.settings.company.phone.display;
  }

  get businessPhone(): string {
    return this.settings.company.phone.business;
  }

  get companyEmail(): string {
    return this.settings.company.email;
  }

  get companyWebsite(): string {
    return this.settings.company.website.url;
  }

  get companyWebsiteDisplay(): string {
    return this.settings.company.website.display;
  }

  get companyLocation(): string {
    return this.settings.company.location;
  }

  get serviceArea(): string {
    return this.settings.company.serviceArea;
  }

  // === ABOUT US CONTENT ===
  get aboutUsWelcome(): string {
    return this.settings.company.aboutUs.welcome;
  }

  get aboutUsCommitment(): string {
    return this.settings.company.aboutUs.commitment;
  }

  get aboutUsClosing(): string {
    return this.settings.company.aboutUs.closing;
  }

  // === SOCIAL MEDIA ===
  get socialMediaInstagram() {
    return this.settings.company.socialMedia.instagram;
  }

  get socialMediaLinkedin() {
    return this.settings.company.socialMedia.linkedin;
  }

  get showInstagram(): boolean {
    return this.settings.company.socialMedia.instagram.show;
  }

  get showLinkedin(): boolean {
    return this.settings.company.socialMedia.linkedin.show;
  }

  // === API CONFIGURATION ===
  get apiBaseUrl(): string {
    return this.settings.api.baseUrl;
  }

  get mailApiUrl(): string {
    return `${this.settings.api.baseUrl}${this.settings.api.endpoints.sendEmail}`;
  }

  get quotePdfUrl(): string {
    return `${this.settings.api.baseUrl}${this.settings.api.endpoints.quotePdf}`;
  }

  // === PRICING ===
  get basicQuoteBasePrice(): number {
    return this.settings.pricing.basePerSqft.basic;
  }

  get advancedQuoteBasePrice(): number {
    return this.settings.pricing.basePerSqft.advanced;
  }

  get remodelQuoteBasePrice(): number {
    return this.settings.pricing.basePerSqft.remodel;
  }

  get customQuoteBasePrice(): number {
    return this.settings.pricing.basePerSqft.custom;
  }

  get bedroomExtraPrice(): number {
    return this.settings.pricing.customPricing.bedroomPricePerExtra;
  }

  get bathroomExtraPrice(): number {
    return this.settings.pricing.customPricing.bathroomPricePerExtra;
  }

  get defaultBedrooms(): number {
    return this.settings.pricing.customPricing.defaultBedrooms;
  }

  get defaultBathrooms(): number {
    return this.settings.pricing.customPricing.defaultBathrooms;
  }

  // === GARAGE PRICING ===
  get garageOneCarPrice(): number {
    return this.settings.pricing.garage.oneCar;
  }

  get garageTwoCarPrice(): number {
    return this.settings.pricing.garage.twoCar;
  }

  get garageThreeCarPrice(): number {
    return this.settings.pricing.garage.threeCar;
  }

  // === DEFAULT VALUES ===
  get defaultCustomSqft(): number {
    return this.settings.defaults.custom.sqft;
  }

  get minCustomSqft(): number {
    return this.settings.defaults.custom.minSqft;
  }

  get defaultRemodelSqft(): number {
    return this.settings.defaults.remodel.sqft;
  }

  get minRemodelSqft(): number {
    return this.settings.defaults.remodel.minSqft;
  }

  get maxBedrooms(): number {
    return this.settings.defaults.custom.maxBedrooms;
  }

  get minBedrooms(): number {
    return this.settings.defaults.custom.minBedrooms;
  }

  get minBathrooms(): number {
    return this.settings.defaults.custom.minBathrooms;
  }

  get bathroomStep(): number {
    return this.settings.defaults.custom.bathroomStep;
  }

  // === BUSINESS RULES ===
  get quoteValidityDays(): number {
    return this.settings.business.quoteValidityDays;
  }

  // === THEME COLORS ===
  get primaryColor(): string {
    return this.settings.theme.colors.primary;
  }

  get primaryDarkColor(): string {
    return this.settings.theme.colors.primaryDark;
  }

  // === LEGAL TEXTS ===
  get quoteDisclaimer(): string {
    return this.settings.legal.quoteDisclaimer;
  }

  get quoteValidityText(): string {
    return this.settings.legal.quoteValidityText;
  }

  get quoteExpirationText(): string {
    return this.settings.legal.quoteExpirationText;
  }

  // === EMAIL CONFIGURATION ===
  get emailPdfFilename(): string {
    return this.settings.email.pdfFilename;
  }

  // === IMAGES ===
  get logoImage(): string {
    return this.settings.images.logo;
  }

  get thankYouImage(): string {
    return this.settings.images.thankYou;
  }

  get quoteLogoImage(): string {
    return this.settings.images.quoteLogo;
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
    return this.settings;
  }

  // === HOUSE MODELS ===
  getHouseModels() {
    return JSON.parse(JSON.stringify(this.settings.houseModels));
  }

  getHouseModelById(id: number) {
    const models = this.getHouseModels();
    return models.find((model: any) => model.id === id);
  }

  // === QUOTE CATEGORIES ===
  getBasicCategories() {
    return JSON.parse(JSON.stringify(this.settings.basicCategories));
  }

  getAdvancedCategories() {
    return JSON.parse(JSON.stringify(this.settings.advancedCategories));
  }

  getCustomCategories() {
    return JSON.parse(JSON.stringify(this.settings.customCategories));
  }

  getRemodelCategories() {
    return JSON.parse(JSON.stringify(this.settings.remodelCategories));
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
    return JSON.parse(JSON.stringify(this.settings.services));
  }

  getServicesSlugs(): string[] {
    return this.settings.services.filter(s => s.showInHeader).map(service => service.slug);
  }

  getServiceBySlug(slug: string): Service | undefined {
    const services = this.getServices();
    return services.find((service: Service) => service.slug === slug);
  }
}
