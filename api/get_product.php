<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$id = intval($_GET['id'] ?? 0);

$stmt = $db->prepare("SELECT id, product_name, product_description FROM products WHERE id=? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode(["status" => "success", "product" => $row]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
