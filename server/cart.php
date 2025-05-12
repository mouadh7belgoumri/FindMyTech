<?php
////include 'cors.php';
session_start();
include 'config.php';

$cart_items = $_SESSION['cart'] ?? [];
$total_price = 0;

// Calculate total price
if (!empty($cart_items)) {
    foreach ($cart_items as $item) {
        $total_price += $item['price'] * $item['quantity'];
    }
}
