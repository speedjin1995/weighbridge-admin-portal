<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$name = $data["name"];
$email = $data["email"];
$role = $data["role_code"];

$stmt = $db->prepare("UPDATE users SET name=?, email=?, role_code=? WHERE id=?");
$stmt->bind_param("sssi", $name, $email, $role, $id);

if ($stmt->execute()) echo json_encode(["status" => "success"]);
else echo json_encode(["status" => "error", "message" => $db->error]);
