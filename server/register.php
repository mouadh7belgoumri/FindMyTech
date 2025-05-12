<?php
include 'cors.php';
header('Content-Type: application/json');
require 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Validate required fields
    if (!isset($data['first_name']) || !isset($data['last_name']) || 
        !isset($data['email']) || !isset($data['password']) || 
        !isset($data['confirm_password'])) {
        $response['message'] = "All fields are required";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    $first_name = trim($data['first_name']);
    $last_name = trim($data['last_name']);
    $email = trim($data['email']);
    $password = trim($data['password']);
    $confirm_password = trim($data['confirm_password']);

    // Validation checks
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
        $response['message'] = "All fields are required";
        http_response_code(400);
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Invalid email address";
        http_response_code(400);
    } elseif (strlen($password) < 8) {
        $response['message'] = "Password must be at least 8 characters";
        http_response_code(400);
    } elseif ($password !== $confirm_password) {
        $response['message'] = "Passwords do not match";
        http_response_code(400);
    } else {
        // Check if email already exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        
        if ($stmt->rowCount() > 0) {
            $response['message'] = "Email already exists";
            http_response_code(409); // Conflict
        } else {
            try {
                $sql = "INSERT INTO users (First_Name, Last_Name, email, password) 
                        VALUES (:first_name, :last_name, :email, :password)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([
                    ':first_name' => $first_name,
                    ':last_name' => $last_name,
                    ':email' => $email,
                    ':password' => password_hash($password, PASSWORD_DEFAULT)
                ]);

                $response['success'] = true;
                $response['message'] = "Registration successful";
                $response['data'] = [
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'email' => $email
                ];
                http_response_code(201); // Created
            } catch (PDOException $e) {
                $response['message'] = "Registration failed";
                http_response_code(500); // Internal Server Error
            }
        }
    }
} else {
    $response['message'] = "Method not allowed";
    http_response_code(405);
}

echo json_encode($response);
