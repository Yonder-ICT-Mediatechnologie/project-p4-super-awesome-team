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
                case 'saveScore':
                    saveGameScore($db, $input);
                    break;
                case 'getUserStats':
                    getUserStats($db, $input);
                    break;
                case 'getUserHistory':
                    getUserHistory($db, $input);
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

// Verify session function
function verifySession($db, $sessionToken) {
    if (empty($sessionToken)) {
        return false;
    }
    
    $query = "SELECT u.id, u.username, u.email 
              FROM users u 
              JOIN game_sessions s ON u.id = s.user_id 
              WHERE s.session_token = :token AND s.expires_at > NOW() AND u.is_active = 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $sessionToken);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        return false;
    }
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Save game score
function saveGameScore($db, $data) {
    try {
        $sessionToken = $data['sessionToken'] ?? '';
        $word = $data['word'] ?? '';
        $score = intval($data['score'] ?? 0);
        $attemptsUsed = intval($data['attemptsUsed'] ?? 0);
        $result = $data['result'] ?? '';
        
        // Verify session
        $user = verifySession($db, $sessionToken);
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid session']);
            return;
        }
        
        // Validate input
        if (empty($word) || !in_array($result, ['Won', 'Lost'])) {
            echo json_encode(['success' => false, 'message' => 'Invalid game data']);
            return;
        }
        
        $db->beginTransaction();
        
        // Insert game score
        $query = "INSERT INTO game_scores (user_id, word, score, attempts_used, result) 
                  VALUES (:user_id, :word, :score, :attempts_used, :result)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->bindParam(':word', $word);
        $stmt->bindParam(':score', $score);
        $stmt->bindParam(':attempts_used', $attemptsUsed);
        $stmt->bindParam(':result', $result);
        $stmt->execute();
        
        // Update user stats
        updateUserStats($db, $user['id'], $score, $result);
        
        $db->commit();
        
        echo json_encode(['success' => true, 'message' => 'Game score saved successfully']);
    } catch (Exception $e) {
        if ($db->inTransaction()) {
            $db->rollback();
        }
        echo json_encode(['success' => false, 'message' => 'Failed to save game score: ' . $e->getMessage()]);
    }
}

// Update user statistics
function updateUserStats($db, $userId, $score, $result) {
    // Get current stats
    $query = "SELECT * FROM user_stats WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        // Create new stats record
        $currentStats = [
            'total_games' => 0,
            'games_won' => 0,
            'current_streak' => 0,
            'best_streak' => 0,
            'total_score' => 0,
            'best_score' => 0
        ];
    } else {
        $currentStats = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Update stats
    $newStats = [
        'total_games' => $currentStats['total_games'] + 1,
        'games_won' => $currentStats['games_won'] + ($result === 'Won' ? 1 : 0),
        'total_score' => $currentStats['total_score'] + $score,
        'best_score' => max($currentStats['best_score'], $score)
    ];
    
    // Update streak
    if ($result === 'Won') {
        $newStats['current_streak'] = $currentStats['current_streak'] + 1;
        $newStats['best_streak'] = max($currentStats['best_streak'], $newStats['current_streak']);
    } else {
        $newStats['current_streak'] = 0;
        $newStats['best_streak'] = $currentStats['best_streak'];
    }
    
    // Calculate win rate
    $newStats['win_rate'] = $newStats['total_games'] > 0 ? 
        round(($newStats['games_won'] / $newStats['total_games']) * 100, 2) : 0;
    
    // Insert or update stats
    if ($stmt->rowCount() === 0) {
        $query = "INSERT INTO user_stats (user_id, total_games, games_won, win_rate, current_streak, best_streak, total_score, best_score) 
                  VALUES (:user_id, :total_games, :games_won, :win_rate, :current_streak, :best_streak, :total_score, :best_score)";
    } else {
        $query = "UPDATE user_stats SET 
                  total_games = :total_games, 
                  games_won = :games_won, 
                  win_rate = :win_rate, 
                  current_streak = :current_streak, 
                  best_streak = :best_streak, 
                  total_score = :total_score, 
                  best_score = :best_score 
                  WHERE user_id = :user_id";
    }
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':total_games', $newStats['total_games']);
    $stmt->bindParam(':games_won', $newStats['games_won']);
    $stmt->bindParam(':win_rate', $newStats['win_rate']);
    $stmt->bindParam(':current_streak', $newStats['current_streak']);
    $stmt->bindParam(':best_streak', $newStats['best_streak']);
    $stmt->bindParam(':total_score', $newStats['total_score']);
    $stmt->bindParam(':best_score', $newStats['best_score']);
    $stmt->execute();
}

// Get user statistics
function getUserStats($db, $data) {
    try {
        $sessionToken = $data['sessionToken'] ?? '';
        
        // Verify session
        $user = verifySession($db, $sessionToken);
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid session']);
            return;
        }
        
        $query = "SELECT * FROM user_stats WHERE user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            // Return default stats if none exist
            $stats = [
                'total_games' => 0,
                'games_won' => 0,
                'win_rate' => 0,
                'current_streak' => 0,
                'best_streak' => 0,
                'total_score' => 0,
                'best_score' => 0
            ];
        } else {
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        echo json_encode(['success' => true, 'stats' => $stats]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error getting stats: ' . $e->getMessage()]);
    }
}

// Get user game history
function getUserHistory($db, $data) {
    try {
        $sessionToken = $data['sessionToken'] ?? '';
        $limit = intval($data['limit'] ?? 20);
        
        // Verify session
        $user = verifySession($db, $sessionToken);
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid session']);
            return;
        }
        
        $query = "SELECT word, score, attempts_used, result, played_at 
                  FROM game_scores 
                  WHERE user_id = :user_id 
                  ORDER BY played_at DESC 
                  LIMIT :limit";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'history' => $history]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error getting history: ' . $e->getMessage()]);
    }
}
?> 