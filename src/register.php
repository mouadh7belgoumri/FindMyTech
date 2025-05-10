<?php
include 'cors.php';
session_start();
require 'config.php'; // Database connection

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get input data (support both form data and JSON)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// Check if all required fields are present
if (
    !isset($input['first_name']) || 
    !isset($input['last_name']) || 
    !isset($input['email']) || 
    !isset($input['password']) || 
    !isset($input['confirm_password'])
) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Sanitize and validate input
$first_name = trim($input['first_name']);
$last_name = trim($input['last_name']);
$email = trim($input['email']);
$password = trim($input['password']);
$confirm_password = trim($input['confirm_password']);

// Validate input
if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
} elseif (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit;
} elseif ($password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }
    
    // Insert new user
    $sql = "INSERT INTO users (First_Name, Last_Name, email, password) 
            VALUES (:first_name, :last_name, :email, :password)";
    $stmt = $conn->prepare($sql);
    $result = $stmt->execute([
        ':first_name' => $first_name,
        ':last_name' => $last_name,
        ':email' => $email,
        ':password' => password_hash($password, PASSWORD_DEFAULT)
    ]);
    
    if ($result) {
        // Get the new user ID
        $user_id = $conn->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Registration successful!',
            'user_id' => $user_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during registration']);
}
