<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$id = intval($_GET['id'] ?? 0);

$sql = "SELECT * FROM companies WHERE deleted = 0";
$stmt = $db->prepare("SELECT * FROM companies WHERE id=? LIMIT 1");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode([
        "status" => "success", "data" => $row
    ]);
} else {
    echo json_encode([
        "status" => "error", "message" => "Company not found"
    ]);
}
