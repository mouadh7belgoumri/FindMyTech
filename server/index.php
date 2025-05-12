<?php
//include 'cors.php';
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Including the products file (keeping this as it appears to be PHP logic)
include 'products.php';
