<?php
// Test database connection with correct credentials
header('Content-Type: text/html; charset=UTF-8');

echo "<h2>Database Connection Test</h2>";

try {
    // Test database connection
    $pdo = new PDO("mysql:host=localhost;dbname=hangman_game", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ <strong>Database connection successful!</strong><br><br>";
    
    // Test users table
    $stmt = $pdo->query("SELECT id, username, email, created_at FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<strong>Users found in database:</strong><br>";
    foreach ($users as $user) {
        echo "- ID: " . $user['id'] . "<br>";
        echo "- Username: " . htmlspecialchars($user['username']) . "<br>";
        echo "- Email: " . htmlspecialchars($user['email']) . "<br>";
        echo "- Created: " . $user['created_at'] . "<br><br>";
    }
    
    // Test password verification with correct password
    $testUsername = '123';
    $testPassword = '123456'; // Correct password
    
    $stmt = $pdo->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->execute([$testUsername]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "<strong>Password verification test:</strong><br>";
        echo "Testing password '123456' for user '123'<br>";
        
        if (password_verify($testPassword, $user['password'])) {
            echo "✅ <strong>Password verification successful!</strong><br>";
        } else {
            echo "❌ Password verification failed!<br>";
        }
    } else {
        echo "❌ User not found in database!<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ <strong>Database error:</strong> " . $e->getMessage();
}
?> 