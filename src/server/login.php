<?php
include 'cors.php';
session_start();
require 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

$login_error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_SESSION['login_attempts'] >= 5) {
        $login_error = "Too many login attempts. Try again later.";
    } else {
        $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
        $password = trim($_POST['password']);

        if ($email && $password) {
            $stmt = $conn->prepare("SELECT id, First_Name, Last_Name, password FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['First_Name'] = $user['First_Name'];
                $_SESSION['Last_Name'] = $user['Last_Name'];
                $_SESSION['login_attempts'] = 0;

                if ($email === 'k_houari@estin.dz') {
                    header("Location: admin.php");
                    exit();
                } else {
                    header("Location: index.php");
                    exit();
                }
            } else {
                $_SESSION['login_attempts']++;
                $login_error = "Incorrect email or password.";
            }
        } else {
            $login_error = "Please fill out all fields correctly.";
        }
    }
}
