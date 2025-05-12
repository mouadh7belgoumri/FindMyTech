<?php
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
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - FindMyTech</title>
    <style>
        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: Poppins, sans-serif;
            background-color: #212026;
            color: #d9d9d9;
        }

        .container {
            display: flex;
            flex-direction: row;
            height: 100vh;
        }

        .form-container, .info-container {
            width: 50%;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .form-container {
            background-color: black;
            box-shadow: 0 0 15px black;
        }

        .info-container {
            background-color: #717171;
            box-shadow: 0 0 15px black;
            text-align: center;
        }

        .info-container h1 {
            font-size: 48px;
            color: white;
        }

        .info-container span {
            color: #2eabff;
        }

        form {
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
        }

        label {
            margin: 10px 0 5px;
        }

        input {
            padding: 10px;
            border-radius: 8px;
            border: none;
            width: 100%;
            margin-bottom: 15px;
        }

        .forgot {
            text-align: right;
            font-size: 12px;
            margin-bottom: 20px;
        }

        .forgot a {
            color: #d9d9d9;
            text-decoration: underline;
        }

        button {
            background-color: #717171;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        button:hover {
            background-color: #464646;
        }

        .error {
            color: red;
            margin-bottom: 10px;
            text-align: center;
        }

        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }

            .form-container, .info-container {
                width: 100%;
                height: 50vh;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="form-container">
        <h1>Welcome back</h1>
        <p>Please enter your details</p>
        <?php if (!empty($login_error)): ?>
            <div class="error"><?= htmlspecialchars($login_error) ?></div>
        <?php endif; ?>
        <form method="POST" action="login.php">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" required />

            <label for="password">Password</label>
            <input type="password" name="password" id="password" required />

            <div class="forgot">
                <a href="forgot.php">Forgot password?</a>
            </div>

            <button type="submit">Sign in</button>
        </form>
    </div>

    <div class="info-container">
        <h1><span>find</span>My<span>tech</span></h1>
        <h2>Hello user</h2>
        <p>Enter your personal details and start your journey with us</p>
        <a href="register.php">
            <button type="button">Sign up</button>
        </a>
    </div>
</div>

</body>
</html>