<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    $payload = $_POST;
}

$apiUrl = $payload['apiUrl'] ?? '';
$apiKey = $payload['apiKey'] ?? '';
$action = $payload['action'] ?? '';

if (!$apiUrl || !$apiKey || !$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing apiUrl, apiKey or action']);
    exit;
}

unset($payload['apiUrl'], $payload['apiKey']);
$payload['key'] = $apiKey;

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
        'Accept: application/json, text/plain, */*',
        'User-Agent: FlexaPanel-PHP-Proxy/1.0'
    ],
    CURLOPT_TIMEOUT => 25,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: 500;
curl_close($ch);

http_response_code($status);

if ($response === false) {
    echo json_encode(['error' => $error ?: 'cURL error']);
    exit;
}

$decoded = json_decode($response, true);
if (json_last_error() === JSON_ERROR_NONE) {
    echo json_encode($decoded);
} else {
    echo json_encode(['raw' => $response, 'error' => $status >= 400 ? $response : null]);
}
?>