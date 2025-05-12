<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accueil</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>Bienvenue sur notre site</h1>

        <?php if (isset($_SESSION['user_id'])): ?>
            
            <a href="logout.php" class="btn btn-danger">Se déconnecter</a>
        <?php else: ?>
            <p>Veuillez vous inscrire ou vous connecter pour continuer.</p>
            <a href="register.php" class="btn btn-primary">S'inscrire</a>
            <a href="login.php" class="btn btn-success">Se connecter</a>
        <?php endif; ?>

        <h2>Fonctionnalités</h2>

        <?php if (isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'Seller'): ?>
            <a href="add_product.php" class="btn btn-primary">Ajouter un Produit</a>
        <?php endif; ?>

        <a href="compare_products.php" class="btn btn-secondary">Comparer des Produits</a>

        <form method="GET" action="search.php" style="margin-top: 20px;">
            <input type="text" name="search" placeholder="Rechercher des produits..." required>
            <button type="submit">Rechercher</button>
        </form>

        <h2>Produits Disponibles</h2>
        <?php include 'products.php'; ?>
    </div>
</body>
</html>
