<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? "";
$regNo = $data['reg_no'] ?? "";
$email = $data['email'] ?? "";
$phone = $data['phone'] ?? "";
$address = $data['address'] ?? "";
$address2 = $data['address2'] ?? "";
$address3 = $data['address3'] ?? "";
$address4 = $data['address4'] ?? "";
$sector = $data['sector'] ?? "";
$domainName = $data['domain_name'] ?? "";
$products = $data['products'] ?? "";

if (!$name || !$address || !$products) {
    echo json_encode(["status" => "error", "message" => "Required fields missing"]);
    exit;
}

$stmt = $db->prepare("INSERT INTO companies(reg_no, name, address, address2, address3, address4, phone, email, products, domain_name, sector) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssssss", $regNo, $name, $address, $address2, $address3, $address4, $phone, $email, $products, $domainName, $sector);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success"
    ]);
} else {
    echo json_encode([
        "status" => "error", "message" => $db->error
    ]);
}
