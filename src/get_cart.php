<?php
include 'cors.php';
session_start();
require 'config.php';

// Set content type to JSON for API responses
header('Content-Type: application/json');

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        // For guest users, return session cart
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
        
        $cart_items = [];
        foreach ($_SESSION['cart'] as $product_id => $item) {
            $cart_items[] = [
                'product_id' => $product_id,
                'name' => $item['name'],
                'price' => $item['price'],
                'photo' => $item['photo'],
                'quantity' => $item['quantity']
            ];
        }
        
        echo json_encode([
            'success' => true, 
            'message' => 'Cart retrieved',
            'cart' => $cart_items
        ]);
    } else {
        // For logged-in users, get cart from database
        $user_id = $_SESSION['user_id'];
        
        $stmt = $conn->prepare("
            SELECT p.id as cart_id, p.product_id, p.quantite, c.name, c.price, c.photo 
            FROM panier p 
            JOIN components c ON p.product_id = c.id 
            WHERE p.user_id = ? AND p.product_type = 'component'
        ");
        $stmt->execute([$user_id]);
        $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format cart items for frontend
        $formattedItems = [];
        foreach ($cart_items as $item) {
            // Format the image URL
            $image = $item['photo'];
            if ($image && !filter_var($image, FILTER_VALIDATE_URL)) {
                // If it's not a full URL, make it relative to the server
                $image = $image[0] === '/' ? $image : '/' . $image;
            }
            
            $formattedItems[] = [
                '_id' => $item['product_id'],
                'name' => $item['name'],
                'regularPrice' => floatval($item['price']),
                'discountedPrice' => floatval($item['price']), // You can add discount logic here
                'image' => $image,
                'quantity' => intval($item['quantite'])
            ];
        }
        
        echo json_encode([
            'success' => true, 
            'message' => 'Cart retrieved',
            'cart' => $formattedItems
        ]);
    }
} catch (PDOException $e) {
    error_log("Get cart error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while retrieving cart']);
}
