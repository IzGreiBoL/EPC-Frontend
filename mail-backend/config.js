// Configuración para el backend de correos
// Actualizar estos valores según sus necesidades

const BACKEND_CONFIG = {
  company: {
    name: 'EPC DEVELOPMENTS',
    tagline: 'CUSTOM BUILDER',
    email: 'EPCDEVELOPMENTS@GMAIL.COM',
    website: 'www.epcbi.com'
  },
  
  // Configuración de email
  email: {
    // Para desarrollo - usar Mailtrap
    development: {
      sender: '"EPC Developments" <hello@demomailtrap.co>',
      recipientEmail: 'hello@demomailtrap.co'
    },

    // Cambiar estos valores
    production: {
      sender: '"EPC Developments" <noreply@epcbi.com>',
      recipientEmail: 'EPCDEVELOPMENTS@GMAIL.COM'
    }
  }
};

module.exports = BACKEND_CONFIG;
