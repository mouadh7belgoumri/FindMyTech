<?php
include 'config.php'; // Connexion à la base de données

// La session est déjà gérée dans le script principal
// session_start();

// Récupérer les produits avec stock > 0
$stmt = $conn->prepare("SELECT * FROM components WHERE stock > 0");
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des Produits</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        .search-form {
            text-align: center;
            margin-bottom: 20px;
        }
        .search-form input[type="text"] {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 70%;
            max-width: 400px;
        }
        .search-form button {
            padding: 10px 15px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .search-form button:hover {
            background-color: #0056b3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
            overflow: hidden;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        img {
            width: 80px;
            height: auto;
            display: block;
            margin: 0 auto;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .actions-container {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
        }
        .actions-container form {
            margin: 0;
        }
        .actions-container button, .actions-container a.button-link {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.9em;
        }
        .actions-container button {
            background-color: #dc3545;
            color: white;
        }
        .actions-container button:hover {
            background-color: #c82333;
        }
        .actions-container a.button-link {
            background-color: #007bff;
            color: white;
        }
        .actions-container a.button-link:hover {
            background-color: #0056b3;
        }
        .add-to-cart-form {
            display: flex;
            gap: 5px;
            align-items: center;
            margin-top: 10px;
            justify-content: center;
        }
        .add-to-cart-form input[type="number"] {
            width: 60px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .add-to-cart-form button {
            padding: 8px 12px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }
        .add-to-cart-form button:hover {
            background-color: #1e7e34;
        }
        .no-products {
            text-align: center;
            color: #777;
            padding: 20px;
        }
        .button-add-new {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 15px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .button-add-new:hover {
            background-color: #0056b3;
        }
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            opacity: 0.9;
            z-index: 1000;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Liste des Produits Disponibles</h2>

    <form method="GET" action="search.php" class="search-form">
        <input type="text" name="search" placeholder="Rechercher un produit..." required>
        <button type="submit">Rechercher</button>
    </form>

    <?php if (isset($_SESSION['cart_message'])): ?>
        <div class="cart-notification">
            <?= $_SESSION['cart_message'] ?>
        </div>
        <script>
            setTimeout(function(){
                document.querySelector('.cart-notification').style.display = 'none';
            }, 3000); // Faire disparaître après 3 secondes
        </script>
        <?php unset($_SESSION['cart_message']); ?>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Caractéristiques</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Photo</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (count($products) > 0): ?>
            <?php foreach ($products as $product): ?>
                <tr>
                    <td><?= htmlspecialchars($product['id']) ?></td>
                    <td><?= htmlspecialchars($product['name']) ?></td>
                    <td><?= htmlspecialchars($product['description']) ?></td>
                    <td><?= htmlspecialchars($product['category']) ?></td>
                    <td><?= htmlspecialchars($product['characteristics']) ?></td>
                    <td><?= htmlspecialchars($product['price']) ?> DZ</td>
                    <td><?= htmlspecialchars($product['stock']) ?></td>
                    <td>
                        <?php if (!empty($product['photo'])): ?>
                            <img src="<?= htmlspecialchars($product['photo']) ?>"
                                 alt="<?= htmlspecialchars($product['name']) ?>"
                                 onerror="this.onerror=null;this.src='images/default.jpg';">
                        <?php else: ?>
                            <img src="images/default.jpg" alt="No Image">
                        <?php endif; ?>
                    </td>
                    <td class="actions-container">
                        <form method="POST" action="delete_product.php" style="display:inline;">
                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                            <button type="submit">Supprimer</button>
                        </form>
                        <a href="edit_product.php?id=<?= htmlspecialchars($product['id']) ?>" class="button-link">Modifier</a>
                        <form method="POST" action="add_to_cart.php" class="add-to-cart-form">
                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                            <input type="number" name="quantity" value="1" min="1">
                            <button type="submit">Ajouter</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="9" class="no-products">Aucun produit trouvé.</td>
            </tr>
        <?php endif; ?>
        </tbody>
    </table>

    <a class="button-add-new" href="add_product.php">Ajouter un nouveau produit</a>
    <div style="margin-top: 20px; text-align: center;">
        <a class="button-add-new" href="cart.php">Voir le panier</a>
    </div>
</div>
</body>
</html>