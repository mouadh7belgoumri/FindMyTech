<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// If you need to support credentials (cookies, auth headers)
// Use the specific origin instead of * and enable credentials
// header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
// header("Access-Control-Allow-Credentials: true");

// Allow specific methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
