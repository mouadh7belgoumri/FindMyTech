<?php
include 'cors.php';
require 'config.php';

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Check if search parameter is provided
if (!isset($_GET['search']) || empty($_GET['search'])) {
    echo json_encode(['success' => false, 'message' => 'No search query provided', 'data' => []]);
    exit;
}

try {
    $search = $_GET['search'];
    
    // Prepare the search query
    $stmt = $conn->prepare("
        SELECT id, category, name, description, price, stock, photo 
        FROM components 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        AND stock > 0
    ");
    
    $searchTerm = "%$search%";
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format results for frontend
    $formattedResults = [];
    foreach ($results as $product) {
        // Format the image URL
        $image = $product['photo'];
        if ($image && !filter_var($image, FILTER_VALIDATE_URL)) {
            // If it's not a full URL, make it relative to the server
            $image = $image[0] === '/' ? $image : '/' . $image;
        }
        
        $formattedResults[] = [
            '_id' => $product['id'],
            'name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'regularPrice' => floatval($product['price']),
            'discountedPrice' => floatval($product['price']), // You can add discount logic here
            'stock' => intval($product['stock']),
            'image' => $image,
            'isNew' => false, // You can add logic to determine if it's new
            'quantity' => 1 // Default quantity for cart
        ];
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Search results', 
        'data' => $formattedResults,
        'count' => count($formattedResults)
    ]);
} catch (PDOException $e) {
    error_log("Search error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during search', 'data' => []]);
}
