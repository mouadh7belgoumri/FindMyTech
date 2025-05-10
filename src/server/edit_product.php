<?php
include 'cors.php';
include 'config.php'; // Connexion à la base de données

// Vérifier si un ID est passé en GET
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die('ID du produit manquant.');
}

$id = (int) $_GET['id'];

// Récupérer le produit
$stmt = $conn->prepare("SELECT * FROM components WHERE id = ?");
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    die('Produit non trouvé.');
}

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $description = $_POST['description'];
    $category = $_POST['category'];
    $characteristics = $_POST['characteristics'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];

    $update = $conn->prepare("UPDATE components SET name = ?, description = ?, category = ?, characteristics = ?, price = ?, stock = ? WHERE id = ?");
    $update->execute([$name, $description, $category, $characteristics, $price, $stock, $id]);

    if ($update->rowCount() > 0) {
        header("Location: products.php?message=Produit modifié avec succès");
        exit();
    } else {
        $errorInfo = $update->errorInfo();
        if ($errorInfo[0] !== '00000') {
            die("Erreur lors de la mise à jour du produit : " . $errorInfo[2]);
        } else {
            header("Location: products.php?message=Aucune modification apportée au produit");
            exit();
        }
    }
}
