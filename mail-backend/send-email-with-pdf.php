<?php
/**
 * Endpoint para recibir PDF generado en Angular y enviarlo por email
 * Compatible con hosting compartido IONOS
 */

ini_set('display_errors', 1);
ini_set('error_reporting', E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

error_log("=== PDF EMAIL SYSTEM START ===");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    require_once 'config.php';
    error_log("config.php loaded successfully");
} catch (Exception $e) {
    error_log("Error loading config.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration error']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $error = 'Invalid JSON: ' . json_last_error_msg();
        error_log("JSON Error: " . $error);
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $error]);
        exit;
    }

    error_log("Request received for customer: " . $data['customerEmail']);
    
    // Validar datos requeridos
    if (empty($data['customerEmail']) || empty($data['customerName'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
        exit;
    }

    // Crear directorio temp si no existe
    $tempDir = __DIR__ . '/temp/';
    if (!file_exists($tempDir)) {
        if (mkdir($tempDir, 0755, true)) {
            error_log("Temp directory created: " . $tempDir);
        } else {
            error_log("Failed to create temp directory: " . $tempDir);
        }
    } else {
        error_log("Temp directory exists: " . $tempDir);
    }

    // Usar el número de quote generado en Angular, o generar uno como fallback
    $quoteNumber = isset($data['quoteNumber']) && !empty($data['quoteNumber']) 
        ? $data['quoteNumber'] 
        : 'Q' . date('Ymd') . '-' . generateEmailHash($data['customerEmail']);

    // Preparar mensaje para la empresa (texto plano)
    $companyMessage = "Nueva solicitud de cotización:\n\n";
    $companyMessage .= "Número de cotización: " . $quoteNumber . "\n";
    $companyMessage .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    $companyMessage .= "=== DATOS DEL CLIENTE ===\n";
    $companyMessage .= "Nombre: " . $data['customerName'] . "\n";
    $companyMessage .= "Email: " . $data['customerEmail'] . "\n";
    $companyMessage .= "Teléfono: " . ($data['customerPhone'] ?? 'No proporcionado') . "\n";
    $companyMessage .= "Mensaje: " . ($data['customerMessage'] ?? 'Sin mensaje') . "\n\n";
    $companyMessage .= "=== DETALLES DEL PROYECTO ===\n";
    $companyMessage .= "Modelo: " . ($data['modelOfHouse'] ?? 'No especificado') . "\n";
    $companyMessage .= "Precio total: $" . number_format($data['total'] ?? 0) . "\n";
    $companyMessage .= "Metros cuadrados: " . ($data['sqftTotal'] ?? 0) . " sq ft\n";
    $companyMessage .= "Precio por sq ft: $" . number_format($data['pricePerSqft'] ?? 0) . "\n\n";
    
    // Añadir selecciones si existen
    if (isset($data['selections']) && !empty($data['selections'])) {
        $companyMessage .= "=== SELECCIONES ===\n";
        $companyMessage .= $data['selections'] . "\n\n";
    }
    
    $companyMessage .= "Email generado automáticamente desde " . WEBSITE_DISPLAY . "\n";
    // ===== PROCESAR PDF =====
    $pdfPath = null;
    if (isset($data['pdfBase64']) && !empty($data['pdfBase64'])) {
        error_log("PDF Base64 received - length: " . strlen($data['pdfBase64']));
        $pdfContent = base64_decode($data['pdfBase64']);
        
        if ($pdfContent !== false && strlen($pdfContent) > 0) {
            $pdfFileName = 'quote_' . $quoteNumber . '_' . date('Y-m-d_H-i-s') . '.pdf';
            $pdfPath = $tempDir . $pdfFileName;
            
            if (file_put_contents($pdfPath, $pdfContent)) {
                $fileSize = filesize($pdfPath);
                error_log("PDF received and saved: " . $pdfPath . " (Size: " . $fileSize . " bytes)");
                
                // Verificar que el archivo es un PDF válido
                $file = fopen($pdfPath, 'r');
                if ($file) {
                    $fileHeader = fread($file, 4);
                    fclose($file);
                    
                    if ($fileHeader !== '%PDF') {
                        error_log("Invalid PDF header: " . bin2hex($fileHeader));
                        unlink($pdfPath);
                        $pdfPath = null;
                    } else {
                        error_log("PDF validation successful");
                    }
                } else {
                    error_log("Could not open PDF file for validation");
                    unlink($pdfPath);
                    $pdfPath = null;
                }
            } else {
                error_log("Failed to save PDF to: " . $pdfPath);
                $pdfPath = null;
            }
        } else {
            error_log("Failed to decode PDF base64 or empty content");
        }
    } else {
        error_log("No PDF base64 data received");
    }

    // ===== 1. EMAIL PARA LA EMPRESA (Notificación con PDF) =====
    if ($pdfPath && file_exists($pdfPath)) {
        // Enviar con PDF adjunto
        $companySent = sendEmailWithPDFAttachment(
            COMPANY_EMAIL,
            'Nueva cotización - ' . $data['customerName'] . ' - ' . $quoteNumber,
            $companyMessage,
            $pdfPath,
            'Quote_' . $quoteNumber . '.pdf',
            true // isPlainText = true
        );
        error_log("Company email sent with PDF: " . ($companySent ? 'SUCCESS' : 'FAILED'));
    } else {
        // Enviar email sin PDF (fallback)
        $companyHeaders = "From: " . COMPANY_EMAIL_FULL . "\r\n";
        $companyHeaders .= "Reply-To: " . $data['customerEmail'] . "\r\n";
        $companyHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $companySent = mail(COMPANY_EMAIL, 'Nueva cotización - ' . $data['customerName'], $companyMessage, $companyHeaders);
        error_log("Company email sent without PDF: " . ($companySent ? 'SUCCESS' : 'FAILED'));
    }

    // ===== 2. EMAIL PARA EL CLIENTE (Con PDF) =====
    
    // Cargar template de email
    $emailTemplate = file_get_contents('quote-template-email.html');
    if ($emailTemplate === false) {
        throw new Exception('No se pudo cargar el template de email');
    }

    // Reemplazar variables en el template de email
    $emailReplacements = [
        '´quoteNo´' => $quoteNumber,
        '{{COMPANY_NAME}}' => COMPANY_NAME,
        '{{COMPANY_TAGLINE}}' => COMPANY_TAGLINE,
        '{{IMAGE_QUOTE}}' => IMAGE_QUOTE,
        '{{IMAGE_LOGO}}' => IMAGE_LOGO,
        '{{IMAGE_THANK_YOU}}' => IMAGE_THANK_YOU,
        '{{COMPANY_EMAIL}}' => COMPANY_EMAIL,
        '{{COMPANY_PHONE}}' => COMPANY_PHONE,
        '{{WEBSITE_URL}}' => COMPANY_WEBSITE,
        '{{WEBSITE_DISPLAY}}' => WEBSITE_DISPLAY,
        '´modelSelectionsRows´' => $data['modelSelectionsRows'] ?? '',
        '´pricePerSqft´' => number_format($data['pricePerSqft'] ?? 0, 2),
        '´sqftTotal´' => number_format($data['sqftTotal'] ?? 0),
        '´total´' => number_format($data['total'] ?? 0, 2),
        '´date´' => $data['date'] ?? date('M d, Y'),
        '´stampImageUrl´' => $data['stampImageUrl'] ?? '',
        '´clientName´' => $data['customerName'],
        '´modelOfHouse´' => $data['modelOfHouse'] ?? 'Custom Home'
    ];

    foreach ($emailReplacements as $placeholder => $value) {
        $emailTemplate = str_replace($placeholder, $value, $emailTemplate);
    }

    if ($pdfPath && file_exists($pdfPath)) {
        // Enviar con PDF adjunto a cliente
        $customerSent = sendEmailWithPDFAttachment(
            $data['customerEmail'],
            'Your quote from ' . COMPANY_FULL_NAME . ' - ' . $quoteNumber,
            $emailTemplate,
            $pdfPath,
            'Quote_' . $quoteNumber . '.pdf'
        );
        
        error_log("Customer email sent with PDF: " . ($customerSent ? 'SUCCESS' : 'FAILED'));
        
        // Limpiar archivo temporal después de enviar ambos emails
        unlink($pdfPath);
    } else {
        // Enviar email sin PDF
        $customerHeaders = "From: " . COMPANY_EMAIL_FULL . "\r\n";
        $customerHeaders .= "Reply-To: " . COMPANY_EMAIL . "\r\n";
        $customerHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
        $customerHeaders .= "MIME-Version: 1.0\r\n";

        $customerSent = mail(
            $data['customerEmail'],
            'Your quote from ' . COMPANY_FULL_NAME . ' - ' . $quoteNumber,
            $emailTemplate,
            $customerHeaders
        );
        
        error_log("Customer email sent without PDF: " . ($customerSent ? 'SUCCESS' : 'FAILED'));
    }

    // Respuesta exitosa
    $result = [
        'ok' => true,
        'message' => 'Emails enviados correctamente con PDF desde Angular',
        'quote_number' => $quoteNumber,
        'system' => 'Angular PDF + PHP Email',
        'pdf_received' => isset($data['pdfBase64']) && !empty($data['pdfBase64']),
        'pdf_attached' => $pdfPath !== null,
        'debug' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'company_email_sent' => $companySent,
            'customer_email_sent' => $customerSent
        ]
    ];

    echo json_encode($result);

} catch (Exception $e) {
    $errorMessage = 'Server error: ' . $e->getMessage();
    error_log("EXCEPTION: " . $errorMessage);
    
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => $errorMessage,
        'type' => 'Exception'
    ]);
}

function sendEmailWithPDFAttachment($to, $subject, $message, $pdfPath, $pdfFilename = 'quote.pdf', $isPlainText = false) {
    if (!file_exists($pdfPath)) {
        error_log("PDF file not found: " . $pdfPath);
        return false;
    }
    
    $boundary = md5(time());
    
    // Headers
    $headers = "From: " . COMPANY_EMAIL_FULL . "\r\n";
    $headers .= "Reply-To: " . COMPANY_EMAIL . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    
    // Cuerpo del mensaje
    $emailBody = "--{$boundary}\r\n";
    
    if ($isPlainText) {
        $emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    } else {
        $emailBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    }
    
    $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailBody .= $message . "\r\n\r\n";
    
    // Adjuntar PDF
    $pdfContent = file_get_contents($pdfPath);
    if ($pdfContent === false) {
        error_log("Failed to read PDF content from: " . $pdfPath);
        return false;
    }
    
    $pdfEncoded = chunk_split(base64_encode($pdfContent));
    
    $emailBody .= "--{$boundary}\r\n";
    $emailBody .= "Content-Type: application/pdf; name=\"{$pdfFilename}\"\r\n";
    $emailBody .= "Content-Transfer-Encoding: base64\r\n";
    $emailBody .= "Content-Disposition: attachment; filename=\"{$pdfFilename}\"\r\n\r\n";
    $emailBody .= $pdfEncoded . "\r\n";
    $emailBody .= "--{$boundary}--\r\n";
    
    $result = mail($to, $subject, $emailBody, $headers);
    
    if ($result) {
        error_log("Email with PDF sent successfully to: " . $to);
    } else {
        error_log("Failed to send email with PDF to: " . $to);
    }
    
    return $result;
}

// Función para generar el hash de email de forma consistente con Angular
function generateEmailHash($email) {
    $hash = 0;
    for ($i = 0; $i < strlen($email); $i++) {
        $hash = (($hash << 5) - $hash) + ord($email[$i]);
        $hash = $hash & 0xFFFFFFFF; // Simular comportamiento de 32-bit JavaScript
    }
    return substr(abs($hash), 0, 4);
}
?>
