<?php
// Utiliser la connexion de config.php au lieu de créer une nouvelle connexion
include 'config.php';
?>

<!DOCTYPE html>
<html>

<head>
    <title>Search Components</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background-color: whitesmoke;
        }

        input {
            width: 20%;
            height: 5%;
            border: 1px;
            border-radius: 5px;
            padding: 8px 15px 8px 15px;
            margin: 10px 0px 15px 0px;
            box-shadow: 1px 1px 2px 1px blue;
        }

        button {
            width: 8%;
            height: 5%;
            border: 1px;
            border-radius: 5px;
            padding: 8px 15px 8px 15px;
            margin: 10px 0px 15px 0px;
            box-shadow: 1px 1px 2px 1px blue;
        }

        table {
            border-collapse: collapse;
            width: 80%;
            border: 1px solid #d1d1d1;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #d1d1d1;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f1f1f1;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #e3f2fd;
        }
    </style>
</head>

<body>
    <h1>Search Components</h1>
    <div class="container my-5">
        <?php if (!isset($_GET['search']) || empty($_GET['search'])): ?>
            <p>Veuillez entrer un terme de recherche dans la barre de recherche de la page d'accueil.</p>
            <a href="index.php">Retour à l'accueil</a>
        <?php else: ?>
            <h2>Résultats de la recherche pour "<?= htmlspecialchars($_GET['search']) ?>"</h2>
            <table class="table">
                <?php
                $search = $_GET['search'];

                // Utiliser la préparation de requête avec PDO pour éviter les injections SQL
                $sql = "SELECT id, category, name, description, price FROM components 
                        WHERE name LIKE :search_name 
                        OR description LIKE :search_desc 
                        OR category LIKE :search_cat";

                $stmt = $conn->prepare($sql);
                $searchParam = "%$search%";
                $stmt->bindParam(':search_name', $searchParam, PDO::PARAM_STR);
                $stmt->bindParam(':search_desc', $searchParam, PDO::PARAM_STR);
                $stmt->bindParam(':search_cat', $searchParam, PDO::PARAM_STR);
                $stmt->execute();

                // Récupérer les résultats
                $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($stmt && count($results) > 0) {
                    echo '<thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                            </thead>';
                    echo '<tbody>';
                    foreach ($results as $row) {
                        echo '<tr>
                                <td>' . $row['id'] . '</td>
                                <td><a href="component_details.php?id=' . $row['id'] . '">' . htmlspecialchars($row['name']) . '</a></td>
                                <td>' . htmlspecialchars($row['description']) . '</td>
                                <td>' . htmlspecialchars($row['price']) . '</td>
                                <td><a href="edit_component.php?id=' . $row['id'] . '">Edit</a> | <a href="delete_component.php?id=' . $row['id'] . '">Delete</a></td>
                              </tr>';
                    }
                    echo '</tbody>';
                } else {
                    echo '<p>Aucun composant trouvé correspondant à votre recherche.</p>';
                }
                ?>
            </table>
            <a href="index.php">Retour à l'accueil</a>
        <?php endif; ?>
    </div>
</body>

</html>