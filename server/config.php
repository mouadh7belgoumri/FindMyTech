<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// config.php

// Database configuration
$host = 'localhost';       // Database host
$db = 'auth_system';       // Database name
$user = 'root';            // Database username
$port = '4306';            // Database port (default is usually 3306 for MySQL)
$pass = '';                // Database password
$charset = 'utf8mb4';      // Character set

// Include the port in the DSN string
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";

// PDO options for better error handling and security
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,     // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,           // Return arrays with column names as keys
    PDO::ATTR_EMULATE_PREPARES   => false,                      // Use real prepared statements
];

// Establish the database connection
try {
    $conn = new PDO($dsn, $user, $pass, $options); // Create a new PDO instance
    // Optional: Uncomment to confirm connection success
    // echo "Database connection established successfully";
} catch (PDOException $e) {
    // Better error handling with meaningful message
    die("Database connection failed: " . $e->getMessage());
}
