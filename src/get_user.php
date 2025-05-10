<?php
include 'cors.php';
session_start();
require 'config.php';

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Check if user is logged in
$authenticated = isset($_SESSION['user_id']);
$user = null;

if ($authenticated) {
    try {
        // Get user data
        $stmt = $conn->prepare("SELECT id, email, First_Name, Last_Name FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // If user not found in database, destroy session
        if (!$userData) {
            session_destroy();
            $authenticated = false;
        } else {
            $user = [
                'id' => $userData['id'],
                'email' => $userData['email'],
                'firstName' => $userData['First_Name'],
                'lastName' => $userData['Last_Name'],
                'avatar' => '/placeholder.svg?height=80&width=80' // Default avatar
            ];
        }
    } catch (PDOException $e) {
        error_log("Get user error: " . $e->getMessage());
        $authenticated = false;
    }
}

// Return JSON response
echo json_encode([
    'authenticated' => $authenticated,
    'user' => $user
]);
