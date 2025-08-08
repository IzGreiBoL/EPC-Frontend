/**
 * Environment configuration for production
 * Solo configuración específica del entorno (URLs, SMTP, etc.)
 */
export const environment = {
  production: true,
  
  // === CONFIGURACIÓN API ===
  api: {
    baseUrl: 'https://epcde.com',
    endpoints: {
      sendEmail: '/mail-backend/send-email-native.php',
      quotePdf: '/mail-backend/quote-template-pdf.html'
    }
  },

  // === CONFIGURACIÓN EMAIL/SMTP (PRODUCTION - IONOS) ===
  email: {
    smtp: {
      host: 'smtp.ionos.com',
      port: 587,
      secure: false,
      requireTLS: true,
      user: '',
      pass: '' // Será configurado en el servidor
    },
    sender: '"EPC Developments" <info@epcde.com>',
    recipient: 'quotes@epcde.com'
  },

  // === CONFIGURACIÓN PDF ===
  pdf: {
    renderUrl: 'https://epcde.com/quote-template-pdf.html',
    format: 'A4',
    printBackground: true,
    margin: { 
      top: '20px', 
      bottom: '20px', 
      left: '20px', 
      right: '20px' 
    },
    puppeteer: {
      headless: 'new',
      waitUntil: 'networkidle0'
    }
  },

  // === CONFIGURACIÓN DEL SERVIDOR ===
  server: {
    port: process.env['PORT'] || 3001,
    publicImagesPath: '../public/images'
  }
};
