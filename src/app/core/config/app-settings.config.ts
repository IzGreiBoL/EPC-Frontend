/**
 * Configuración centralizada de la aplicación
 * Solo configuraciones de negocio, pricing, modelos, etc. (NO configuraciones de entorno)
 */
export const APP_SETTINGS = {
  // === INFORMACIÓN DE CONTACTO ===
  company: {
    name: 'EPC DEVELOPMENTS',
    tagline: 'CUSTOM BUILDER',
    fullName: 'EPC Developments',
    phone: {
      display: '+832-931-0425',      // Teléfono mostrado en la página principal
      business: '+832-931-0425'    // Teléfono de contacto comercial (templates)
    },
    email: 'info@epcde.com',
    website: {
      display: 'EPCDE.COM',
      url: 'https://epcde.com'
    },
    location: 'San Antonio, Texas',
    serviceArea: 'San Antonio to Austin area',
    // About us content for home page
    aboutUs: {
      welcome: 'Welcome to EPC Developments, a premier custom home construction company founded 12 years ago with a vision to bring your dream home to life. Combining expertise in construction, innovative design, and personalized service, we specialize in creating custom-built homes that reflect your unique style and needs.',
      commitment: 'At EPC Developments, we understand that your home is more than just a building—it\'s the foundation of your life and memories. That\'s why we work closely with each client to bring your vision to life while keeping costs manageable and clear from start to finish.',
      closing: 'Thank you for considering EPC Developments for your custom home construction needs. We look forward to building your dream home together!'
    },
    // Social media links
    socialMedia: {
      instagram: {
        url: 'https://www.instagram.com/epcdevelopments/',
        show: true  // Mostrar/ocultar enlace
      },
      linkedin: {
        url: 'https://www.linkedin.com/company/epcdevelopments/',
        show: false  // Mostrar/ocultar enlace
      }
    }
  },

  // === CONFIGURACIÓN BUSINESS ===
  business: {
    quoteValidityDays: 30,
    minimumRoomsBySize: {
      1300: { bedrooms: 3, bathrooms: 2.5 },
      1500: { bedrooms: 4, bathrooms: 3 },
      2200: { bedrooms: 5, bathrooms: 4 }
    }
  },

  // === CONFIGURACIÓN EMAIL (CONTENIDO) ===
  email: {
    pdfFilename: 'EPC_Quote.pdf',
    footerText: 'Este email fue generado automáticamente desde epcde.com',
    signature: 'EPC Developments - Custom builder'
  },

  // === RUTAS DE IMÁGENES ===
  images: {
    logo: '/images/mail-images/epc-logo.png',
    quote: '/images/mail-images/quote.png',
    quoteLogo: '/images/mail-images/quote.png', // Alias para compatibilidad
    thankYou: '/images/mail-images/thank-you.png'
  },

  // === PRECIOS BASE ===
  pricing: {
    basePerSqft: {
      basic: 190,
      advanced: 101.42,
      remodel: 0,
      custom: 190
    },
    customPricing: {
      bedroomPricePerExtra: 7500,    // (bedrooms - 3) * 7500
      bathroomPricePerExtra: 6000,   // (bathrooms - 2.5) * 6000
      defaultBedrooms: 3,
      defaultBathrooms: 2.5
    },
    garage: {
      oneCar: 20,
      twoCar: 37,
      threeCar: 55
    }
  },

  // === LÍMITES Y VALORES POR DEFECTO ===
  defaults: {
    custom: {
      sqft: 1300,
      minSqft: 1300,
      bedrooms: 3,
      minBedrooms: 1,
      maxBedrooms: 6,
      bathrooms: 2.5,
      minBathrooms: 2.5,
      bathroomStep: 0.5
    },
    remodel: {
      sqft: 300,
      minSqft: 300
    }
  },

  // === CONFIGURACIÓN VISUAL ===
  theme: {
    colors: {
      primary: '#C49538',      // $gold
      primaryDark: '#B7832C',  // $gold-dark
      dark1: '#1C1C1F',        // $dark-1
      dark2: '#161619',        // $dark-2
      dark3: '#333335',        // $dark-3
      textLight: '#ECECEC',    // $text-light
      textSecondary: '#B0B0B0',
      accent: '#6FA3FF'
    },
    cards: {
      backgroundColor: '#242428'
    }
  },

  // === TEXTOS LEGALES ===
  legal: {
    quoteDisclaimer: 'THIS QUOTE IS AN ESTIMATE ONLY AND DOES NOT CONSTITUTE A CONTRACT. PRICES, MATERIALS, AND TIMELINES ARE SUBJECT TO CHANGE BASED ON FINAL SELECTIONS, SITE CONDITIONS, AND PERMITTING. FINAL TERMS WILL BE CONFIRMED IN A SIGNED CONSTRUCTION AGREEMENT.',
    quoteValidityText: 'THIS QUOTE IS VALID FOR 30 DAYS FROM THE DATE OF ISSUE.',
    quoteExpirationText: 'This quote will expire 30 DAYS AFTER THE DAY IT WAS MADE'
  },

  // === CONFIGURACIÓN DE MODELOS DE CASAS ===
  houseModels: [
    { id: 1, name: 'Avalon', size: 1620, bedrooms: 4, bathrooms: 2, folder: 'avalon', imagesCount: 5 },
    { id: 2, name: 'Cascade', size: 1470, bedrooms: 3, bathrooms: 2.5, folder: 'cascade', imagesCount: 6 },
    { id: 3, name: 'Estates', size: 1443, bedrooms: 3, bathrooms: 2, folder: 'estates', imagesCount: 5 },
    { id: 4, name: 'Jewel', size: 1470, bedrooms: 3, bathrooms: 2, folder: 'jewel', imagesCount: 5 },
    { id: 5, name: 'Pandora', size: 1400, bedrooms: 3, bathrooms: 2, folder: 'pandora', imagesCount: 5 },
    { id: 999, name: 'Custom Build', size: 1300, bedrooms: 3, bathrooms: 2.5, folder: 'custom', imagesCount: 1 }
  ],

  // === CONFIGURACIÓN DE CATEGORÍAS BÁSICAS ===
  basicCategories: [
    {
      id: 1,
      name: 'Kitchen Cabinets',
      basePrice: 0,
      icon: 'vault',
      options: [
        { name: 'Shaker', price: 0 },
        { name: 'Rustic', price: 5 },
        { name: 'Traditional Raised-Panel', price: 8 },
        { name: 'Modern Flat-Panel', price: 20 }
      ]
    },
    {
      id: 2,
      name: 'Exterior Design',
      basePrice: 0,
      icon: 'home',
      options: [
        { name: 'Modern', price: 0 },
        { name: 'Traditional', price: 0 },
        { name: 'Craftsman', price: 8 },
        { name: 'Contemporary', price: 15 }
      ]
    },
    {
      id: 3,
      name: 'Interior Finish Level',
      basePrice: 0,
      icon: 'paintbrush',
      options: [
        { name: 'Standard', price: 0 },
        { name: 'Premium', price: 15 },
        { name: 'Luxury', price: 30 },
        { name: 'Custom', price: '+c' }
      ]
    },
    {
      id: 4,
      name: 'Number of Bedrooms',
      basePrice: 0,
      icon: 'door-open',
      options: [
        { name: '2', price: 0 },
        { name: '3', price: 0 },
        { name: '4', price: 14 },
        { name: '5+', price: 28 }
      ]
    },
    {
      id: 5,
      name: 'Number of Bathrooms',
      basePrice: 0,
      icon: 'shower-head',
      options: [
        { name: '1', price: 0 },
        { name: '2', price: 0 },
        { name: '2.5', price: 8 },
        { name: '3+', price: 15 }
      ]
    }
  ],

  // === CONFIGURACIÓN DE CATEGORÍAS AVANZADAS ===
  advancedCategories: [
    {
      id: 1,
      name: 'Exterior Design',
      icon: 'home',
      options: [
        {
          name: 'Siding Materials',
          basePrice: 3.79,
          options: [
            { name: 'Fiber cement', price: 0 },
            { name: 'Wood', price: 2.50 },
            { name: 'Stone', price: 5.05 },
            { name: 'Brick', price: 5.05 },
            { name: 'Stucco', price: 5.05 }
          ]
        },
        {
          name: 'Roofing Styles',
          basePrice: 2.91,
          options: [
            { name: 'Shingle', price: 0 },
            { name: 'Metal', price: 4.34 },
            { name: 'Tile', price: 10.25 },
            { name: 'Clay', price: 30.84 }
          ]
        },
        {
          name: 'Driveway',
          basePrice: 13.34,
          options: [
            { name: 'As Is', price: 0 },
            { name: 'Custom', price: '+c' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Front Door Material',
      icon: 'door-open',
      options: [
        {
          name: 'Material',
          basePrice: 1.22,
          options: [
            { name: 'Fiberglass', price: 0 },
            { name: 'Steel', price: 0.10 },
            { name: 'Wood', price: 0.64 },
            { name: 'Custom Design', price: '+c' }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Window Design & Colors',
      icon: 'blinds',
      options: [
        {
          name: 'Window Colors',
          basePrice: 2.48,
          options: [
            { name: 'White', price: 0 },
            { name: 'Black', price: 1.18 },
            { name: 'Natural Wood', price: 20.09 },
            { name: 'Custom', price: '+c' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Bathroom Fixtures',
      icon: 'shower-head',
      options: [
        {
          name: 'Fixture Colors',
          basePrice: 3.37,
          options: [
            { name: 'Black', price: 0 },
            { name: 'Brushed Nickel', price: 0 },
            { name: 'Chrome', price: 0 },
            { name: 'Gold', price: 0 },
            { name: 'Matte Black', price: 0.55 },
            { name: 'Bronze', price: 1.8 }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Lighting Fixtures',
      icon: 'lightbulb',
      options: [
        {
          name: 'Lighting Colors',
          basePrice: 1.86,
          options: [
            { name: 'Black', price: 0 },
            { name: 'White', price: 0 },
            { name: 'Brass', price: 0.62 },
            { name: 'Silver', price: 0.93 },
            { name: 'Wood', price: 0.93 },
            { name: 'Custom', price: '+c' }
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'Flooring & Backsplashes',
      icon: 'grid',
      options: [
        {
          name: 'Flooring Materials',
          basePrice: 1.87,
          options: [
            { name: 'Carpet', price: 0 },
            { name: 'Concrete', price: 0 },
            { name: 'Tile', price: 0 },
            { name: 'Luxury Vinyl', price: 0.27 },
            { name: 'Hardwood', price: 2.17 }
          ]
        },
        {
          name: 'Backsplash',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 0.33 }
          ]
        }
      ]
    },
    {
      id: 7,
      name: 'Cabinetry',
      icon: 'vault',
      options: [
        {
          name: 'Cabinet Styles',
          basePrice: 6.83,
          options: [
            { name: 'Shaker', price: 0 },
            { name: 'Modern', price: 0 },
            { name: 'Traditional', price: 0 },
            { name: 'Full Overlay', price: 0.70 }
          ]
        },
        {
          name: 'Cabinet Colors',
          basePrice: 0,
          options: [
            { name: 'Painted', price: 0 },
            { name: 'Stain', price: 1 }
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Countertops',
      icon: 'table',
      options: [
        {
          name: 'Materials',
          basePrice: 46.95,
          options: [
            { name: 'Granite', price: 0 },
            { name: 'Concrete', price: 0 },
            { name: 'Butcher Block', price: 0 },
            { name: 'Quartz', price: 11.75 },
            { name: 'Marble', price: 40.85 }
          ]
        }
      ]
    },
    {
      id: 9,
      name: 'Paint & Accent Walls',
      icon: 'paintbrush',
      options: [
        {
          name: 'Paint Colors',
          basePrice: 3.96,
          options: [
            { name: 'Neutral', price: 0 },
            { name: 'Custom', price: 2.90 }
          ]
        },
        {
          name: 'Accent Wall',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: '+c' }
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'Appliance Selection & Upgrades',
      icon: 'microwave',
      options: [
        {
          name: 'Appliances',
          basePrice: 0,
          options: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 4.73 },
            { name: 'Custom Design', price: 7.08 }
          ]
        }
      ]
    }
  ],

  // === CONFIGURACIÓN DE CATEGORÍA PERSONALIZADA ===
  customCategories: [
    {
      id: 999,
      name: 'Custom parameters',
      icon: 'home',
      basePrice: 0,
      fields: [
        { key: 'sqft', label: 'Square footage (min: 1300)', type: 'number', min: 1300 },
        { key: 'bedrooms', label: 'Bedrooms', type: 'number', min: 1, max: 6 },
        { key: 'bathrooms', label: 'Bathrooms', type: 'number', step: 0.5, min: 2.5 }
      ],
      options: [
        {
          name: 'Garage Space',
          basePrice: 0,
          options: [
            { name: 'No garage space', price: 0 },
            { name: '1 car garage space', price: 20 },
            { name: '2 car garage space', price: 37 },
            { name: '3 car garage space', price: 55 }
          ]
        }
      ]
    }
  ],

  // === CONFIGURACIÓN DE CATEGORÍA DE REMODELACIÓN ===
  remodelCategories: [
    {
      id: 1001,
      name: 'Remodel Configuration',
      icon: 'home',
      basePrice: 0,
      fields: [
        { key: 'sqft', label: 'Sq ft', type: 'number', min: 300 }
      ],
      options: [
        {
          name: 'Remodel Selections',
          basePrice: 0,
          options: [
            { name: 'Foundation', price: 38 },
            { name: 'Framing and crafts', price: 38 },
            { name: 'Sheet rock', price: 38 },
            { name: 'Bathrooms', price: 38 },
            { name: 'Finishes', price: 38 }
          ]
        }
      ]
    }
  ],

  // === CONFIGURACIÓN DE SERVICIOS ===
  services: [
    {
      slug: 'custom-home-design',
      title: 'Custom Home Design',
      image: 'images/services/services-custom-home-design.jpg',
      text: 'At EPC Developments, we specialize in designing and building custom homes tailored to your unique vision and lifestyle. With over 12 years of experience, our dedicated team of experts—led by a physicist and a master\'s degree architect—delivers exceptional craftsmanship and innovative design.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: true
    },
    {
      slug: 'custom-home-design-site-analysis',
      title: 'Site Analysis and Preparation',
      image: 'images/services/services-site-preparation.jpg',
      text: 'Every great home starts with a solid foundation. Our team conducts thorough site evaluations, assessing factors such as terrain, climate, and environmental considerations to ensure your home is perfectly situated for both comfort and efficiency.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-construction-management',
      title: 'Construction Management',
      image: 'images/services/services-construction-management.jpg',
      text: 'Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-interior',
      title: 'Interior Design and Custom Finishes',
      image: 'images/services/services-interior-design.jpg',
      text: 'With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-pricing',
      title: 'Transparent Pricing and Budgeting',
      image: 'images/services/services-transparent-pricing.jpg',
      text: 'We believe in providing clear and upfront pricing. Our transparent budgeting process ensures you understand the costs involved from start to finish, with no surprises. We offer flexible pricing options to match your budget, without compromising on quality.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'custom-home-design-support',
      title: 'Post-Construction Support',
      image: 'images/services/services-post-construction-support.jpg',
      text: 'Our commitment doesn\'t end when construction is complete. We offer ongoing support, helping you with any questions or adjustments after you move into your new home. We want to ensure your satisfaction for years to come.',
      quoteButtonText: 'Free Quote',
      category: 'custom-home-design',
      showInHeader: false
    },
    {
      slug: 'general-contracting',
      title: 'General Contracting',
      image: 'images/services/services-general-contracting.jpg',
      text: 'EPC Development is a premier general contracting option specializing in custom home construction and luxury remodeling services across the USA. With a focus on precision, quality, and attention to detail, we manage every aspect of your project—from planning and design to execution and completion—ensuring a seamless and stress-free experience.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true,
      redirectUrl: '/#contact'
    },
    {
      slug: 'remodeling-and-additions-services',
      title: 'Remodeling and Additions Services',
      image: 'images/services/services-remodeling.jpg',
      text: 'At EPC Developments, we specialize in custom home remodeling and addition services that transform your existing space into something new and exciting. Whether you\'re looking to renovate a single room, add extra living space, or complete a home makeover, our expert team combines innovative design with quality craftsmanship.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true,
      redirectUrl: '/quotes/remodel'
    },
    {
      slug: 'custom-floorplans-design',
      title: 'Custom Floorplans Design',
      image: 'images/services/services-custom-floor-plan.jpg',
      text: 'Our team oversees every aspect of construction, from securing permits to coordinating contractors, ensuring timely completion and adherence to the highest quality standards. We keep you informed throughout the process and make sure every detail is executed as planned.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true,
      redirectUrl: '/quotes/custom'
    },
    {
      slug: 'investor-services-and-turnkey-projects',
      title: 'Investor Services & Turnkey Projects',
      image: 'images/services/services-investor.png',
      text: 'With an eye for detail, we offer custom interior design services to make your home feel uniquely yours. From cabinetry and flooring to lighting and color schemes, we work with you to select the perfect finishes that align with your vision.',
      quoteButtonText: 'Free Quote',
      category: 'other-services',
      showInHeader: true,
      redirectUrl: '/#contact'
    }
  ]
};

// Tipos TypeScript para mejor intellisense pero sin readonly
export type AppSettings = typeof APP_SETTINGS;
export type CompanyInfo = typeof APP_SETTINGS.company;
export type PricingConfig = typeof APP_SETTINGS.pricing;
export type DefaultValues = typeof APP_SETTINGS.defaults;

// Helper para crear copias mutables de las configuraciones
export const getMutableConfig = () => JSON.parse(JSON.stringify(APP_SETTINGS)) as AppSettings;
