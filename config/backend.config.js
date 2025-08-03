/**
 * Configuración centralizada del backend
 * Modificar estos valores según sus necesidades
 */
module.exports = {
    // === CONFIGURACIÓN SMTP/EMAIL ===
    // Para desarrollo (Mailtrap)

    // Para producción (ejemplo con Gmail -  cambiar)
    // SMTP_HOST: 'smtp.gmail.com',
    // SMTP_PORT: 587,
    // SMTP_USER: 'your-email@gmail.com',
    // SMTP_PASS: 'your-app-password',

    // === CONFIGURACIÓN DE EMAIL ===
    EMAIL_SENDER: '"EPC Developments" <hello@demomailtrap.co>',
    // EMAIL_SENDER: '"EPC Developments" <noreply@epcbi.com>', // Para producción
    EMAIL_PDF_NAME: 'quote.pdf',

    // === CONFIGURACIÓN DEL SERVIDOR ===
    SERVER_PORT: process.env.PORT || 3001,

    // === ARCHIVOS ESTÁTICOS ===
    PUBLIC_IMAGES_PATH: '../public/images',

    // === CONFIGURACIÓN PDF/PUPPETEER ===
    PUPPETEER_HEADLESS_MODE: "new",
    PUPPETEER_WAIT_UNTIL: 'networkidle0',
    PDF_RENDER_URL: process.env.PDF_RENDER_URL || 'http://localhost:3001/quote-template-pdf.html',
    PDF_FORMAT: 'A4',
    PDF_PRINT_BACKGROUND: true,
    PDF_MARGIN: { 
        top: '20px', 
        bottom: '20px', 
        left: '20px', 
        right: '20px' 
    },

    // === INFORMACIÓN DE LA EMPRESA ===
    COMPANY: {
        name: 'EPC DEVELOPMENTS',
        tagline: 'CUSTOM BUILDER',
        email: 'EPCDEVELOPMENTS@GMAIL.COM',
        phone: '+832-931-0425',
        website: 'https://epcbi.com',
        websiteDisplay: 'EPCBI.COM'
    },

    // === TEXTOS LEGALES ===
    LEGAL: {
        quoteValidityDays: 30,
        disclaimer: 'THIS QUOTE IS AN ESTIMATE ONLY AND DOES NOT CONSTITUTE A CONTRACT. PRICES, MATERIALS, AND TIMELINES ARE SUBJECT TO CHANGE BASED ON FINAL SELECTIONS, SITE CONDITIONS, AND PERMITTING. FINAL TERMS WILL BE CONFIRMED IN A SIGNED CONSTRUCTION AGREEMENT.'
    }
};
