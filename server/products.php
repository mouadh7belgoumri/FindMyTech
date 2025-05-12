<?php
//include 'cors.php';
include 'cors.php';
header('Content-Type: application/json');
session_start();


include 'config.php'; // Connexion à la base de données

// Récupérer les produits avec stock > 0
$stmt = $conn->prepare("SELECT * FROM components WHERE stock > 0");
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
$response = [];
$response['products'] = $products;
$response['message'] = "Products retrieved successfully";
$response['success'] = true;

// Le reste du code est pour l'affichage HTML, qui a été supprimé



echo json_encode($response);
