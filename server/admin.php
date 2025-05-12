<?php
////include 'cors.php';
session_start();
include 'config.php';

// Vérifie que l'utilisateur est connecté et est un administrateur
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Traitement de l'ajout de produit
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_product'])) {
    // Sanitize and validate inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $description = htmlspecialchars(trim($_POST['description']));
    $category = htmlspecialchars(trim($_POST['category']));
    $characteristics = htmlspecialchars(trim($_POST['characteristics']));
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $photo = htmlspecialchars(trim($_POST['photo'])); // Path to the photo

    // Prepare and execute the query
    $stmt = $conn->prepare("INSERT INTO components (name, description, category, characteristics, seller_id, price, stock, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if ($stmt->execute([$name, $description, $category, $characteristics, $_SESSION['user_id'], $price, $stock, $photo])) {
        $add_message = "Produit ajouté avec succès !";
    } else {
        $add_message = "Erreur lors de l'ajout du produit : " . $stmt->errorInfo()[2];
    }
}

// Traitement de la suppression de produit
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['delete_product'])) {
    $product_id = intval($_POST['delete_id']);
    $stmt = $conn->prepare("DELETE FROM components WHERE id = ?");
    if ($stmt->execute([$product_id])) {
        $delete_message = "Produit supprimé avec succès.";
    } else {
        $delete_message = "Erreur lors de la suppression : " . $stmt->errorInfo()[2];
    }
}

// Récupérer les produits
$stmt = $conn->prepare("SELECT * FROM components");
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);


// commandes.php variables and functions
$commandesParPage = 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$debut = ($page > 1) ? ($page * $commandesParPage) - $commandesParPage : 0;

$totalCommandesReq = $conn->query("SELECT COUNT(*) as total FROM commandes");
$totalCommandesFetch = $totalCommandesReq->fetch(PDO::FETCH_ASSOC);
$totalCommandes = $totalCommandesFetch['total'];
$totalPages = ceil($totalCommandes / $commandesParPage);

$req = $conn->prepare("SELECT * FROM commandes ORDER BY date_commande DESC LIMIT :debut, :commandesParPage");
$req->bindValue(':debut', $debut, PDO::PARAM_INT);
$req->bindValue(':commandesParPage', $commandesParPage, PDO::PARAM_INT);
$req->execute();
$commandes = $req->fetchAll(PDO::FETCH_ASSOC);

function getCommandeDetails($conn, $commande_id)
{
    $req = $conn->prepare("SELECT cd.product_id, cd.quantite, p.name AS product_name 
                            FROM commande_details cd
                            JOIN products p ON cd.product_id = p.id
                            WHERE cd.commande_id = ?");
    $req->execute([$commande_id]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
