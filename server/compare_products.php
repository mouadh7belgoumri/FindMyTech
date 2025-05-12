<?php
include 'cors.php';
header('Content-Type: application/json');

session_start();
include 'config.php';
include 'Gemini.php'; // Fichier de la classe Gemini

// Récupérer la liste des produits
$query = $conn->query("SELECT id, name FROM components");
$products = $query->fetchAll(PDO::FETCH_ASSOC);
$response = [];
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
            
            $response = [
                'success' => true,
                'message' => 'Comparaison réussie',
                'data' => $comparisonResult
            ];
        } else {
            $comparisonResult = "Produits non trouvés.";
            $response = [
                'success' => false,
                'message' => $comparisonResult
            ];
        }
    } else {   
        $comparisonResult = "Veuillez choisir deux produits différents.";
        $response = [
            'success' => false,
            'message' => $comparisonResult,
            '$product1_id' => $product1_id,
            '$product2_id' => $product2_id
        ];
    }
}


echo json_encode($response);
