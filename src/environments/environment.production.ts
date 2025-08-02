/**
 * Environment configuration for production
 * Este archivo contiene configuraciones para el entorno de producción
 */
export const environment = {
  production: true,
  
  // API Configuration
  api: {
    baseUrl: 'https://your-production-domain.com',
    endpoints: {
      sendEmail: '/send-email',
      quotePdf: '/quote-template-pdf.html'
    }
  },

  // Email/SMTP Configuration (production - ejemplo)
  email: {
    smtp: {
      host: 'smtp.gmail.com',     
      port: 587,
      user: 'your-email@gmail.com',  
      pass: 'your-app-password'      
    },
    sender: '"EPC Developments" <noreply@epcbi.com>',
    pdfFilename: 'quote.pdf'
  },

  // PDF Generation
  pdf: {
    renderUrl: 'https://your-production-domain.com/quote-template-pdf.html',
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
    port: process.env['PORT'] || 3001,
    publicImagesPath: '../public/images'
  }
};
