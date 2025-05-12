<?php
include 'cors.php';
header('Content-Type: application/json');
session_start();

$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required fields
    if (!isset($data['product_id']) || !isset($data['quantity'])) {
        $response['message'] = "Product ID and quantity are required";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    $product_id_to_update = intval($data['product_id']);
    $new_quantity = max(1, intval($data['quantity'])); // Ensure minimum quantity of 1

    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    if (isset($_SESSION['cart'][$product_id_to_update])) {
        $_SESSION['cart'][$product_id_to_update]['quantity'] = $new_quantity;
        
        $response['success'] = true;
        $response['message'] = "Cart quantity updated successfully";
        $response['data'] = [
            'product_id' => $product_id_to_update,
            'quantity' => $new_quantity,
            'cart' => $_SESSION['cart']
        ];
        http_response_code(200);
    } else {
        $response['message'] = "Product not found in cart";
        http_response_code(404);
    }
} else {
    $response['message'] = "Method not allowed";
    http_response_code(405);
}

echo json_encode($response);
