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
      sendEmailWithPdf: '/mail-backend/send-email-with-pdf.php'
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

  // === CONFIGURACIÓN DEL SERVIDOR ===
  server: {
    port: 3001,
    publicImagesPath: '../public/images'
  }
};
