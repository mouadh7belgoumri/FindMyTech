<?php
////include 'cors.php';
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'] ?? null;
    $quantity = $_POST['quantity'] ?? 1;

    if ($product_id) {
        // Vérifier si le produit existe et a du stock (sécurité supplémentaire)
        $stmt = $conn->prepare("SELECT id, name, price, stock FROM components WHERE id = :id AND stock > 0");
        $stmt->bindParam(':id', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            if (!isset($_SESSION['cart'])) {
                $_SESSION['cart'] = [];
            }

            if (isset($_SESSION['cart'][$product_id])) {
                $_SESSION['cart'][$product_id]['quantity'] += $quantity;
            } else {
                $_SESSION['cart'][$product_id] = [
                    'id' => $product['id'],
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'quantity' => $quantity
                ];
            }
            $_SESSION['cart_message'] = "Produit ajouté au panier !";
        } else {
            $_SESSION['cart_message'] = "Le produit n'est plus disponible ou n'existe pas.";
        }
    } else {
        $_SESSION['cart_message'] = "ID de produit invalide.";
    }

    header('Location: ' . $_SERVER['HTTP_REFERER']); // Rediriger l'utilisateur vers la page précédente
    exit();
} else {
    // Si on accède à ce fichier par GET, rediriger vers la page d'accueil ou des produits
    header('Location: index.php');
    exit();
}
