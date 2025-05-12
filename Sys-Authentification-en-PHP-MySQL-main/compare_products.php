<?php
session_start();
include 'config.php';
include 'Gemini.php'; // Fichier de la classe Gemini

// Récupérer la liste des produits
$query = $conn->query("SELECT id, name FROM components");
$products = $query->fetchAll(PDO::FETCH_ASSOC);

// Traitement du formulaire
$comparisonResult = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product1_id = $_POST['product1'] ?? null;
    $product2_id = $_POST['product2'] ?? null;

    if ($product1_id && $product2_id && $product1_id !== $product2_id) {
        // Récupérer les détails des produits
        $stmt = $conn->prepare("SELECT name, description, category, characteristics, price FROM components WHERE id IN (?, ?)");
        $stmt->execute([$product1_id, $product2_id]);
        $productData = $stmt->fetchAll();

        if (count($productData) == 2) {
            $prompt = "Voici deux produits électroniques :\n";
            foreach ($productData as $index => $p) {
                $prompt .= "Produit " . ($index + 1) . " :\n";
                $prompt .= "Nom : " . $p['name'] . "\n";
                $prompt .= "Description : " . $p['description'] . "\n";
                $prompt .= "Catégorie : " . $p['category'] . "\n";
                $prompt .= "Caractéristiques : " . $p['characteristics'] . "\n";
                $prompt .= "Prix : " . $p['price'] . "DA\n\n";
            }
            $prompt .= "Fais une comparaison claire et simple entre ces deux produits. Conclue en disant lequel semble le meilleur rapport qualité/prix.";

            // Utiliser Gemini
            $gemini = new Gemini();

            $comparisonResult = $gemini->generate($prompt);

        } else {
            $comparisonResult = "Produits non trouvés.";
        }
    } else {
        $comparisonResult = "Veuillez choisir deux produits différents.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Comparer des Produits</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">
    <h1 class="mt-4">Comparer des Produits</h1>

    <form method="POST" class="my-4">
        <div class="mb-3">
            <label for="product1" class="form-label">Produit 1 :</label>
            <select name="product1" id="product1" class="form-select" required>
                <option value="">-- Choisir un produit --</option>
                <?php foreach ($products as $product): ?>
                    <option value="<?= $product['id'] ?>"><?= htmlspecialchars($product['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="mb-3">
            <label for="product2" class="form-label">Produit 2 :</label>
            <select name="product2" id="product2" class="form-select" required>
                <option value="">-- Choisir un produit --</option>
                <?php foreach ($products as $product): ?>
                    <option value="<?= $product['id'] ?>"><?= htmlspecialchars($product['name']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Comparer</button>
    </form>

    <?php if (!empty($comparisonResult)): ?>
        <div class="alert alert-info mt-4">
            <h4>Résultat de la comparaison :</h4>
            <p><?= nl2br(htmlspecialchars($comparisonResult)) ?></p>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
