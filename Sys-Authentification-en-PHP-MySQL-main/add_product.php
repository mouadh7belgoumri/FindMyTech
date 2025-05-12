<?php
session_start(); // Start the session
include 'config.php'; // Include the database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the user is logged in
    if (!isset($_SESSION['user_id'])) {
        die("Vous devez être connecté pour ajouter un produit.");
    }

    // Sanitize and validate inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $description = htmlspecialchars(trim($_POST['description']));
    $category = htmlspecialchars(trim($_POST['category']));
    $characteristics = htmlspecialchars(trim($_POST['characteristics']));
    $user_id = $_SESSION['user_id']; // Get user ID from session to use as seller_id
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $photo = htmlspecialchars(trim($_POST['photo'])); // Path to the photo

    // Prepare and execute the query
    $stmt = $conn->prepare("INSERT INTO components (name, description, category, characteristics, seller_id, price, stock, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if ($stmt->execute([$name, $description, $category, $characteristics, $user_id, $price, $stock, $photo])) {
        $message = "Produit ajouté avec succès !";
    } else {
        $message = "Erreur lors de l'ajout du produit : " . $stmt->errorInfo()[2];
    }
}
?>

<!-- HTML Form for Adding Product -->
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Ajouter un Produit</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="container">
        <h2>Ajouter un Produit</h2>
        <?php if (isset($message)) echo "<p>$message</p>"; ?>
        <form method="POST">
            <input type="text" name="name" placeholder="Nom du Produit" required>
            <input type="text" name="description" placeholder="Description" required>
            <input type="text" name="category" placeholder="Catégorie" required>
            <input type="text" name="characteristics" placeholder="Caractéristiques" required>
            <input type="number" step="0.01" name="price" placeholder="Prix" required>
            <input type="number" name="stock" placeholder="Stock" required>
            <input type="text" name="photo" placeholder="Chemin ou URL de la Photo" required>
            <button type="submit">Ajouter le Produit</button>
        </form>
    </div>
</body>

</html>