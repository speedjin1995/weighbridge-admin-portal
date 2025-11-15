<?php
// MUST be first — CORS headers
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

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Authentication required."]);
    exit();
}

$id = $_SESSION['userID'];

function getUserData($db, $id) {
    $sql = $db->prepare("SELECT id, username, name, role_code, email FROM users WHERE id = ?");
    $sql->bind_param('i', $id);
    
    if ($sql->execute()) {
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
    }
    return false;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = $db->prepare("SELECT id, username, name, role_code, email FROM users WHERE id = ?");
    $sql->bind_param('i', $id);

    if ($sql->execute()) {
        $result = $sql->get_result();
        
        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
            http_response_code(200);
            echo json_encode(["status" => "success", "user" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User data not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database fetch error: " . $db->error]);
    }
    $sql->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents("php://input");
    $data = json_decode($json_input, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received.']);
        exit;
    }

    $name = $data['name'] ?? null;
    $email = $data['email'] ?? null;

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Name and Email are required fields for update.']);
        exit;
    }

        $update_sql = $db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");  
        $update_sql->bind_param('ssi', $name, $email, $id);

        if ($update_sql->execute()) {
            $updated_user = getUserData($db, $id);
        
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