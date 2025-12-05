<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? "";
$username = $data['username'] ?? "";
$email = $data['email'] ?? "";
$role = $data['role'] ?? "NORMAL";

if (!$name || !$username || !$email) {
    echo json_encode(["status" => "error", "message" => "Required fields missing"]);
    exit;
}

$defaultPassword = "123456";
$salt = bin2hex(random_bytes(32));
$hashed = hash('sha512', $defaultPassword.$salt);

$stmt = $db->prepare("INSERT INTO users(name, username, email, role_code, password, salt) VALUES(?,?,?,?,?,?)");
$stmt->bind_param("ssssss", $name, $username, $email, $role, $hashed, $salt);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $db->error]);
}
