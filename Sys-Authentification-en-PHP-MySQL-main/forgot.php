<?php
session_start();
require 'config.php'; // Database connection using PDO
require 'vendor/autoload.php'; // PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$error = '';
$success = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        try {
            // Check if user exists in the database
            $stmt = $conn->prepare("SELECT id, First_Name, email FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                $error = "No user found with this email.";
            } else {
                // Generate token and set expiration time
                $token = bin2hex(random_bytes(32));
                $token_hash = hash("sha256", $token);
                $expires = date("Y-m-d H:i:s", time() + 60 * 30); // 30 minutes

                // Update user with token and expiration time
                $stmt = $conn->prepare("UPDATE users SET reset_token_hash = ?, reset_token_expires_at = ? WHERE email = ?");
                $stmt->execute([$token_hash, $expires, $email]);

                // Generate reset password link
                $reset_link = "http://localhost/Sys-Authentification-en-PHP-MySQL-main/reset_password.php?token=$token&email=" . urlencode($email); // Include email in the link

                // Send the reset email with PHPMailer
                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com'; // Your SMTP server
                    $mail->SMTPAuth = true;
                    $mail->Username = 'khaledhouari481@gmail.com'; // Your email
                    $mail->Password = 'toqd vepf xjfu lyzc'; // Your email password
                    $mail->SMTPSecure = 'ssl';
                    $mail->Port = 465;
                    $mail->CharSet = 'UTF-8';

                    // Sender and recipient
                    $mail->setFrom('khaledhouari481@gmail.com', 'FindMyTech');
                    $mail->addAddress($email); // Correction ici
                    $mail->isHTML(true);
                    $mail->Subject = 'Password Reset';
                    $mail->Body = "<p>Hello " . htmlspecialchars($user['First_Name']) . ",</p>";
                    $mail->Body .= "<p>Click the link below to reset your password. This link will expire in 30 minutes:</p>";
                    $mail->Body .= "<p><a href='" . htmlspecialchars($reset_link) . "'>" . htmlspecialchars($reset_link) . "</a></p>";
                    $mail->Body .= "<p>If you did not request a password reset, please ignore this email.</p>";
                    $mail->Body .= "<p>Best regards,<br>FindMyTech Team</p>";

                    $mail->send();
                    $success = "A password reset link has been sent to your email.";
                } catch (Exception $e) {
                    $error = "Mailer Error: " . $mail->ErrorInfo;
                }
            }
        } catch (PDOException $e) {
            $error = "Database error: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Forgot Password</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#212026]">
    <div class="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
        <div class="flex flex-col h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-black shadow-[0_0_15px_black]">
            <form method="POST" class="flex flex-col items-center justify-center w-full h-full content-center rounded-lg">
                <div class="leading-10">
                    <h1 class="text-5xl font-[700] font-Poppins text-center">Forgot Password</h1>
                    <p class="text-l text-center font text-center">Enter your email to reset your password</p>
                </div>

                <div class="flex flex-col w-full content-center items-center justify-center">
                    <div class="flex flex-col justify-center items-center content-center mt-10 w-full">
                        <div class="flex justify-start w-2/3">
                            <label for="email" class="text-[#d9d9D9]">Email</label>
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value="<?= htmlspecialchars($email ?? '') ?>"
                            aria-label="Email Address"
                            class="bg-white rounded-lg h-10 w-2/3
                                        text-black px-2"
                            required
                        />
                    </div>
                </div>

                <button type="submit" class="mt-10 w-fit bg-[#717171] rounded-md p-1 px-20 hover:cursor-pointer hover:bg-[#464646]">
                    Send link
                </button>

                <?php if ($error): ?>
                    <p class="text-red-500 mt-4"><?= htmlspecialchars($error) ?></p>
                <?php elseif ($success): ?>
                    <p class="text-green-500 mt-4"><?= htmlspecialchars($success) ?></p>
                <?php endif; ?>
            </form>
        </div>

        <div class="flex h-2/3 w-1/3 flex-col max-md:h-1/2 max-md:p-5 max-md:w-full content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
            <h1 class="mt-8 text-4xl font-serif">
                <span class="text-[#2eabff] capitalize">find</span>My<span class="text-[#2eabff] capitalize inline-block">tech</span>
            </h1>
            <h1 class="text-5xl font-[700] font-Poppins text-center">Hello user</h1>
            <p class="text-2xl font text-center w-3/4">Enter your email to receive a reset link and regain access to your account</p>
            <a href="login.php"> <button class="border-btn w-fit p-2 px-8 cursor-pointer">Sign in</button>
            </a>
            <div class="h-1/4"></div>
        </div>
    </div>
</body>
</html>