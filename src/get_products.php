<?php
include 'cors.php';
include 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Get query parameters
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

    // Build the query
    $query = "SELECT * FROM components WHERE stock > 0";
    $params = [];

    if ($category) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    if ($search) {
        $query .= " AND (name LIKE ? OR description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $query .= " ORDER BY id DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    // Execute the query
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the products for the frontend
    $formattedProducts = [];
    foreach ($products as $product) {
        // Format the image URL
        $image = $product['photo'];
        if ($image && !filter_var($image, FILTER_VALIDATE_URL)) {
            // If it's not a full URL, make it relative to the server
            $image = $image[0] === '/' ? $image : '/' . $image;
        }
        
        $formattedProducts[] = [
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
    }

    // Return the products as JSON
    echo json_encode(['data' => $formattedProducts]);
} catch (Exception $e) {
    // Return error as JSON
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
