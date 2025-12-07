<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["id"]);

$stmt = $db->prepare("UPDATE users SET deleted=1 WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute())
    echo json_encode(["status" => "success"]);
else
    echo json_encode(["status" => "error", "message" => $db->error]);
