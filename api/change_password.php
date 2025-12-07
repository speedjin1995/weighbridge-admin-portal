<?php
// MUST be first — CORS headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight before anything else
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Content-Length: 0"); 
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(204);
    exit(0);
}

require_once 'session.php';
require_once 'db_connect.php';

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Authentication required."]);
    exit();
}

$id = $_SESSION['userID'];

function getUserKeyData($db, $id) {
    $sql = $db->prepare("SELECT id, username, password, salt FROM users WHERE id = ?");
    $sql->bind_param('i', $id);
    
    if ($sql->execute()) {
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
    }
    return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents("php://input");
    $data = json_decode($json_input, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received.']);
        exit;
    }

    $oldPassword = $data['oldPassword'] ?? null;
    $newPassword = $data['newPassword'] ?? null;
    $confirmNewPassword = $data['confirmNewPassword'] ?? null;

    if (empty($oldPassword) || empty($newPassword) || empty($confirmNewPassword) ) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required for update.']);
        exit;
    }

    $user_data = getUserKeyData($db, $id);

    if (!$user_data) {
        // This usually means the ID in the session is no longer valid
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit;
    }
    
    $original_hashed_password = hash('sha512', $oldPassword . $user_data['salt']);
    $db_password = $user_data['password'];

    if ($original_hashed_password !== $db_password) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Old password does not match.']);
        exit;
    }

    $new_hashed_password = hash('sha512', $newPassword . $user_data['salt']);

    $update_sql = $db->prepare("UPDATE users SET password = ? WHERE id = ?");  
    $update_sql->bind_param('si', $new_hashed_password, $id);

    if ($update_sql->execute()) {
        $updated_user = getUserKeyData($db, $id);
    
    if ($updated_user) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully!',
            'user' => $updated_user
        ]);
    } else {
        // Should not happen if the update succeeded
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Update succeeded, but failed to re-fetch user data.'
        ]);
    }
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Update failed: ' . $db->error
        ]);
    }
    $update_sql->close();
    
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not supported.'
    ]);
}
$db->close();
?>