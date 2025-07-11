import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private services: Service[] = [
    {
      slug: 'custom-home-design',
      title: 'Custom Home Design',
      image: 'images/services/services-custom-home-design.jpg',
      text: `At EPC Developments, we specialize in designing and building custom homes tailored to your unique vision and lifestyle. With over 12 years of experience, our dedicated team of experts—led by a physicist and a master’s degree architect—delivers exceptional craftsmanship and innovative design.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: true
    },
    {
      slug: 'custom-home-design-site-analysis',
      title: 'Site Analysis and Preparation',
      image: 'images/services/services-site-preparation.jpg',
      text: `Every great home starts with a solid foundation. Our team conducts thorough site evaluations, assessing factors such as terrain, climate, and environmental considerations to ensure your home is perfectly situated for both comfort and efficiency.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-construction-management',
      title: 'Construction Management',
      image: 'images/services/services-construction-management.jpg',
      text: `Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-interior',
      title: 'Interior Design and Custom Finishes',
      image: 'images/services/services-interior-design.jpg',
      text: `With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-pricing',
      title: 'Transparent Pricing and Budgeting',
      image: 'images/services/services-transparent-pricing.jpg',
      text: `We believe in providing clear and upfront pricing. Our transparent budgeting process ensures you understand the costs involved from start to finish, with no surprises. We offer flexible pricing options to match your budget, without compromising on quality.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-support',
      title: 'Post-Construction Support',
      image: 'images/services/services-post-construction-support.jpg',
      text: `Our commitment doesn’t end when construction is complete. We offer ongoing support, helping you with any questions or adjustments after you move into your new home. We want to ensure your satisfaction for years to come.`,
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'general-contracting',
      title: 'General Contracting',
      image: 'images/services/services-general-contracting.jpg',
      text: 'EPC Development is a premier general contracting option specializing in custom home construction and luxury remodeling services across the USA. With a focus on precision, quality, and attention to detail, we manage every aspect of your project—from planning and design to execution and completion—ensuring a seamless and stress-free experience. Our team of skilled professionals combines innovative techniques, high-end materials, and expert craftsmanship to deliver exceptional results tailored to your vision. Whether building a custom home or transforming an existing space, we prioritize transparency, timely delivery, and superior workmanship to bring your dream project to life. Trust EPC Development to handle the complexities of construction while you enjoy the journey to your perfect home.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true
    },
    {
      slug: 'remodeling-and-additions-services',
      title: 'Remodeling and Additions Services',
      image: 'images/services/services-remodeling.jpg',
      text: 'At EPC Developments, we specialize in custom home remodeling and addition services that transform your existing space into something new and exciting. Whether you\'re looking to renovate a single room, add extra living space, or complete a home makeover, our expert team combines innovative design with quality craftsmanship to enhance functionality and aesthetics. We work closely with you to ensure that every detail aligns with your vision, all while maintaining transparency in pricing and delivering results on time and within budget. Let us help you reimagine your home with our tailored remodeling and addition solutions.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true
    },
    {
      slug: 'custom-floorplans-design',
      title: 'Custom Floorplans Design',
      image: 'images/services/services-custom-floor-plan.jpg',
      text: 'Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true
    },
    {
      slug: 'investor-services-and-turnkey-projects',
      title: 'Investor Services & Turnkey Projects',
      image: 'images/services/services-investor.png',
      text: 'With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true
    }
  ];

  getServices(): Service[] {
    return this.services;
  }

  getServicesSlugs(): string[] {
    // Solo los servicios que deben aparecer en el header
    return this.services.filter(s => s.showInHeader).map(service => service.slug);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(service => service.slug === slug);
  }
}