<?php
include 'cors.php';
session_start();
require 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true, 'redirect' => 'index.php', 'message' => 'Already logged in']);
    exit();
}

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

// Check if the request contains JSON data
$json_data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_SESSION['login_attempts'] >= 5) {
        http_response_code(429); // Too Many Requests
        echo json_encode(['success' => false, 'message' => 'Too many login attempts. Try again later.']);
        exit();
    } else {
        // Get data from JSON or POST based on what's available
        $email = isset($json_data['email']) 
            ? filter_var(trim($json_data['email']), FILTER_VALIDATE_EMAIL) 
            : (isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : null);
            
        $password = isset($json_data['password']) 
            ? trim($json_data['password']) 
            : (isset($_POST['password']) ? trim($_POST['password']) : null);

        if ($email && $password) {
            $stmt = $conn->prepare("SELECT id, First_Name, Last_Name, password FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['First_Name'] = $user['First_Name'];
                $_SESSION['Last_Name'] = $user['Last_Name'];
                $_SESSION['login_attempts'] = 0;

                if ($email === 'k_houari@estin.dz') {
                    echo json_encode(['success' => true, 'redirect' => '/admin_panel', 'message' => 'Admin login successful']);
                    exit();
                } else {
                    echo json_encode(['success' => true, 'redirect' => '/profile', 'message' => 'Login successful']);
                    exit();
                }
            } else {
                $_SESSION['login_attempts']++;
                http_response_code(401); // Unauthorized
                echo json_encode(['success' => false, 'message' => 'Incorrect email or password.']);
                exit();
            }
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => 'Please fill out all fields correctly.']);
            exit();
        }
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}
