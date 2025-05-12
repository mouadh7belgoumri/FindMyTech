<?php
session_start();
include 'config.php';

// Vérifie que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    die("Accès refusé. Vous devez être connecté.");
}

// Supprimer le produit si demande confirmée
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['delete_id'])) {
    $product_id = intval($_POST['delete_id']);
    $stmt = $conn->prepare("DELETE FROM components WHERE id = ? AND seller_id = ?");
    if ($stmt->execute([$product_id, $_SESSION['user_id']])) {
        $message = "Produit supprimé avec succès.";
    } else {
        $message = "Erreur lors de la suppression : " . $stmt->errorInfo()[2];
    }
}

// Récupérer les produits de l'utilisateur
$stmt = $conn->prepare("SELECT * FROM components WHERE seller_id = ?");
$stmt->execute([$_SESSION['user_id']]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Gérer mes produits</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .product-card {
            border: 1px solid #ccc;
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
        }

        .confirm-delete {
            display: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Mes Produits</h2>
        <?php if (isset($message)) echo "<p>$message</p>"; ?>

        <?php foreach ($products as $product): ?>
            <div class="product-card">
                <h4><?= htmlspecialchars($product['name']) ?></h4>
                <p><?= htmlspecialchars($product['description']) ?></p>
                <form method="POST" onsubmit="return confirmDelete(this);">
                    <input type="hidden" name="delete_id" value="<?= $product['id'] ?>">
                    <button type="submit" class="btn btn-danger">Supprimer</button>
                </form>
            </div>
        <?php endforeach; ?>
    </div>

    <script>
        function confirmDelete(form) {
            return confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
        }
    </script>
</body>

</html>