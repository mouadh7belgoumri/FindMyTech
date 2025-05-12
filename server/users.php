<?php
include 'cors.php';
header('Content-Type: application/json');
session_start();

include 'config.php'; // Database connection

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'users' => []
];

// Check if user is admin (optional security check)
// Uncomment if you want to restrict access to admins only
/*
if (!isset($_SESSION['user_id']) || $_SESSION['is_admin'] !== true) {
    $response['message'] = "Unauthorized access";
    http_response_code(401);
    echo json_encode($response);
    exit();
}
*/

try {
    // Prepare and execute the query to get all users
    $stmt = $conn->prepare("SELECT id, First_Name, Last_Name, email FROM users");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Don't include passwords in the response for security
    
    $response['users'] = $users;
    $response['message'] = "Users retrieved successfully";
    $response['success'] = true;
    http_response_code(200);
} catch (PDOException $e) {
    $response['message'] = "Error retrieving users: " . $e->getMessage();
    http_response_code(500);
}

// Return JSON response
echo json_encode($response);