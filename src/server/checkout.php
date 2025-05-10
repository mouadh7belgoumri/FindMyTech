<?php
include 'cors.php';
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
