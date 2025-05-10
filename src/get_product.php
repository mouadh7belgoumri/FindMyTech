<?php
include 'cors.php';
include 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Get the product ID from the query string
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        exit;
    }

    // Fetch the product from the database
    $stmt = $conn->prepare("SELECT * FROM components WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    // Format the image URL
    $image = $product['photo'];
    if ($image && !filter_var($image, FILTER_VALIDATE_URL)) {
        // If it's not a full URL, make it relative to the server
        $image = $image[0] === '/' ? $image : '/' . $image;
    }

    // Format the product for the frontend
    $formattedProduct = [
        '_id' => $product['id'],
        'name' => $product['name'],
        'description' => $product['description'],
        'category' => $product['category'],
        'characteristics' => $product['characteristics'],
        'regularPrice' => floatval($product['price']),
        'discountedPrice' => floatval($product['price']), // You can add discount logic here
        'stock' => intval($product['stock']),
        'image' => $image,
        'seller_id' => $product['seller_id'],
        'isNew' => (time() - strtotime($product['created_at'] ?? 'now')) < 604800, // 7 days
        'quantity' => 1 // Default quantity for cart
    ];

    // Return the product as JSON
    echo json_encode($formattedProduct);
} catch (Exception $e) {
    // Return error as JSON
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
