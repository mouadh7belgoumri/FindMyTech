<?php
session_start();

// Vérifier si le panier n'est pas vide
if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    header('Location: cart.php'); // Rediriger vers le panier si vide
    exit();
}

include 'config.php'; // Connexion à la base de données

// Récupérer la liste des wilayas depuis la base de données
$stmt_wilayas = $conn->prepare("SELECT * FROM wilayas ORDER BY nom_fr ASC");
$stmt_wilayas->execute();
$wilayas = $stmt_wilayas->fetchAll(PDO::FETCH_ASSOC);

// Initialiser les variables d'erreur
$errors = [];

// Traitement du formulaire de commande
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer et valider les informations
    $nom = htmlspecialchars(trim($_POST['nom']));
    $prenom = htmlspecialchars(trim($_POST['prenom']));
    $telephone = htmlspecialchars(trim($_POST['telephone']));
    $wilaya = htmlspecialchars(trim($_POST['wilaya']));
    $commune = htmlspecialchars(trim($_POST['commune']));
    $code_postal = htmlspecialchars(trim($_POST['code_postal']));
    $adresse = htmlspecialchars(trim($_POST['adresse']));
    $informations_supplementaires = htmlspecialchars(trim($_POST['informations_supplementaires']));

    // Validation simple (tu peux ajouter des validations plus robustes)
    if (empty($nom)) $errors['nom'] = "Le nom est requis.";
    if (empty($prenom)) $errors['prenom'] = "Le prénom est requis.";
    if (empty($telephone)) $errors['telephone'] = "Le numéro de téléphone est requis.";
    if (empty($wilaya)) $errors['wilaya'] = "La wilaya est requise.";
    if (empty($commune)) $errors['commune'] = "La commune est requise.";
    if (empty($code_postal)) $errors['code_postal'] = "Le code postal est requis.";
    if (empty($adresse)) $errors['adresse'] = "L'adresse est requise.";

    if (empty($errors)) {
        // Calculer le prix total de la commande
        $total_commande = 0;
        if (isset($_SESSION['cart'])) {
            foreach ($_SESSION['cart'] as $product_id => $quantity) {
                // Assurez-vous que $product_id et $quantity sont des nombres
                $product_id = intval($product_id);
                $quantity = intval($quantity);

                $stmt_product = $conn->prepare("SELECT price FROM components WHERE id = ?");
                $stmt_product->execute([$product_id]);
                if ($product = $stmt_product->fetch(PDO::FETCH_ASSOC)) {
                    // Assurez-vous que $product['price'] est un nombre
                    $price = floatval($product['price']);
                    $total_commande += $price * $quantity;
                }
            }
        }

        // Enregistrer la commande dans la base de données
        $stmt_commande = $conn->prepare("INSERT INTO commandes (user_id, nom, prenom, telephone, wilaya, commune, code_postal, adresse, informations_supplementaires, total, date_commande, statut_paiement, mode_livraison) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'à la livraison', 'livraison')");
        $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null; // Si l'utilisateur est connecté
        $stmt_commande->execute([$user_id, $nom, $prenom, $telephone, $wilaya, $commune, $code_postal, $adresse, $informations_supplementaires, $total_commande]);
        $commande_id = $conn->lastInsertId();

        // Enregistrer les détails de la commande (produits et quantités)
        foreach ($_SESSION['cart'] as $product_id => $quantity) {
            $product_id = intval($product_id);
            $quantity = intval($quantity);
            $stmt_details = $conn->prepare("INSERT INTO commande_details (commande_id, product_id, quantite) VALUES (?, ?, ?)");
            $stmt_details->execute([$commande_id, $product_id, $quantity]);

            // Optionnel: Mettre à jour le stock (à faire avec précaution pour éviter les problèmes de concurrence)
            // $stmt_update_stock = $conn->prepare("UPDATE components SET stock = stock - ? WHERE id = ?");
            // $stmt_update_stock->execute([$quantity, $product_id]);
        }

        // Vider le panier après la commande
        unset($_SESSION['cart']);

        // Rediriger vers la page d'accueil
        header('Location: index.php?order_success=' . $commande_id);
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Passer la Commande - Paiement à la Livraison</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* Styles spécifiques à la page de commande */
        .checkout-container {
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"],
        input[type="tel"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .error-message {
            color: red;
            font-size: 0.9em;
            margin-top: 5px;
        }
        button[type="submit"] {
            background-color: #007BFF;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
        }
        button[type="submit"]:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="checkout-container">
        <h2>Informations de Livraison</h2>
        <form method="POST" action="">
            <div class="form-group">
                <label for="nom">Nom:</label>
                <input type="text" id="nom" name="nom" value="<?= isset($_POST['nom']) ? $_POST['nom'] : '' ?>">
                <?php if (isset($errors['nom'])): ?>
                    <p class="error-message"><?= $errors['nom'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="prenom">Prénom:</label>
                <input type="text" id="prenom" name="prenom" value="<?= isset($_POST['prenom']) ? $_POST['prenom'] : '' ?>">
                <?php if (isset($errors['prenom'])): ?>
                    <p class="error-message"><?= $errors['prenom'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="telephone">Numéro de Téléphone:</label>
                <input type="tel" id="telephone" name="telephone" value="<?= isset($_POST['telephone']) ? $_POST['telephone'] : '' ?>">
                <?php if (isset($errors['telephone'])): ?>
                    <p class="error-message"><?= $errors['telephone'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="wilaya">Wilaya:</label>
                <select id="wilaya" name="wilaya">
                    <option value="">Sélectionner une wilaya</option>
                    <?php foreach ($wilayas as $wilaya_item): ?>
                        <option value="<?= $wilaya_item['nom_fr'] ?>" <?= (isset($_POST['wilaya']) && $_POST['wilaya'] === $wilaya_item['nom_fr']) ? 'selected' : '' ?>><?= $wilaya_item['nom_fr'] ?></option>
                    <?php endforeach; ?>
                </select>
                <?php if (isset($errors['wilaya'])): ?>
                    <p class="error-message"><?= $errors['wilaya'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="commune">Commune:</label>
                <input type="text" id="commune" name="commune" value="<?= isset($_POST['commune']) ? $_POST['commune'] : '' ?>">
                <?php if (isset($errors['commune'])): ?>
                    <p class="error-message"><?= $errors['commune'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="code_postal">Code Postal:</label>
                <input type="text" id="code_postal" name="code_postal" value="<?= isset($_POST['code_postal']) ? $_POST['code_postal'] : '' ?>">
                <?php if (isset($errors['code_postal'])): ?>
                    <p class="error-message"><?= $errors['code_postal'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="adresse">Adresse Exacte:</label>
                <textarea id="adresse" name="adresse" rows="4"><?= isset($_POST['adresse']) ? $_POST['adresse'] : '' ?></textarea>
                <?php if (isset($errors['adresse'])): ?>
                    <p class="error-message"><?= $errors['adresse'] ?></p>
                <?php endif; ?>
            </div>
            <div class="form-group">
                <label for="informations_supplementaires">Informations Supplémentaires (Optionnel):</label>
                <textarea id="informations_supplementaires" name="informations_supplementaires" rows="2"><?= isset($_POST['informations_supplementaires']) ? $_POST['informations_supplementaires'] : '' ?></textarea>
            </div>
            <button type="submit">Confirmer la Commande et Payer à la Livraison</button>
        </form>
    </div>
</body>
</html>