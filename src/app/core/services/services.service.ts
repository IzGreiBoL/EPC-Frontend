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
      text: 'We work closely with you to create a design that reflects your personal style and meets your functional needs. Our architect will guide you through the entire design process, from conceptual sketches to final blueprints, ensuring your dream home becomes a reality.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'site-analysis',
      title: 'Site Analysis and Preparation',
      image: 'images/house1.jpg',
      text: 'Every great home starts with a solid foundation. Our team conducts thorough site evaluations, assessing factors such as terrain, climate, and environmental considerations to ensure your home is perfectly situated for both comfort and efficiency.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'construction-management',
      title: 'Construction Management',
      image: 'images/house1.jpg',
      text: 'Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'interior-design',
      title: 'Interior Design and Custom Finishes',
      image: 'images/house1.jpg',
      text: 'With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'transparent-pricing-and-budgeting',
      title: 'Transparent Pricing and Budgeting',
      image: 'images/house1.jpg',
      text: 'We believe in providing clear and upfront pricing. Our transparent budgeting process ensures you understand the costs involved from start to finish, with no surprises. We offer flexible pricing options to match your budget, without compromising on quality.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'remodeling-and-additions-services',
      title: 'Remodeling and Additions Services',
      image: 'images/house1.jpg',
      text: 'At EPC Developments, we specialize in custom home remodeling and addition services that transform your existing space into something new and exciting. Whether you\'re looking to renovate a single room, add extra living space, or complete a home makeover, our expert team combines innovative design with quality craftsmanship to enhance functionality and aesthetics. We work closely with you to ensure that every detail aligns with your vision, all while maintaining transparency in pricing and delivering results on time and within budget. Let us help you reimagine your home with our tailored remodeling and addition solutions.',
      quoteButtonText: 'Free Quote'
    },
    {
      slug: 'post-construction-support',
      title: 'Post-Construction Support',
      image: 'images/house1.jpg',
      text: 'Our commitment doesn’t end when construction is complete. We offer ongoing support, helping you with any questions or adjustments after you move into your new home. We want to ensure your satisfaction for years to come.',
      quoteButtonText: 'Free Quote'
    }
  ];

  getServices(): Service[] {
    return this.services;
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(service => service.slug === slug);
  }
}