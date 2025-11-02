<?php
session_start();
require_once 'db_connect.php';

// Send JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173"); // Vite port
header("Access-Control-Allow-Credentials: true"); // allow cookies/sessions
header("Access-Control-Allow-Headers: Content-Type");

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
$username = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit;
}

$stmt = $db->prepare("SELECT id, username, password, salt, name, email FROM users WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $hashed = hash('sha512', $password . $row['salt']);

    if ($hashed === $row['password']) {
        $_SESSION['userID'] = $row['id'];
        $_SESSION['username'] = $row['username'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $row['email']
            ]
        ]);
        exit;
    }
}

// Login failed
echo json_encode([
    "success" => false,
    "message" => "Invalid username or password"
]);
exit;
?>