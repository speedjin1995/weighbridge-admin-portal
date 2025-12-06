<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

$sql = "SELECT * FROM products WHERE deleted = 0";
$result = $db->query($sql);

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = [
        "id" => $row["id"],
        "product_name" => $row["product_name"],
        "product_description" => $row["product_description"]
    ];
}

echo json_encode([
    "status" => "success",
    "data" => $products
]);
$db->close();
