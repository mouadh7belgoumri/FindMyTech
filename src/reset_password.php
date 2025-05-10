<?php
include 'cors.php';
session_start();
require 'config.php';
require 'vendor/autoload.php'; // For PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Check if it's a POST request for token validation or password reset
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data (support both form data and JSON)
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }
    
    // Check if this is a password reset request
    if (isset($input['token']) && isset($input['password'])) {
        try {
            $token = $input['token'];
            $password = $input['password'];
            $token_hash = hash("sha256", $token);
            
            // Validate password
            if (strlen($password) < 8) {
                echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
                exit;
            }
            
            // Find user with this token
            $stmt = $conn->prepare("SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?");
            $stmt->execute([$token_hash]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user || strtotime($user['reset_token_expires_at']) <= time()) {
                echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token']);
                exit;
            }
            
            // Update password and clear token
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $update_stmt = $conn->prepare("UPDATE users SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?");
            $update_result = $update_stmt->execute([$password_hash, $user['id']]);
            
            if ($update_result) {
                echo json_encode(['success' => true, 'message' => 'Password has been reset successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to reset password']);
            }
        } catch (PDOException $e) {
            error_log("Password reset error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'An error occurred during password reset']);
        }
        exit;
    }
    
    // Check if this is a token request (forgot password)
    if (isset($input['email'])) {
        $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
        
        if (!$email) {
            echo json_encode(['success' => false, 'message' => 'Invalid email address']);
            exit;
        }
        
        try {
            // Check if user exists
            $stmt = $conn->prepare("SELECT id, First_Name FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                // For security, don't reveal that the email doesn't exist
                echo json_encode(['success' => true, 'message' => 'If your email exists in our system, you will receive a password reset link']);
                exit;
            }
            
            // Generate token and set expiration
            $token = bin2hex(random_bytes(32));
            $token_hash = hash("sha256", $token);
            $expires = date("Y-m-d H:i:s", time() + 60 * 30); // 30 minutes
            
            // Update user with token
            $update_stmt = $conn->prepare("UPDATE users SET reset_token_hash = ?, reset_token_expires_at = ? WHERE id = ?");
            $update_result = $update_stmt->execute([$token_hash, $expires, $user['id']]);
            
            if (!$update_result) {
                echo json_encode(['success' => false, 'message' => 'Failed to generate reset token']);
                exit;
            }
            
            // Generate reset link
            $app_url = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:3000';
            $reset_link = "$app_url/reset_password?token=$token";
            
            // Send email with PHPMailer
            $mail = new PHPMailer(true);
            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com'; // Your SMTP server
                $mail->SMTPAuth = true;
                $mail->Username = 'your-email@gmail.com'; // Your email
                $mail->Password = 'your-app-password'; // Your email password or app password
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;
                $mail->CharSet = 'UTF-8';
                
                // Recipients
                $mail->setFrom('your-email@gmail.com', 'FindMyTech');
                $mail->addAddress($email);
                
                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Password Reset';
                $mail->Body = "<p>Hello " . htmlspecialchars($user['First_Name']) . ",</p>";
                $mail->Body .= "<p>Click the link below to reset your password. This link will expire in 30 minutes:</p>";
                $mail->Body .= "<p><a href='" . htmlspecialchars($reset_link) . "'>" . htmlspecialchars($reset_link) . "</a></p>";
                $mail->Body .= "<p>If you did not request a password reset, please ignore this email.</p>";
                $mail->Body .= "<p>Best regards,<br>FindMyTech Team</p>";
                
                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Password reset link has been sent to your email']);
            } catch (Exception $e) {
                error_log("Mailer error: " . $mail->ErrorInfo);
                echo json_encode(['success' => false, 'message' => 'Failed to send password reset email']);
            }
        } catch (PDOException $e) {
            error_log("Password reset request error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'An error occurred during password reset request']);
        }
        exit;
    }
    
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

// GET request to validate token
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $token = $_GET['token'];
    $token_hash = hash("sha256", $token);
    
    try {
        $stmt = $conn->prepare("SELECT id, reset_token_expires_at FROM users WHERE reset_token_hash = ?");
        $stmt->execute([$token_hash]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && strtotime($user['reset_token_expires_at']) > time()) {
            echo json_encode(['success' => true, 'message' => 'Valid reset token', 'valid' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid or expired reset token', 'valid' => false]);
        }
    } catch (PDOException $e) {
        error_log("Token validation error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'An error occurred during token validation', 'valid' => false]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request']);
