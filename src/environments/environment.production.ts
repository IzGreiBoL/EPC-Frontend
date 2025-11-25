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
      sendEmailWithPdf: '/mail-backend/send-email-with-pdf.php'
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
    recipient: 'info@epcde.com'
  },

  // === CONFIGURACIÓN DEL SERVIDOR ===
  server: {
    port: 3001,
    publicImagesPath: '../public/images'
  }
};
