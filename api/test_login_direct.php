<?php
// Test the auth.php login function directly
header('Content-Type: text/html; charset=UTF-8');

echo "<h2>Testing Auth.php Login Function</h2>";

// Set up the environment to simulate a POST request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'application/json';

// Prepare test data
$testData = [
    'action' => 'login',
    'username' => '123',
    'password' => '123456',
    'rememberMe' => false
];

echo "<strong>Testing login with:</strong><br>";
echo "Username: 123<br>";
echo "Password: 123456<br><br>";

// Simulate POST data
$jsonData = json_encode($testData);
file_put_contents('php://input', $jsonData);

// Capture any errors
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Include and test the auth.php file
    // We'll manually call the functions instead of including the whole file
    require_once '../config/database.php';

    // ... rest of the code ...
} catch (Exception $e) {
    echo "❌ <strong>Error:</strong> " . $e->getMessage();
} 