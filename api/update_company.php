<?php
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once 'session.php';
require_once 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];
$regNo = $data['reg_no'] ?? "";
$email = $data['email'] ?? "";
$phone = $data['phone'] ?? "";
$address = $data['address'];
$address2 = $data['address2'] ?? "";
$address3 = $data['address3'] ?? "";
$address4 = $data['address4'] ?? "";
$sector = $data['sector'] ?? "";
$domainName = $data['domain_name'] ?? "";
$products = $data['products'];


if (isset($id) && !empty($id)) {
    if (!isset($name) || empty($name) || !isset($address) || empty($address) || !isset($products) || empty($products) ) {
        echo json_encode([
            "status" => "error", 
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $stmt = $db->prepare("UPDATE companies SET reg_no=?, name=?, address=?, address2=?, address3=?, address4=?, phone=?, email=?, products=?, domain_name=?, sector=? WHERE id=?");
    $stmt->bind_param("sssssssssssi", $regNo, $name, $address, $address2, $address3, $address4, $phone, $email, $products, $domainName, $sector, $id);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Company updated successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => $db->error
        ]);
    }
}else{
    echo json_encode([
        "status" => "error", 
        "message" => "ID is required"
    ]);
}



