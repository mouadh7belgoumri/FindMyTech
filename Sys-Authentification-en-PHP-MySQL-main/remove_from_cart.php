<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_id'])) {
    $product_id_to_remove = $_POST['product_id'];
    if (isset($_SESSION['cart'][$product_id_to_remove])) {
        unset($_SESSION['cart'][$product_id_to_remove]);
        $_SESSION['cart_message'] = "Produit supprimé du panier.";
    }
}

header('Location: cart.php');
exit();
?>