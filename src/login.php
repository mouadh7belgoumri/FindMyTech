<?php
include 'cors.php';
session_start();
require 'config.php';

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

// Check if required fields are present
if (!isset($input['email']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
$password = $input['password'];

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    // Check login attempts
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = 0;
    }
    
    if ($_SESSION['login_attempts'] >= 5) {
        echo json_encode(['success' => false, 'message' => 'Too many login attempts. Try again later.']);
        exit;
    }
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, First_Name, Last_Name, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        $_SESSION['login_attempts']++;
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }
    
    // Reset login attempts on successful login
    $_SESSION['login_attempts'] = 0;
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['First_Name'] = $user['First_Name'];
    $_SESSION['Last_Name'] = $user['Last_Name'];
    
    // Transfer guest cart to user cart if exists
    if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $product_id => $item) {
            // Check if product is already in user's cart
            $stmt = $conn->prepare("SELECT id, quantite FROM panier WHERE user_id = ? AND product_id = ? AND product_type = 'component'");
            $stmt->execute([$user['id'], $product_id]);
            $cart_item = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($cart_item) {
                // Update quantity
                $new_quantity = $cart_item['quantite'] + $item['quantity'];
                $stmt = $conn->prepare("UPDATE panier SET quantite = ? WHERE id = ?");
                $stmt->execute([$new_quantity, $cart_item['id']]);
            } else {
                // Add new item to cart
                $stmt = $conn->prepare("INSERT INTO panier (user_id, product_type, product_id, quantite) VALUES (?, 'component', ?, ?)");
                $stmt->execute([$user['id'], $product_id, $item['quantity']]);
            }
        }
        
        // Clear session cart
        unset($_SESSION['cart']);
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'firstName' => $user['First_Name'],
            'lastName' => $user['Last_Name'],
            'email' => $email
        ]
    ]);
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during login']);
}
