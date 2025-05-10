<?php
include 'cors.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id']) && isset($_POST['quantity'])) {
    $product_id_to_update = $_POST['product_id'];
    $new_quantity = max(1, intval($_POST['quantity'])); // Assurer une quantité minimale de 1

    if (isset($_SESSION['cart'][$product_id_to_update])) {
        $_SESSION['cart'][$product_id_to_update]['quantity'] = $new_quantity;
        $_SESSION['cart_message'] = "Quantité du panier mise à jour.";
    }
}

header('Location: cart.php');
exit();
