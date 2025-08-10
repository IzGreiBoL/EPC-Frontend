/**
 * Environment configuration for development
 * Solo configuración específica del entorno (URLs, SMTP, etc.)
 */
export const environment = {
  production: false,
  
  // === CONFIGURACIÓN API ===
  api: {
    baseUrl: 'http://localhost:4200',
    endpoints: {
      sendEmail: '/mail-backend/send-email-native.php',
      quotePdf: '/mail-backend/quote-template-pdf.html'
    }
  },

  // === CONFIGURACIÓN EMAIL/SMTP (DEVELOPMENT - MAILTRAP) ===
  email: {
    smtp: {
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      user: '',
      pass: '',
      secure: false,
      requireTLS: false
    },
    sender: '"EPC Developments" <hello@demomailtrap.co>',
    recipient: 'info@epcde.com'
  },

  // === CONFIGURACIÓN PDF ===
  pdf: {
    renderUrl: 'http://localhost:4200/quote-template-pdf.html',
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
    port: 3001,
    publicImagesPath: '../public/images'
  }
};
