<?php
include 'cors.php';
header('Content-Type: application/json');
session_start();

require 'config.php';

$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the user is logged in
   /* if (!isset($_SESSION['user_id'])) {
        $response['message'] = "Authentication required";
        http_response_code(401);
        echo json_encode($response);
        exit();
    }*/

    // Validate required fields
    $required_fields = ['name', 'description', 'category', 'characteristics', 'price', 'stock', 'photo'];
    $missing_fields = [];
    
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $missing_fields[] = $field;
        }
    }

    if (!empty($missing_fields)) {
        $response['message'] = "Missing required fields: " . implode(', ', $missing_fields);
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    // Sanitize and validate inputs
    $name = htmlspecialchars(trim($data['name']));
    $description = htmlspecialchars(trim($data['description']));
    $category = htmlspecialchars(trim($data['category']));
    $characteristics = htmlspecialchars(trim($data['characteristics']));
    $user_id = htmlspecialchars(trim($data['seller_id']));
    //$user_id = $_SESSION['user_id'];
    $price = floatval($data['price']);
    $stock = intval($data['stock']);
    $photo = htmlspecialchars(trim($data['photo']));

    // Validate numeric values
    if ($price <= 0) {
        $response['message'] = "Price must be greater than 0";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    if ($stock < 0) {
        $response['message'] = "Stock cannot be negative";
        http_response_code(400);
        echo json_encode($response);
        exit();
    }

    try {
        // Prepare and execute the query
        $stmt = $conn->prepare("INSERT INTO components (name, description, category, characteristics, seller_id, price, stock, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        if ($stmt->execute([$name, $description, $category, $characteristics, $user_id, $price, $stock, $photo])) {
            $product_id = $conn->lastInsertId();
            
            $response['success'] = true;
            $response['message'] = "Product added successfully";
            $response['data'] = [
                'product_id' => $product_id,
                'name' => $name,
                'description' => $description,
                'category' => $category,
                'characteristics' => $characteristics,
                'price' => $price,
                'stock' => $stock,
                'photo' => $photo,
                'seller_id' => $user_id
            ];
            http_response_code(201);
        } else {
            $response['message'] = "Error adding product: " . $stmt->errorInfo()[2];
            http_response_code(500);
        }
    } catch (PDOException $e) {
        $response['message'] = "Database error: " . $e->getMessage();
        http_response_code(500);
    }
} else {
    $response['message'] = "Method not allowed";
    http_response_code(405);
}

echo json_encode($response);
