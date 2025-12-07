<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$name = $data["product_name"];
$email = $data["product_description"];

$stmt = $db->prepare("UPDATE products SET product_name=?, product_description=? WHERE id=?");
$stmt->bind_param("sss", $name, $email, $id);

if ($stmt->execute()) echo json_encode(["status" => "success"]);
else echo json_encode(["status" => "error", "message" => $db->error]);
