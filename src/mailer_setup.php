<?php
/*
PHP Mailer Setup Guide

1. Install PHP Mailer via Composer:
   composer require phpmailer/phpmailer

2. If you don't have Composer, download PHPMailer from GitHub:
   https://github.com/PHPMailer/PHPMailer

3. Include the necessary files:
   require 'vendor/autoload.php'; // If installed via Composer
   // OR
   require 'path/to/PHPMailer/src/Exception.php';
   require 'path/to/PHPMailer/src/PHPMailer.php';
   require 'path/to/PHPMailer/src/SMTP.php';

4. Use the following code to send emails:

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($to, $subject, $body) {
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
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer error: " . $mail->ErrorInfo);
        return false;
    }
}

// Example usage:
// sendEmail('recipient@example.com', 'Test Subject', '<p>This is a test email.</p>');

*/

// This file is just a guide and should not be accessed directly
header('HTTP/1.1 403 Forbidden');
echo 'This file is a setup guide and should not be accessed directly.';
