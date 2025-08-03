module.exports = {
    // SMTP configuration

    // Email sending configuration
    EMAIL_SENDER: '"EPC Developments" <hello@demomailtrap.co>',
    EMAIL_PDF_NAME: 'quote.pdf',

    // Server configuration
    SERVER_PORT: 3001,

    // Static files
    PUBLIC_IMAGES_PATH: '../public/images',

    // Puppeteer/PDF generation
    PUPPETEER_HEADLESS_MODE: "new", // or true/false as needed
    PUPPETEER_WAIT_UNTIL: 'networkidle0',
    PDF_RENDER_URL: 'http://localhost:3001/quote-template-pdf.html',
    PDF_FORMAT: 'A4',
    PDF_PRINT_BACKGROUND: true,
    PDF_MARGIN: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
};
