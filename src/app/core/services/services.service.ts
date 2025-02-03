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
      image: 'images/house1.jpg',
      text: `
        <p>At EPC Developments, we specialize in designing and building custom homes tailored to your unique vision and lifestyle. With over 12 years of experience, our dedicated team of experts—led by a physicist and a master’s degree architect—delivers exceptional craftsmanship and innovative design. Our custom home services include:</p>
        <h3>Custom Home Design</h3>
        <p>We work closely with you to create a design that reflects your personal style and meets your functional needs. Our architect will guide you through the entire design process, from conceptual sketches to final blueprints, ensuring your dream home becomes a reality.</p>
        <h3>Site Analysis and Preparation</h3>
        <p>Every great home starts with a solid foundation. Our team conducts thorough site evaluations, assessing factors such as terrain, climate, and environmental considerations to ensure your home is perfectly situated for both comfort and efficiency.</p>
        <h3>Construction Management</h3>
        <p>Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.</p>
        <h3>Interior Design and Custom Finishes</h3>
        <p>With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.</p>
        <h3>Transparent Pricing and Budgeting</h3>
        <p>We believe in providing clear and upfront pricing. Our transparent budgeting process ensures you understand the costs involved from start to finish, with no surprises. We offer flexible pricing options to match your budget, without compromising on quality.</p>
        <h3>Post-Construction Support</h3>
        <p>Our commitment doesn’t end when construction is complete. We offer ongoing support, helping you with any questions or adjustments after you move into your new home. We want to ensure your satisfaction for years to come.</p>
      `,
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'general-contracting',
      title: 'General Contracting',
      image: 'images/house1.jpg',
      text: 'Every great home starts with a solid foundation. Our team conducts thorough site evaluations, assessing factors such as terrain, climate, and environmental considerations to ensure your home is perfectly situated for both comfort and efficiency.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'custom-floorplans-design',
      title: 'Custom Floorplans Design',
      image: 'images/house1.jpg',
      text: 'Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'investor-services-and-turnkey-projects',
      title: 'Investor Services & Turnkey Projects',
      image: 'images/house1.jpg',
      text: 'With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.',
      quoteButtonText: 'Free Quote'
    }
  ];

  getServices(): Service[] {
    return this.services;
  }

  getServicesSlugs(): string[] {
    return this.services.map(service => service.slug);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(service => service.slug === slug);
  }
}