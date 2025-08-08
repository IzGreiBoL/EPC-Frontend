<?php
// Sistema de email simplificado para IONOS - Solo PHP nativo
error_log("=== EMAIL SYSTEM START ===");

try {
    require_once 'config.php';
    error_log("config.php loaded successfully");
} catch (Exception $e) {
    error_log("Error loading config.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration error']);
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Log de debug
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    error_log("=== EMAIL SYSTEM NATIVE PHP START ===");
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $error = 'Invalid JSON: ' . json_last_error_msg();
        error_log("JSON Error: " . $error);
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $error]);
        exit;
    }

    $quote = $data['quote'] ?? [];
    
    // Validar datos requeridos
    if (empty($quote['customerName']) || empty($quote['customerEmail'])) {
        $error = 'Missing required fields: customerName or customerEmail';
        error_log($error);
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $error]);
        exit;
    }

    // Función para cargar y procesar template
    function loadTemplate($templateFile, $replacements) {
        if (!file_exists($templateFile)) {
            error_log("Template file not found: " . $templateFile);
            return false;
        }
        
        $template = file_get_contents($templateFile);
        if ($template === false) {
            error_log("Failed to read template: " . $templateFile);
            return false;
        }
        
        // Reemplazar placeholders
        foreach ($replacements as $placeholder => $value) {
            $template = str_replace($placeholder, $value, $template);
        }
        
        return $template;
    }
    
    // Función para generar las filas de selecciones del modelo
    function generateModelSelections($quote) {
        $selections = [];
        
        // Procesar las selecciones del usuario agrupadas por categoría
        if (isset($quote['selections']) && is_array($quote['selections'])) {
            foreach ($quote['selections'] as $selection) {
                if (isset($selection['category']) && isset($selection['subcategories'])) {
                    $categoryName = htmlspecialchars($selection['category']);
                    
                    if (is_array($selection['subcategories']) && !empty($selection['subcategories'])) {
                        // Extraer solo las selecciones reales, no los nombres de subcategoría
                        $cleanSelections = [];
                        foreach ($selection['subcategories'] as $subcategory) {
                            $cleanSubcategory = htmlspecialchars(trim($subcategory));
                            
                            // Si contiene ":", tomar solo la parte después de los dos puntos
                            if (strpos($cleanSubcategory, ':') !== false) {
                                $parts = explode(':', $cleanSubcategory, 2);
                                if (count($parts) >= 2) {
                                    $cleanSelections[] = trim($parts[1]);
                                }
                            } else {
                                // Si no tiene ":", usar tal como está
                                $cleanSelections[] = $cleanSubcategory;
                            }
                        }
                        
                        if (!empty($cleanSelections)) {
                            // Crear línea: "Categoría: selección1, selección2, selección3"
                            $formattedLine = $categoryName . ': ' . implode(', ', $cleanSelections);
                            $selections[] = '<div style="padding:8px 0;border-bottom:1px solid #e0e0e0;font-size:15px;">' . $formattedLine . '</div>';
                        }
                    }
                }
            }
        }
        
        return implode("\n              ", $selections);
    }
    
    // Función para convertir rutas relativas a absolutas en el template
    function fixImagePaths($template, $baseUrl) {
        // Reemplazar rutas de imágenes relativas por absolutas
        $template = str_replace('src="/images/', 'src="' . $baseUrl . '/images/', $template);
        $template = str_replace("src='/images/", "src='" . $baseUrl . "/images/", $template);
        return $template;
    }
    
    // Configurar datos para los templates
    $quoteNumber = 'Q' . date('Ymd') . '-' . substr(md5($quote['customerEmail']), 0, 4);
    
    $quoteData = [
        '´quoteNo´' => $quoteNumber,
        '´date´' => date('M d, Y'),
        '´clientName´' => htmlspecialchars($quote['customerName']),
        '´modelOfHouse´' => htmlspecialchars($quote['modelOfHouse'] ?? $quote['houseModel'] ?? 'Custom Home'),
        '´pricePerSqft´' => number_format($quote['pricePerSqft'] ?? 0, 2),
        '´sqftTotal´' => number_format($quote['sqftTotal'] ?? $quote['sqft'] ?? 0),
        '´total´' => number_format($quote['total'] ?? $quote['totalPrice'] ?? 0, 2),
        '´stampImageUrl´' => $quote['stampImageUrl'] ?? getAbsoluteImageUrl('/images/' . strtolower($quote['modelOfHouse'] ?? $quote['houseModel'] ?? 'custom') . '/image1.jpg'),
        '´modelSelectionsRows´' => generateModelSelections($quote)
    ];
    
    // Agregar placeholders de la empresa
    global $TEMPLATE_PLACEHOLDERS;
    
    $quoteData = array_merge($quoteData, $TEMPLATE_PLACEHOLDERS);

    // ===== 1. EMAIL PARA LA EMPRESA (Notificación) =====
    $to_company = COMPANY_EMAIL;
    $subject_company = 'Nueva solicitud de cotización - ' . $quote['customerName'];
    
    $company_message = "Nueva solicitud de cotización:\n\n";
    $company_message .= "Número de cotización: " . $quoteNumber . "\n";
    $company_message .= "Fecha: " . date('Y-m-d H:i:s') . "\n\n";
    $company_message .= "=== DATOS DEL CLIENTE ===\n";
    $company_message .= "Nombre: " . $quote['customerName'] . "\n";
    $company_message .= "Email: " . $quote['customerEmail'] . "\n";
    $company_message .= "Teléfono: " . ($quote['customerPhone'] ?? 'No proporcionado') . "\n";
    $company_message .= "Mensaje: " . ($quote['customerMessage'] ?? 'Sin mensaje') . "\n\n";
    
    $company_message .= "=== DETALLES DEL PROYECTO ===\n";
    
    // Modelo de casa (probamos varios nombres de campo)
    $houseModel = $quote['houseModel'] ?? $quote['modelOfHouse'] ?? 'No especificado';
    $company_message .= "Modelo de casa: " . $houseModel . "\n";
    
    // Precio total (probamos varios nombres de campo)
    $totalPrice = $quote['totalPrice'] ?? $quote['total'] ?? 0;
    if ($totalPrice > 0) {
        $company_message .= "Precio estimado: $" . number_format($totalPrice) . "\n";
    }
    
    // Metros cuadrados (probamos varios nombres de campo)
    $sqft = $quote['sqft'] ?? $quote['sqftTotal'] ?? 0;
    if ($sqft > 0) {
        $company_message .= "Metros cuadrados: " . $sqft . " sq ft\n";
    }
    
    // Habitaciones y baños
    if (isset($quote['bedrooms']) && $quote['bedrooms'] > 0) {
        $company_message .= "Habitaciones: " . $quote['bedrooms'] . "\n";
    }
    if (isset($quote['bathrooms']) && $quote['bathrooms'] > 0) {
        $company_message .= "Baños: " . $quote['bathrooms'] . "\n";
    }
    
    // Precio por pie cuadrado
    if (isset($quote['pricePerSqft']) && $quote['pricePerSqft'] > 0) {
        $company_message .= "Precio por sq ft: $" . number_format($quote['pricePerSqft']) . "\n";
    }
    
    // Añadir selecciones del usuario
    $company_message .= "\n=== SELECCIONES DEL USUARIO ===\n";
    if (isset($quote['selections'])) {
        error_log("Processing selections: " . print_r($quote['selections'], true));
        
        if (is_array($quote['selections']) && !empty($quote['selections'])) {
            foreach ($quote['selections'] as $selection) {
                if (isset($selection['category']) && isset($selection['subcategories'])) {
                    $categoryName = htmlspecialchars($selection['category']);
                    $company_message .= "\n" . strtoupper($categoryName) . ":\n";
                    
                    if (is_array($selection['subcategories']) && !empty($selection['subcategories'])) {
                        foreach ($selection['subcategories'] as $subcategory) {
                            $cleanSubcategory = htmlspecialchars(trim($subcategory));
                            
                            // Si contiene ":", tomar solo la parte después de los dos puntos
                            if (strpos($cleanSubcategory, ':') !== false) {
                                $parts = explode(':', $cleanSubcategory, 2);
                                if (count($parts) >= 2) {
                                    $company_message .= "  - " . trim($parts[1]) . "\n";
                                } else {
                                    $company_message .= "  - " . $cleanSubcategory . "\n";
                                }
                            } else {
                                // Si no tiene ":", usar tal como está
                                $company_message .= "  - " . $cleanSubcategory . "\n";
                            }
                        }
                    }
                }
            }
        } else {
            // Si selections no es un array estructurado, mostrar tal como llegue
            $company_message .= "Selecciones (formato no reconocido): " . print_r($quote['selections'], true) . "\n";
        }
    } else {
        $company_message .= "No hay selecciones específicas registradas.\n";
    }
    
    $company_message .= "\n=== ACCIÓN REQUERIDA ===\n";
    $company_message .= "Contactar al cliente en las próximas 24 horas.\n";
    $company_message .= "Email generado automáticamente desde " . WEBSITE_DISPLAY . "\n";

    $company_headers = "From: " . COMPANY_EMAIL_FULL . "\r\n";
    $company_headers .= "Reply-To: " . $quote['customerEmail'] . "\r\n";
    $company_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $company_sent = mail($to_company, $subject_company, $company_message, $company_headers);
    error_log("Company email sent: " . ($company_sent ? 'SUCCESS' : 'FAILED'));

    // ===== 2. EMAIL PARA EL CLIENTE (Con template HTML) =====
    $customerTemplate = loadTemplate('quote-template-email.html', $quoteData);
    
    if ($customerTemplate === false) {
        // Fallback: intentar con el template original
        $customerTemplate = loadTemplate('quote-template.html', $quoteData);
        if ($customerTemplate !== false) {
            $customerTemplate = fixImagePaths($customerTemplate, $baseUrl);
        }
    }
    
    if ($customerTemplate === false) {
        // Si no se puede cargar el template, enviar email simple
        $customerTemplate = "
        <!DOCTYPE html>
        <html>
        <head><meta charset='UTF-8'><title>Su Cotización - " . COMPANY_FULL_NAME . "</title></head>
        <body style='font-family: Arial, sans-serif; color: #333; padding: 20px;'>
            <div style='text-align: center; margin-bottom: 20px;'>
                <img src='" . IMAGE_LOGO . "' alt='EPC Logo' style='width: 120px; height: auto;'>
            </div>
            <h1 style='color: #1d4355;'>¡Gracias por su interés en " . COMPANY_FULL_NAME . "!</h1>
            <p>Estimado/a <strong>" . htmlspecialchars($quote['customerName']) . "</strong>,</p>
            <p>Hemos recibido su solicitud de cotización <strong>" . $quoteNumber . "</strong>.</p>
            <p>Nuestro equipo revisará los detalles y se pondrá en contacto con usted pronto.</p>
            <h3>Resumen de su solicitud:</h3>
            <ul>
                <li><strong>Modelo:</strong> " . htmlspecialchars($quote['houseModel'] ?? 'Custom Home') . "</li>
                <li><strong>Área:</strong> " . number_format($quote['sqft'] ?? 0) . " sq ft</li>
                <li><strong>Precio estimado:</strong> $" . number_format($quote['totalPrice'] ?? 0, 2) . "</li>
            </ul>
            <p style='background: #e8f5e8; padding: 15px; border-radius: 8px;'>
                <strong>📞 Nos pondremos en contacto pronto</strong><br>
                Email: " . COMPANY_EMAIL . "<br>
                Teléfono: " . COMPANY_PHONE . "
            </p>
            <p>Gracias por confiar en " . COMPANY_FULL_NAME . ".</p>
            <div style='text-align: center; margin-top: 30px;'>
                <img src='" . IMAGE_THANK_YOU . "' alt='Thank You' style='width: 180px; height: auto;'>
            </div>
            <p style='color: #666; font-size: 12px; margin-top: 30px;'>
                " . EMAIL_SIGNATURE . "<br>
                " . EMAIL_FOOTER_TEXT . "
            </p>
        </body>
        </html>";
    }
    
    $to_customer = $quote['customerEmail'];
    $subject_customer = 'Your quote from ' . COMPANY_FULL_NAME . ' - ' . $quoteNumber;
    
    // Headers para email HTML
    $customer_headers = "From: " . COMPANY_EMAIL_FULL . "\r\n";
    $customer_headers .= "Reply-To: " . COMPANY_EMAIL . "\r\n";
    $customer_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $customer_headers .= "MIME-Version: 1.0\r\n";

    $customer_sent = mail($to_customer, $subject_customer, $customerTemplate, $customer_headers);
    error_log("Customer email sent: " . ($customer_sent ? 'SUCCESS' : 'FAILED'));

    // Respuesta exitosa
    $result = [
        'ok' => true,
        'message' => 'Emails enviados correctamente (PHP nativo con imágenes absolutas)',
        'company_sent' => $company_sent,
        'customer_sent' => $customer_sent,
        'quote_number' => $quoteNumber,
        'system' => 'PHP Native (no dependencies)',
        'debug' => [
            'template_loaded' => $customerTemplate !== false,
            'company_email' => $to_company,
            'customer_email' => $to_customer,
            'timestamp' => date('Y-m-d H:i:s'),
            'base_url' => $baseUrl
        ]
    ];

    error_log("Final result: " . print_r($result, true));
    echo json_encode($result);

} catch (Exception $e) {
    $error_message = 'Server error: ' . $e->getMessage() . ' in line ' . $e->getLine();
    error_log("EXCEPTION: " . $error_message);
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'ok' => false, 
        'error' => $error_message,
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'system' => 'PHP Native'
    ]);
}
?>
