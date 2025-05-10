<?php
include 'cors.php';
session_start();
include 'config.php';

// Vérifie que l'utilisateur est un vendeur connecté
if (!isset($_SESSION['user_id'])) {
    die("Accès refusé.");
}

// Supprimer le produit si demande confirmée
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['delete_id'])) {
    $product_id = intval($_POST['delete_id']);
    $stmt = $conn->prepare("DELETE FROM components WHERE id = ? AND user_id = ?");
    if ($stmt->execute([$product_id, $_SESSION['user_id']])) {
        $message = "Produit supprimé avec succès.";
    } else {
        $message = "Erreur lors de la suppression : " . $stmt->errorInfo()[2];
    }
}

// Récupérer les produits du vendeur
$stmt = $conn->prepare("SELECT * FROM components WHERE user_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
