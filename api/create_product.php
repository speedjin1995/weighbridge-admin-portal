<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? "";
$description = $data['description'] ?? "";

if (!$name) {
    echo json_encode(["status" => "error", "message" => "Required fields missing"]);
    exit;
}

$stmt = $db->prepare("INSERT INTO products(product_name, product_description) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $description);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success"
    ]);
} else {
    echo json_encode([
        "status" => "error", "message" => $db->error
    ]);
}
