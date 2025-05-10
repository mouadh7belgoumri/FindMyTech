<?php
include 'cors.php';
include 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Get distinct categories from the database
    $stmt = $conn->prepare("SELECT DISTINCT category FROM components WHERE stock > 0");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Format the categories for the frontend
    $formattedCategories = [];
    foreach ($categories as $index => $category) {
        $formattedCategories[] = [
            '_id' => (string)($index + 1),
            'name' => $category,
            '_base' => strtolower(str_replace(' ', '', $category)),
            'image' => '/placeholder.svg?height=100&width=100' // Default image
        ];
    }

    // Return the categories as JSON
    echo json_encode($formattedCategories);
} catch (Exception $e) {
    // Return error as JSON
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
