<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Get the request method and data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Route the request
switch ($method) {
    case 'POST':
        if (isset($input['action'])) {
            switch ($input['action']) {
                case 'register':
                    register($db, $input);
                    break;
                case 'login':
                    login($db, $input);
                    break;
                case 'logout':
                    logout($db, $input);
                    break;
                case 'verify':
                    verifySession($db, $input);
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Invalid action']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'No action specified']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

// Register function
function register($db, $data) {
    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validation
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        return;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
        return;
    }
    
    // Check if username exists
    $query = "SELECT id FROM users WHERE username = :username";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        return;
    }
    
    // Check if email exists
    $query = "SELECT id FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        return;
    }
    
    // Hash password and create user
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
}

// Login function
function login($db, $data) {
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $rememberMe = $data['rememberMe'] ?? false;
    
    // Validation
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        return;
    }
    
    // Get user from database
    $query = "SELECT id, username, email, password FROM users WHERE username = :username AND is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        return;
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        return;
    }
    
    // Create session token
    $sessionToken = bin2hex(random_bytes(32));
    $expiresAt = $rememberMe ? 
        date('Y-m-d H:i:s', strtotime('+30 days')) : 
        date('Y-m-d H:i:s', strtotime('+24 hours'));
    
    // Clear old sessions for this user
    $deleteOldSessions = "DELETE FROM game_sessions WHERE user_id = :user_id";
    $stmt = $db->prepare($deleteOldSessions);
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->execute();
    
    // Create new session
    $query = "INSERT INTO game_sessions (user_id, session_token, remember_me, expires_at) VALUES (:user_id, :token, :remember_me, :expires_at)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->bindParam(':token', $sessionToken);
    $stmt->bindParam(':remember_me', $rememberMe, PDO::PARAM_BOOL);
    $stmt->bindParam(':expires_at', $expiresAt);
    $stmt->execute();
    
    // Update last login
    $updateLogin = "UPDATE users SET last_login = NOW() WHERE id = :user_id";
    $stmt = $db->prepare($updateLogin);
    $stmt->bindParam(':user_id', $user['id']);
    $stmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ],
        'sessionToken' => $sessionToken
    ]);
}

// Logout function
function logout($db, $data) {
    $sessionToken = $data['sessionToken'] ?? '';
    
    if (!empty($sessionToken)) {
        $query = "DELETE FROM game_sessions WHERE session_token = :token";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':token', $sessionToken);
        $stmt->execute();
    }
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
}

// Verify session function
function verifySession($db, $data) {
    $sessionToken = $data['sessionToken'] ?? '';
    
    if (empty($sessionToken)) {
        echo json_encode(['success' => false, 'message' => 'No session token provided']);
        return;
    }
    
    $query = "SELECT u.id, u.username, u.email, s.expires_at 
              FROM users u 
              JOIN game_sessions s ON u.id = s.user_id 
              WHERE s.session_token = :token AND s.expires_at > NOW() AND u.is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $sessionToken);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
        return;
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
}
?> 