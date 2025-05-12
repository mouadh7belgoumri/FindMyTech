<?php
session_start();
include 'config.php';

$cart_items = $_SESSION['cart'] ?? [];
$total_price = 0;
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Votre Panier</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .cart-container {
            width: 80%;
            margin: auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        .total {
            font-weight: bold;
            text-align: right;
        }
        .button {
            display: inline-block;
            padding: 10px 15px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .remove-item-form {
            display: inline;
        }
    </style>
</head>
<body>
    <div class="cart-container">
        <h2>Votre Panier</h2>

        <?php if (empty($cart_items)): ?>
            <p>Votre panier est vide.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Nom du Produit</th>
                        <th>Prix Unitaire</th>
                        <th>Quantité</th>
                        <th>Prix Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($cart_items as $item): ?>
                        <tr>
                            <td><?= htmlspecialchars($item['name']) ?></td>
                            <td><?= htmlspecialchars($item['price']) ?> DZ</td>
                            <td>
                                <form method="POST" action="update_cart.php" style="display: inline;">
                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['id']) ?>">
                                    <input type="number" name="quantity" value="<?= htmlspecialchars($item['quantity']) ?>" min="1" style="width: 50px;">
                                    <button type="submit" name="update_quantity">Mettre à jour</button>
                                </form>
                            </td>
                            <td><?= htmlspecialchars($item['price'] * $item['quantity']) ?> DZ</td>
                            <td>
                                <form method="POST" action="remove_from_cart.php" class="remove-item-form">
                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['id']) ?>">
                                    <button type="submit">Supprimer</button>
                                </form>
                            </td>
                        </tr>
                        <?php $total_price += $item['price'] * $item['quantity']; ?>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="total">Prix Total :</td>
                        <td colspan="2" class="total"><?= htmlspecialchars($total_price) ?> DZ</td>
                    </tr>
                </tfoot>
            </table>
            <a href="checkout.php" class="button">Passer à la caisse</a>
        <?php endif; ?>

        <a href="index.php" class="button">Continuer vos achats</a>
    </div>
</body>
</html>