<?php
// send_mail.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Obtener datos de React
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    // Validar campos básicos
    if (empty($data['email']) || empty($data['name'])) {
        echo json_encode(["sent" => false, "message" => "Datos incompletos"]);
        exit();
    }

    $role = $data['role'] === 'distributor' ? 'Distributor / Business' : 'Private Customer';
    
    // Configuración
    $to = "info@thevanillarepublic.com"; 
    $subject = "New Inquiry form Web: " . $data['name'] . " (" . $role . ")";
    
    // Construir mensaje HTML
    $message = "<html><body style='font-family: Arial, sans-serif;'>";
    $message .= "<h2 style='color: #D4AF37;'>New Web Inquiry</h2>";
    $message .= "<p><strong>Profile:</strong> " . $role . "</p>";
    $message .= "<p><strong>Name:</strong> " . $data['name'] . "</p>";
    $message .= "<p><strong>Email:</strong> " . $data['email'] . "</p>";

    // Si es distribuidor, agregar los campos extra
    if ($data['role'] === 'distributor') {
        $message .= "<hr>";
        $message .= "<h3>Business Details</h3>";
        $message .= "<p><strong>Company:</strong> " . ($data['company'] ?? 'N/A') . "</p>";
        $message .= "<p><strong>Country:</strong> " . ($data['country'] ?? 'N/A') . "</p>";
        $message .= "<p><strong>Volume:</strong> " . ($data['volume'] ?? 'N/A') . "</p>";
    }

    $message .= "<hr>";
    $message .= "<h3>Message</h3>";
    $message .= "<p>" . nl2br($data['message']) . "</p>";
    $message .= "</body></html>";

    // Cabeceras
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Web Form <no-reply@thevanillarepublic.com>" . "\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";

    // Enviar
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["sent" => true]);
    } else {
        echo json_encode(["sent" => false]);
    }

} else {
    echo json_encode(["sent" => false, "message" => "Método no permitido"]);
}
?>