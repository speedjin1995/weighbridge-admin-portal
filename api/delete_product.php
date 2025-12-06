<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["id"]);

$stmt = $db->prepare("UPDATE products SET deleted=1 WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute())
    echo json_encode(["status" => "success"]);
else
    echo json_encode(["status" => "error", "message" => $db->error]);
