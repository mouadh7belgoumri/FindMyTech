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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($data['email']) || !isset($data['password'])) {
        $response['message'] = "Email and password are required";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    $email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
    $password = trim($data['password']);

    if ($email && $password) {
        $stmt = $conn->prepare("SELECT id, First_Name, Last_Name, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Generate JWT token here (you'll need to implement JWT)
            $token = "YOUR_JWT_TOKEN_GENERATION_LOGIC";
            
            $response['success'] = true;
            $response['message'] = "Login successful";
            $response['data'] = [
                'user_id' => $user['id'],
                'first_name' => $user['First_Name'],
                'last_name' => $user['Last_Name'],
                'token' => $token,
                'is_admin' => ($email === 'k_houari@estin.dz')
            ];
            http_response_code(200);
        } else {
            $response['message'] = "Incorrect email or password";
            http_response_code(401);
        }
    } else {
        $response['message'] = "Invalid email format";
        http_response_code(400);
    }
} else {
    $response['message'] = "Method not allowed";
    http_response_code(405);
}

echo json_encode($response);

