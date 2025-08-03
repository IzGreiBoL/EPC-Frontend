/**
 * Environment configuration for development
 * Este archivo contiene configuraciones específicas del entorno de desarrollo
 */
export const environment = {
  production: false,
  
  // API Configuration
  api: {
    baseUrl: 'http://localhost:3001',
    endpoints: {
      sendEmail: '/send-email',
      quotePdf: '/quote-template-pdf.html'
    }
  },

  // Email/SMTP Configuration (development - Mailtrap)
  email: {
    smtp: {
    },
    sender: '"EPC Developments" <hello@demomailtrap.co>',
    pdfFilename: 'quote.pdf'
  },

  // PDF Generation
  pdf: {
    renderUrl: 'http://localhost:3001/quote-template-pdf.html',
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    puppeteer: {
      headless: 'new',
      waitUntil: 'networkidle0'
    }
  },

  // Server Configuration
  server: {
    port: 3001,
    publicImagesPath: '../public/images'
  }
};
