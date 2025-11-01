<?php
require("../session.php");
require("../database.php");

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? '';
$password = $data->password ?? '';

// NOTE: DO NOT USE MD5 IN PRODUCTION — use password_hash
$stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? AND password = MD5(?)");
$stmt->execute([$email, $password]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $_SESSION['user'] = $user;
    echo json_encode(["success" => true, "user" => $user]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
?>