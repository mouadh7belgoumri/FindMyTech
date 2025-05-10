<?php
include 'cors.php';
session_start();

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Clear all session variables
$_SESSION = [];

// Destroy the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy the session
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout successful']);
