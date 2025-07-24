const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const puppeteer = require('puppeteer');
const environment = require('../environment');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, environment.PUBLIC_IMAGES_PATH)));

app.get('/quote-template-pdf.html', (req, res) => {
    const { fillQuoteTemplate, buildQuoteReplacements } = require('./fillQuoteTemplate');
    const pdfTemplate = fs.readFileSync(path.join(__dirname, 'quote-template-pdf.html'), 'utf8');
    let quote = { ...req.query };
    // Si viene selections como string, deserialízalo
    if (typeof quote.selections === 'string') {
        try {
            quote.selections = JSON.parse(quote.selections);
        } catch {
            quote.selections = [];
        }
    }
    const replacements = buildQuoteReplacements(quote);
    const pdfHtml = fillQuoteTemplate(pdfTemplate, replacements);
    res.send(pdfHtml);
});

app.post('/send-email', async (req, res) => {
    console.log('POST /send-email recibido');
    const { to, subject, text, html, quote } = req.body;
    console.log('Datos recibidos:', { to, subject });

    // Configuración SMTP usando archivo environment
    var transport = nodemailer.createTransport({
        host: environment.SMTP_HOST,
        port: environment.SMTP_PORT,
        auth: {
            user: environment.SMTP_USER,
            pass: environment.SMTP_PASS
        }
    });


    try {
        const { fillQuoteTemplate, buildQuoteReplacements } = require('./fillQuoteTemplate');
        // Lee ambas plantillas
        const htmlTemplate = fs.readFileSync(path.join(__dirname, 'quote-template.html'), 'utf8');
        const pdfTemplate = fs.readFileSync(path.join(__dirname, 'quote-template-pdf.html'), 'utf8');
        const replacements = buildQuoteReplacements(quote || {});
        // Genera el HTML para el correo
        const htmlBody = fillQuoteTemplate(htmlTemplate, replacements);
        // Genera el HTML para el PDF
        const pdfHtml = fillQuoteTemplate(pdfTemplate, replacements);

        // Genera el PDF usando puppeteer accediendo por HTTP
        const browser = await puppeteer.launch({ headless: environment.PUPPETEER_HEADLESS_MODE });
        const page = await browser.newPage();
        // Serializa las selecciones para la URL
        const paramsObj = { ...quote, selections: JSON.stringify(quote.selections) };
        const params = new URLSearchParams(paramsObj).toString();
        await page.goto(`${environment.PDF_RENDER_URL}?${params}`, { waitUntil: environment.PUPPETEER_WAIT_UNTIL });
        const pdfBuffer = await page.pdf({
            format: environment.PDF_FORMAT,
            printBackground: environment.PDF_PRINT_BACKGROUND,
            margin: environment.PDF_MARGIN
        });
        await browser.close();

        // Enviar correo con HTML normal y PDF adjunto
        let info = await transport.sendMail({
            from: environment.EMAIL_SENDER,
            to,
            subject,
            text,
            html: htmlBody,
            attachments: [
                {
                    filename: environment.EMAIL_PDF_NAME,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
        res.json({ ok: true, messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(environment.SERVER_PORT, () => {
    console.log(`Mail backend running on port ${environment.SERVER_PORT}`);
});