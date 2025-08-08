<?php
/**
 * ===================================================================
 * CONFIGURACIÓN CENTRALIZADA - EPC DEVELOPMENTS
 * ===================================================================
 * Este archivo contiene TODA la configuración del backend PHP
 * Modificar solo aquí para cambios globales
 */

// === DETECTAR ENTORNO ===
$isProduction = (
    (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'epcde.com') !== false) ||
    (isset($_SERVER['SERVER_NAME']) && strpos($_SERVER['SERVER_NAME'], 'epcde.com') !== false)
);

// === CONFIGURACIÓN DE LA EMPRESA ===
define('COMPANY_NAME', 'EPC DEVELOPMENTS');
define('COMPANY_TAGLINE', 'CUSTOM BUILDER');
define('COMPANY_FULL_NAME', 'EPC Developments');
define('COMPANY_EMAIL', 'quotes@epcde.com');
define('COMPANY_EMAIL_SENDER', 'info@epcde.com');
define('COMPANY_PHONE', '+832-931-0425');
define('COMPANY_LOCATION', 'San Antonio, Texas');
define('COMPANY_WEBSITE', 'https://epcde.com');
define('COMPANY_WEBSITE_DISPLAY', 'EPCDE.COM');
define('WEBSITE_DISPLAY', COMPANY_WEBSITE_DISPLAY);

// === CONFIGURACIÓN SMTP (DINÁMICO SEGÚN ENTORNO) ===
if ($isProduction) {
    // PRODUCCIÓN - IONOS
    define('SMTP_HOST', 'smtp.ionos.com');
    define('SMTP_PORT', 587);
    define('SMTP_USER', 'info@epcde.com');
    define('SMTP_PASS', ''); // Configurar en servidor
    define('SMTP_SECURE', false);
    define('SMTP_REQUIRE_TLS', true);
    define('BASE_URL', 'https://epcde.com');
} else {
    // DESARROLLO - MAILTRAP
    define('SMTP_HOST', 'sandbox.smtp.mailtrap.io');
    define('SMTP_PORT', 2525);
    define('SMTP_USER', '');
    define('SMTP_PASS', '');
    define('SMTP_SECURE', false);
    define('SMTP_REQUIRE_TLS', false);
    define('BASE_URL', 'http://localhost:4200');
}

// === CONFIGURACIÓN DE EMAIL ===
define('EMAIL_FROM', '"' . COMPANY_FULL_NAME . '" <' . COMPANY_EMAIL_SENDER . '>');
define('EMAIL_TO', COMPANY_EMAIL);
define('COMPANY_EMAIL_FULL', EMAIL_FROM);
define('EMAIL_PDF_FILENAME', 'EPC_Quote.pdf');
define('EMAIL_FOOTER_TEXT', 'Este email fue generado automáticamente desde epcde.com');
define('EMAIL_SIGNATURE', COMPANY_FULL_NAME . ' - Custom builder');

// === CONFIGURACIÓN BUSINESS ===
define('QUOTE_VALIDITY_DAYS', 30);

// === RUTAS DE IMÁGENES (ABSOLUTAS) ===
define('IMAGE_LOGO', BASE_URL . '/images/mail-images/epc-logo.png');
define('IMAGE_QUOTE', BASE_URL . '/images/mail-images/quote.png');
define('IMAGE_THANK_YOU', BASE_URL . '/images/mail-images/thank-you.png');

// === PLACEHOLDERS PARA TEMPLATES (GLOBAL) ===
$TEMPLATE_PLACEHOLDERS = [
    '{{COMPANY_NAME}}' => COMPANY_NAME,
    '{{COMPANY_TAGLINE}}' => COMPANY_TAGLINE,
    '{{COMPANY_FULL_NAME}}' => COMPANY_FULL_NAME,
    '{{COMPANY_EMAIL}}' => COMPANY_EMAIL,
    '{{COMPANY_PHONE}}' => COMPANY_PHONE,
    '{{COMPANY_LOCATION}}' => COMPANY_LOCATION,
    '{{COMPANY_WEBSITE}}' => COMPANY_WEBSITE,
    '{{COMPANY_WEBSITE_DISPLAY}}' => COMPANY_WEBSITE_DISPLAY,
    '{{BASE_URL}}' => BASE_URL,
    '{{IMAGE_LOGO}}' => IMAGE_LOGO,
    '{{IMAGE_QUOTE}}' => IMAGE_QUOTE,
    '{{IMAGE_THANK_YOU}}' => IMAGE_THANK_YOU,
    '{{EMAIL_FOOTER_TEXT}}' => EMAIL_FOOTER_TEXT,
    '{{EMAIL_SIGNATURE}}' => EMAIL_SIGNATURE,
    '{{QUOTE_VALIDITY_DAYS}}' => QUOTE_VALIDITY_DAYS
];

/**
 * Función para reemplazar todos los placeholders en un template
 * @param string $template El contenido del template
 * @param array $additionalData Datos adicionales para reemplazar
 * @return string Template con placeholders reemplazados
 */
function replacePlaceholders($template, $additionalData = []) {
    global $TEMPLATE_PLACEHOLDERS;
    
    $allPlaceholders = array_merge($TEMPLATE_PLACEHOLDERS, $additionalData);
    
    foreach ($allPlaceholders as $placeholder => $value) {
        $template = str_replace($placeholder, $value, $template);
    }
    
    return $template;
}

/**
 * Función para obtener la configuración completa como array
 * @return array Toda la configuración
 */
function getConfig() {
    return [
        'company' => [
            'name' => COMPANY_NAME,
            'tagline' => COMPANY_TAGLINE,
            'fullName' => COMPANY_FULL_NAME,
            'email' => COMPANY_EMAIL,
            'emailSender' => COMPANY_EMAIL_SENDER,
            'phone' => COMPANY_PHONE,
            'location' => COMPANY_LOCATION,
            'website' => COMPANY_WEBSITE,
            'websiteDisplay' => COMPANY_WEBSITE_DISPLAY
        ],
        'smtp' => [
            'host' => SMTP_HOST,
            'port' => SMTP_PORT,
            'user' => SMTP_USER,
            'pass' => SMTP_PASS,
            'secure' => SMTP_SECURE,
            'requireTLS' => SMTP_REQUIRE_TLS
        ],
        'email' => [
            'from' => EMAIL_FROM,
            'to' => EMAIL_TO,
            'pdfFilename' => EMAIL_PDF_FILENAME,
            'footerText' => EMAIL_FOOTER_TEXT,
            'signature' => EMAIL_SIGNATURE
        ],
        'business' => [
            'quoteValidityDays' => QUOTE_VALIDITY_DAYS
        ],
        'images' => [
            'logo' => IMAGE_LOGO,
            'quote' => IMAGE_QUOTE,
            'thankYou' => IMAGE_THANK_YOU
        ],
        'urls' => [
            'base' => BASE_URL
        ]
    ];
}

/**
 * Debug: Mostrar configuración actual (solo en desarrollo)
 */
function debugConfig() {
    global $isProduction;
    if (!$isProduction && isset($_GET['debug_config'])) {
        header('Content-Type: application/json');
        echo json_encode(getConfig(), JSON_PRETTY_PRINT);
        exit;
    }
}

// Llamar debug si se solicita
debugConfig();

/**
 * Función para generar URLs absolutas de imágenes
 */
function getAbsoluteImageUrl($imagePath) {
    if (strpos($imagePath, 'http') === 0) {
        return $imagePath; // Ya es absoluta
    }
    
    $cleanPath = ltrim($imagePath, '/');
    return BASE_URL . '/' . $cleanPath;
}
?>