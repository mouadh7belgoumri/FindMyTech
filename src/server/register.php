<?php
include 'cors.php';
session_start();
require 'config.php'; // Connexion à la base de données

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (
        isset($_POST['first_name'], $_POST['last_name'], $_POST['email'], $_POST['password'], $_POST['confirm_password'])
    ) {
        $first_name = trim($_POST['first_name']);
        $last_name = trim($_POST['last_name']);
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);
        $confirm_password = trim($_POST['confirm_password']);

        if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
            $error = "All fields are required.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = "Invalid email address.";
        } elseif (strlen($password) < 8) {
            $error = "Password must be at least 8 characters.";
        } elseif ($password !== $confirm_password) {
            $error = "Passwords do not match.";
        } else {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->execute([':email' => $email]);
            if ($stmt->rowCount() > 0) {
                $error = "Email already exists.";
            } else {
                $sql = "INSERT INTO users (First_Name, Last_Name, email, password) 
                        VALUES (:first_name, :last_name, :email, :password)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([
                    ':first_name' => $first_name,
                    ':last_name' => $last_name,
                    ':email' => $email,
                    ':password' => password_hash($password, PASSWORD_DEFAULT)
                ]);
                $_SESSION['success_message'] = "Registration successful!";
                header("Location: login.php");
                exit;
            }
        }
    } else {
        $error = "Invalid form submission.";
    }
}
