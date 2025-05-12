<?php
//include 'cors.php';
$servername = "localhost";
$username = "root";
$password = "";
$database = "auth_system"; // Remplace par le nom de ta base de données
$port = 4306; // Port par défaut pour MySQL
$con = new mysqli($servername, $username, $password, $database);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

// Traitement de la recherche
if (isset($_GET['search']) && !empty($_GET['search'])) {
    $search = $con->real_escape_string($_GET['search']);
    $sql = "SELECT id, category, name, description, price FROM components WHERE name LIKE '%$search%' OR description LIKE '%$search%' OR category LIKE '%$search%'";
    $result = mysqli_query($con, $sql);

    // Le reste du code est pour l'affichage HTML, qui a été supprimé
}

mysqli_close($con);
