<?php
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
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier Produit</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

<div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
    <h2 class="text-3xl font-bold mb-8 text-center text-indigo-600">Modifier le Produit</h2>

    <form method="POST" class="space-y-6">
        <div>
            <label class="block text-gray-700">Nom du produit</label>
            <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" required
                   class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
            <label class="block text-gray-700">Description</label>
            <textarea name="description" required
                      class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><?= htmlspecialchars($product['description']) ?></textarea>
        </div>

        <div>
            <label class="block text-gray-700">Catégorie</label>
            <input type="text" name="category" value="<?= htmlspecialchars($product['category']) ?>" required
                   class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
            <label class="block text-gray-700">Caractéristiques</label>
            <textarea name="characteristics"
                      class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><?= htmlspecialchars($product['characteristics']) ?></textarea>
        </div>

        <div class="flex gap-4">
            <div class="w-1/2">
                <label class="block text-gray-700">Prix (DZ)</label>
                <input type="number" step="0.01" name="price" value="<?= htmlspecialchars($product['price']) ?>" required
                       class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>

            <div class="w-1/2">
                <label class="block text-gray-700">Stock</label>
                <input type="number" name="stock" value="<?= htmlspecialchars($product['stock']) ?>" required
                       class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
        </div>

        <div class="flex justify-between items-center mt-8">
            <a href="index.php"
               class="text-indigo-600 hover:text-indigo-800 font-semibold">← Retour</a>

            <button type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                Enregistrer
            </button>
        </div>
    </form>
</div>

</body>
</html>