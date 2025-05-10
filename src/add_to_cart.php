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
if (!isset($input['product_id']) || !isset($input['quantity'])) {
    echo json_encode(['success' => false, 'message' => 'Product ID and quantity are required']);
    exit;
}

$product_id = intval($input['product_id']);
$quantity = max(1, intval($input['quantity']));

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        // For guest users, store cart in session
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
        
        // Check if product exists
        $stmt = $conn->prepare("SELECT id, name, price, photo FROM components WHERE id = ? AND stock >= ?");
        $stmt->execute([$product_id, $quantity]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            echo json_encode(['success' => false, 'message' => 'Product not found or insufficient stock']);
            exit;
        }
        
        // Add to session cart
        if (isset($_SESSION['cart'][$product_id])) {
            $_SESSION['cart'][$product_id]['quantity'] += $quantity;
        } else {
            $_SESSION['cart'][$product_id] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'price' => $product['price'],
                'photo' => $product['photo'],
                'quantity' => $quantity
            ];
        }
        
        echo json_encode([
            'success' => true, 
            'message' => 'Product added to cart',
            'cart' => $_SESSION['cart']
        ]);
    } else {
        // For logged-in users, store cart in database
        $user_id = $_SESSION['user_id'];
        
        // Check if product exists and has enough stock
        $stmt = $conn->prepare("SELECT id FROM components WHERE id = ? AND stock >= ?");
        $stmt->execute([$product_id, $quantity]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            echo json_encode(['success' => false, 'message' => 'Product not found or insufficient stock']);
            exit;
        }
        
        // Check if product is already in cart
        $stmt = $conn->prepare("SELECT id, quantite FROM panier WHERE user_id = ? AND product_id = ? AND product_type = 'component'");
        $stmt->execute([$user_id, $product_id]);
        $cart_item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($cart_item) {
            // Update quantity
            $new_quantity = $cart_item['quantite'] + $quantity;
            $stmt = $conn->prepare("UPDATE panier SET quantite = ? WHERE id = ?");
            $stmt->execute([$new_quantity, $cart_item['id']]);
        } else {
            // Add new item to cart
            $stmt = $conn->prepare("INSERT INTO panier (user_id, product_type, product_id, quantite) VALUES (?, 'component', ?, ?)");
            $stmt->execute([$user_id, $product_id, $quantity]);
        }
        
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
            'message' => 'Product added to cart',
            'cart' => $cart_items
        ]);
    }
} catch (PDOException $e) {
    error_log("Add to cart error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while adding to cart']);
}
