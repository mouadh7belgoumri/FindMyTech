<?php
include 'cors.php';
session_start(); // Start the session

include 'config.php'; // Include the database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the user is logged in
    if (!isset($_SESSION['user_id'])) {
        die("Vous devez être connecté pour ajouter un produit.");
    }

    // Sanitize and validate inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $description = htmlspecialchars(trim($_POST['description']));
    $category = htmlspecialchars(trim($_POST['category']));
    $characteristics = htmlspecialchars(trim($_POST['characteristics']));
    $user_id = $_SESSION['user_id']; // User ID from session
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $photo = htmlspecialchars(trim($_POST['photo'])); // Path to the photo

    // Prepare and execute the query
    $stmt = $conn->prepare("INSERT INTO components (name, description, category, characteristics, seller_id, price, stock, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if ($stmt->execute([$name, $description, $category, $characteristics, $seller_id, $price, $stock, $photo])) {
        $message = "Produit ajouté avec succès !";
    } else {
        $message = "Erreur lors de l'ajout du produit : " . $stmt->errorInfo()[2];
    }
}
