<?php
////include 'cors.php';
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
                    $mail->addAddress($email);
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
