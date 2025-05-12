<?php
//include 'cors.php';
session_start();

// Inclure le fichier de connexion à la base de données en utilisant PDO
require 'config.php';

// Récupérer le token depuis la requête GET
$token = $_GET['token'] ?? '';

// Variables pour contrôler l'affichage du formulaire et les messages
$showForm = false;
$error = '';
$success = '';

// Vérifier si un token est présent dans l'URL
if ($token) {
    // Hasher le token pour la comparaison avec la base de données
    $token_hash = hash("sha256", $token);

    // Préparer la requête SQL pour rechercher l'utilisateur avec ce token
    $sql = "SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?";
    $stmt = $conn->prepare($sql);

    // Vérifier si la préparation de la requête a réussi
    if ($stmt) {
        // Lier le paramètre (le hash du token) à la requête
        $stmt->bindParam(1, $token_hash);

        // Exécuter la requête
        $stmt->execute();

        // Récupérer la première ligne du résultat (l'utilisateur)
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier si un utilisateur a été trouvé et si le token n'a pas expiré
        if ($user && strtotime($user['reset_token_expires_at']) > time()) {
            // Afficher le formulaire de réinitialisation du mot de passe
            $showForm = true;
        } else {
            // Le token est invalide ou a expiré
            $error = "Le lien de réinitialisation est invalide ou a expiré.";
        }

        // Fermer le curseur
        $stmt->closeCursor();
    } else {
        // Erreur lors de la préparation de la requête SQL
        $error = "Une erreur s'est produite lors de la vérification du lien.";
        error_log("Erreur de préparation SQL (vérification lien) : " . print_r($conn->errorInfo(), true));
    }
} else {
    // Aucun token n'a été fourni dans l'URL
    $error = "Aucun lien de réinitialisation n'a été fourni.";
}

// Traitement de la soumission du nouveau mot de passe
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'], $_POST['token'])) {
    // Récupérer le nouveau mot de passe et le token depuis le formulaire
    $password = $_POST['password'];
    $token = $_POST['token'];
    $token_hash = hash("sha256", $token);

    // Préparer la requête SQL pour rechercher l'utilisateur avec ce token (pour la sécurité)
    $sql = "SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?";
    $stmt = $conn->prepare($sql);

    // Vérifier si la préparation de la requête a réussi
    if ($stmt) {
        // Lier le paramètre (le hash du token) à la requête
        $stmt->bindParam(1, $token_hash);

        // Exécuter la requête
        $stmt->execute();

        // Récupérer la première ligne du résultat (l'utilisateur)
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier à nouveau si un utilisateur a été trouvé et si le token n'a pas expiré
        if ($user && strtotime($user['reset_token_expires_at']) > time()) {
            // Hasher le nouveau mot de passe avant de l'enregistrer
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            // Préparer la requête SQL pour mettre à jour le mot de passe et annuler le token
            $sql_update = "UPDATE users SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?";
            $stmt_update = $conn->prepare($sql_update);

            // Vérifier si la préparation de la requête de mise à jour a réussi
            if ($stmt_update) {
                // Lier les paramètres (le hash du nouveau mot de passe et l'ID de l'utilisateur)
                $stmt_update->bindParam(1, $password_hash);
                $stmt_update->bindParam(2, $user['id'], PDO::PARAM_INT);

                // Exécuter la requête de mise à jour
                $stmt_update->execute();

                // Vérifier si la mise à jour a réussi
                if ($stmt_update->rowCount() > 0) {
                    $success = "Votre mot de passe a été réinitialisé avec succès.";
                    $showForm = false; // Ne plus afficher le formulaire
                } else {
                    $error = "Une erreur s'est produite lors de la mise à jour du mot de passe.";
                    error_log("Erreur de mise à jour du mot de passe : " . print_r($stmt_update->errorInfo(), true));
                }

                // Fermer le curseur
                $stmt_update->closeCursor();
            } else {
                // Erreur lors de la préparation de la requête de mise à jour
                $error = "Une erreur s'est produite lors de la tentative de réinitialisation.";
                error_log("Erreur de préparation SQL (mise à jour) : " . print_r($conn->errorInfo(), true));
            }
        } else {
            // Le token est invalide ou a expiré
            $error = "Le lien de réinitialisation est invalide ou a expiré.";
        }

        // Fermer le curseur
        $stmt->closeCursor();
    } else {
        // Erreur lors de la préparation de la requête SQL (pour la recherche de l'utilisateur)
        $error = "Une erreur s'est produite lors de la vérification du lien.";
        error_log("Erreur de préparation SQL (vérification lien) : " . print_r($conn->errorInfo(), true));
    }
}
