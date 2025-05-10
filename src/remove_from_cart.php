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

// Check if product_id is provided
if (!isset($input['product_id'])) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit;
}

$product_id = intval($input['product_id']);

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        // For guest users, remove from session cart
        if (isset($_SESSION['cart'][$product_id])) {
            unset($_SESSION['cart'][$product_id]);
            echo json_encode([
                'success' => true, 
                'message' => 'Product removed from cart',
                'cart' => $_SESSION['cart']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found in cart']);
        }
    } else {
        // For logged-in users, remove from database cart
        $user_id = $_SESSION['user_id'];
        
        $stmt = $conn->prepare("DELETE FROM panier WHERE user_id = ? AND product_id = ? AND product_type = 'component'");
        $result = $stmt->execute([$user_id, $product_id]);
        
        if ($stmt->rowCount() > 0) {
            // Get updated cart
            $stmt = $conn->prepare("
                SELECT p.id as cart_id, p.product_id, p.quantite, c.name, c.price, c.photo 
                FROM panier p 
                JOIN components c ON p.product_id = c.id 
                WHERE p.user_id = ? AND p.product_type = 'component'
            ");
            $stmt->execute([$user_id]);
            $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Product removed from cart',
                'cart' => $cart_items
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found in cart']);
        }
    }
} catch (PDOException $e) {
    error_log("Remove from cart error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while removing from cart']);
}
