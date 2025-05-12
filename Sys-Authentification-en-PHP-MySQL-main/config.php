<?php
// config.php
$host = 'localhost'; // Database host
$db = 'auth_system'; // Database name
$user = 'root'; // Database username
$pass = ''; // Database password
$port = '4306'; // Changed to default MySQL port (XAMPP typically uses 3306, not 4306)
$charset = 'utf8mb4';

// Include port in the DSN
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

/**
 * Get database connection
 * @return PDO|null Database connection or null on failure
 */
function getConnection()
{
    global $dsn, $user, $pass, $options;

    try {
        $conn = new PDO($dsn, $user, $pass, $options); // Create a new PDO instance
        return $conn;
    } catch (PDOException $e) {
        // Log error message
        error_log("Database connection failed: " . $e->getMessage());

        // For debugging purposes, you can uncomment this to see the error:
        // echo "Connection error: " . $e->getMessage();

        // In production, don't expose details to users
        return null;
    }
}


// Create a direct connection for backwards compatibility (the original way the code was used)
try {
    $conn = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // For development environment only - shows the actual error
    // Comment this out or change to a generic message in production
    die("Connection failed: " . $e->getMessage());

    // For production:
    // die("Database connection failed. Please try again later.");
}
