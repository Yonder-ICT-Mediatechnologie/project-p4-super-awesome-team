<?php
// Test file to debug authentication issues
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo "Testing auth system...<br>";

// Test 1: Check if database file exists
if (file_exists('../config/database.php')) {
    echo "✅ Database config file exists<br>";
} else {
    echo "❌ Database config file NOT found<br>";
    exit;
}

// Test 2: Try to include database file
try {
    require_once '../config/database.php';
    echo "✅ Database config loaded<br>";
} catch (Exception $e) {
    echo "❌ Database config error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 3: Try to create database connection
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "✅ Database connection successful<br>";
    } else {
        echo "❌ Database connection failed<br>";
        exit;
    }
} catch (Exception $e) {
    echo "❌ Database connection error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 4: Check if users table exists
try {
    $query = "SHOW TABLES LIKE 'users'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Users table exists<br>";
    } else {
        echo "❌ Users table NOT found<br>";
    }
} catch (Exception $e) {
    echo "❌ Table check error: " . $e->getMessage() . "<br>";
}

// Test 5: Check users in database
try {
    $query = "SELECT username, email, created_at FROM users";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "✅ Found " . count($users) . " users in database:<br>";
    foreach ($users as $user) {
        echo "- " . $user['username'] . " (" . $user['email'] . ")<br>";
    }
} catch (Exception $e) {
    echo "❌ User query error: " . $e->getMessage() . "<br>";
}

// Test 6: Test a simple JSON response
echo "<br>Testing JSON response:<br>";
$testResponse = [
    'success' => true,
    'message' => 'Test successful',
    'timestamp' => date('Y-m-d H:i:s')
];

echo json_encode($testResponse);
?> 