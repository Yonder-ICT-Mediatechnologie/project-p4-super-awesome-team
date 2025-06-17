<?php
header('Content-Type: text/html; charset=UTF-8');

echo "<h2>Testing Stats API</h2>";

// Test session token - get from your browser's localStorage
echo "<p><strong>Instructions:</strong></p>";
echo "<ol>";
echo "<li>Open browser console (F12)</li>";
echo "<li>Type: <code>localStorage.getItem('hangmanSessionToken')</code></li>";
echo "<li>Copy the token and paste it below</li>";
echo "</ol>";

$testToken = $_GET['token'] ?? '';

if (empty($testToken)) {
    echo "<form method='GET'>";
    echo "<input type='text' name='token' placeholder='Paste your session token here' style='width: 500px;'><br><br>";
    echo "<button type='submit'>Test Stats API</button>";
    echo "</form>";
    exit;
}

echo "<h3>Testing with token: " . substr($testToken, 0, 20) . "...</h3>";

// Test the API
$testData = [
    'action' => 'getUserStats',
    'sessionToken' => $testToken
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/school/P4/project-p4-super-awesome-team1.0/api/game.php");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<strong>HTTP Code:</strong> $httpCode<br>";
echo "<strong>Response:</strong><br>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

$data = json_decode($response, true);
if ($data) {
    echo "<strong>Parsed JSON:</strong><br>";
    echo "<pre>" . print_r($data, true) . "</pre>";
} else {
    echo "<strong>❌ Failed to parse JSON</strong><br>";
}
?> 