<?php
session_start();
include 'config.php';

// Vérifie que l'utilisateur est connecté et est un administrateur
if (!isset($_SESSION['user_id']) ) {
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

function getCommandeDetails($conn, $commande_id) {
    $req = $conn->prepare("SELECT cd.product_id, cd.quantite, p.name AS product_name 
                            FROM commande_details cd
                            JOIN products p ON cd.product_id = p.id
                            WHERE cd.commande_id = ?");
    $req->execute([$commande_id]);
    return $req->fetchAll(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Administration</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
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

        .order-details {
            display: none;
            padding: 10px;
            margin-top: 10px;
            background-color: #f9f9f9;
            border-left: 3px solid #337ab7;
            border-radius: 5px;
        }

        .order-details table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .order-details th,
        .order-details td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        .order-details th {
            background-color: #eee;
            color: #333;
        }
        .details-toggle {
            cursor: pointer;
            color: #337ab7;
            text-decoration: underline;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-semibold text-center text-gray-800 my-8">Administration</h1>

        <h2 class="text-2xl font-semibold text-gray-700 my-6">Ajouter un Produit</h2>
        <?php if (isset($add_message)) echo "<p class='text-center text-green-600'>$add_message</p>"; ?>
        <form method="POST" action="" class="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
            <div>
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nom du Produit</label>
                <input type="text" name="name" id="name" placeholder="Nom du Produit" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div>
                <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <input type="text" name="description" id="description" placeholder="Description" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div>
                <label for="category" class="block text-gray-700 text-sm font-bold mb-2">Catégorie</label>
                <input type="text" name="category" id="category" placeholder="Catégorie" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div>
                <label for="characteristics" class="block text-gray-700 text-sm font-bold mb-2">Caractéristiques</label>
                <input type="text" name="characteristics" id="characteristics" placeholder="Caractéristiques" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <div class="flex space-x-4">
                <div class="flex-1">
                    <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Prix</label>
                    <input type="number" step="0.01" name="price" id="price" placeholder="Prix" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex-1">
                    <label for="stock" class="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                    <input type="number" name="stock" id="stock" placeholder="Stock" required
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                </div>
            </div>
            <div>
                <label for="photo" class="block text-gray-700 text-sm font-bold mb-2">Chemin ou URL de la Photo</label>
                <input type="text" name="photo" id="photo" placeholder="Chemin ou URL de la Photo" required
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>
            <button type="submit" name="add_product" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Ajouter le Produit
            </button>
        </form>

        <h2 class="text-2xl font-semibold text-gray-700 my-6">Liste des Produits</h2>
        <?php if (isset($delete_message)) echo "<p class='text-center text-red-600'>$delete_message</p>"; ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ($products as $product): ?>
                <div class="product-card bg-white shadow-md rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-gray-800"><?= htmlspecialchars($product['name']) ?></h4>
                    <p class="text-gray-700"><?= htmlspecialchars($product['description']) ?></p>
                    <form method="POST" action="" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');" class="mt-4">
                        <input type="hidden" name="delete_id" value="<?= $product['id'] ?>">
                        <button type="submit" name="delete_product" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Supprimer
                        </button>
                    </form>
                    <a href="edit_product.php?id=<?= $product['id'] ?>" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
                        Modifier
                    </a>
                </div>
            <?php endforeach; ?>
        </div>

        <h2 class="text-2xl font-semibold text-gray-700 my-8">Gestion des Commandes</h2>

        <div class="table-responsive">
            <table class="min-w-full leading-normal shadow-md rounded-lg overflow-hidden bg-white">
                <thead class="bg-gray-200 text-gray-700">
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Nom</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Prénom</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Téléphone</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Wilaya</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Commune</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Code Postal</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Adresse</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Informations Supplémentaires</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Date de Commande</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Statut Paiement</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Mode Livraison</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Détails</th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <?php if (empty($commandes)): ?>
                        <tr>
                            <td colspan="14" class="px-5 py-5 border-b border-gray-200 text-sm">
                                <p class="text-gray-900 whitespace-no-wrap text-center">Aucune commande trouvée.</p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($commandes as $commande) : ?>
                            <tr>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-italic text-gray-800"><?= $commande['id'] ?></span></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['nom']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['prenom']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['telephone']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['wilaya']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['commune']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['code_postal']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['adresse']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['informations_supplementaires'] ?? 'N/A') ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= number_format($commande['total'], 2) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= $commande['date_commande'] ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['statut_paiement']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($commande['mode_livraison']) ?></td>
                                <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="details-toggle cursor-pointer text-blue-600 underline" data-commande-id="<?= $commande['id'] ?>">Afficher</span></td>
                            </tr>
                            <tr>
                                <td colspan="14" class="px-5 py-5 border-b border-gray-200 text-sm">
                                    <div class="order-details" id="order-details-<?= $commande['id'] ?>">
                                        <?php $details = getCommandeDetails($conn, $commande['id']); ?>
                                        <?php if (empty($details)) : ?>
                                            <p class="text-gray-900 whitespace-no-wrap">Aucun détail de commande trouvé.</p>
                                        <?php else : ?>
                                            <table class="min-w-full">
                                                <thead class="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Produit</th>
                                                        <th class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Quantité</th>
                                                        <th class="px-5 py-3 border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Nom du Produit</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white">
                                                    <?php foreach ($details as $detail) : ?>
                                                        <tr>
                                                            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-italic text-gray-800"><?= $detail['product_id'] ?></span></td>
                                                            <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= $detail['quantite'] ?></td>
                                                            <td class="px-5 py-5 border-b border-gray-200 text-sm"><?= htmlspecialchars($detail['product_name']) ?></td>
                                                        </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <nav aria-label="Page navigation" class="mt-4 flex justify-center">
            <ul class="inline-flex rounded-md shadow">
                <?php if ($page > 1) : ?>
                    <li class="page-item">
                        <a href="admin.php?page=<?= $page - 1 ?>" class="px-3 py-2 rounded-l-md text-blue-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-blue-700">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                <?php endif; ?>

                <?php for ($i = 1; $i <= $totalPages; $i++) : ?>
                    <li class="page-item <?= ($page == $i) ? 'active' : '' ?>">
                        <a href="admin.php?page=<?= $i ?>" class="px-3 py-2 text-blue-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-blue-700 <?= ($page == $i) ? 'bg-blue-500 text-white' : '' ?>">
                            <?= $i ?>
                        </a>
                    </li>
                <?php endfor; ?>

                <?php if ($page < $totalPages) : ?>
                    <li class="page-item">
                        <a href="admin.php?page=<?= $page + 1 ?>" class="px-3 py-2 rounded-r-md text-blue-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-blue-700">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                <?php endif; ?>
            </ul>
        </nav>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const detailToggles = document.querySelectorAll('.details-toggle');

            detailToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const commandeId = toggle.dataset.commandeId;
                    const detailsContainer = document.getElementById(`order-details-${commandeId}`);

                    if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
                        detailsContainer.style.display = 'block';
                        toggle.textContent = 'Cacher';
                    } else {
                        detailsContainer.style.display = 'none';
                        toggle.textContent = 'Afficher';
                    }
                });
            });
        });
    </script>
</body>
</html>
