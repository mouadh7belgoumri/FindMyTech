<?php
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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - FindMyTech</title>
    <style>
        body {
            margin: 0;
            background-color: #212026;
            font-family: 'Poppins', sans-serif;
            color: white;
        }
        .container {
            display: flex;
            height: 100vh;
            justify-content: center;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .card {
            background-color: #717171;
            box-shadow: 0 0 15px black;
            padding: 30px;
            border-radius: 10px;
            width: 350px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .form-container {
            background-color: black;
            box-shadow: 0 0 15px black;
            padding: 30px;
            border-radius: 10px;
            width: 400px;
            color: white;
        }
        input {
            width: 100%;
            height: 35px;
            padding: 5px;
            border-radius: 5px;
            border: none;
            margin-top: 5px;
            margin-bottom: 15px;
            font-size: 16px;
            color: black;
        }
        label {
            font-size: 14px;
        }
        button {
            background-color: #717171;
            color: white;
            padding: 10px 40px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        button:hover {
            background-color: #464646;
        }
        h1, h2 {
            margin: 10px 0;
        }
        .error {
            color: #ff6b6b;
            margin-bottom: 10px;
        }
        .back {
            text-align: left;
            width: 100%;
            font-size: 20px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="card">
        <div class="back"><a href="index.php" style="text-decoration:none; color:white;">← Back</a></div>
        <h1><span style="color:#2eabff">find</span>My<span style="color:#2eabff">tech</span></h1>
        <h2>Welcome back</h2>
        <p>Login to continue your journey with us</p>
        <a href="login.php"><button>Sign In</button></a>
    </div>

    <div class="form-container">
        <form method="POST">
            <h2>Hello User</h2>
            <p>Please enter your details</p>
            <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
            <label for="first_name">First Name</label>
            <input type="text" name="first_name" required>

            <label for="last_name">Last Name</label>
            <input type="text" name="last_name" required>

            <label for="email">Email</label>
            <input type="email" name="email" required>

            <label for="password">Password</label>
            <input type="password" name="password" required>
            <small>Password must be at least 8 characters</small>

            <label for="confirm_password">Confirm Password</label>
            <input type="password" name="confirm_password" required>

            <button type="submit">Sign Up</button>
        </form>
    </div>
</div>

</body>
</html>
