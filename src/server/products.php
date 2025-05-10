<?php
include 'cors.php';
include 'config.php'; // Connexion à la base de données

// Récupérer les produits avec stock > 0
$stmt = $conn->prepare("SELECT * FROM components WHERE stock > 0");
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Le reste du code est pour l'affichage HTML, qui a été supprimé
