<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

function formatWhereClause($value){
    $inClause = "'" . implode("','", array_map('addslashes', $value)) . "'";
    return $inClause;
}

$sql = "SELECT * FROM companies WHERE deleted = 0";
$result = $db->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {
    // Get products if they exist
    $productNames = "";
    if(isset($row['products']) && $row['products'] != null && $row['products'] != ''){
        $products = json_decode($row['products'], true);
        if (!empty($products)) {
            $productWhere = formatWhereClause($products);
            if ($product_stmt = $db->prepare("SELECT * FROM products WHERE id IN ($productWhere)")) {
                $product_stmt->execute();
                $product_result = $product_stmt->get_result();
                
                $productArray = array();
                $num = 1; // Start numbering from 1
                while($product_row = $product_result->fetch_assoc()) {
                    $productArray[] = $num . '. ' . $product_row['product_name'];
                    $num++;
                }
                $productNames = implode("\n", $productArray);
                $product_stmt->close();
            }
        }
    }

    $users[] = [
        "id" => $row["id"],
        "reg_no" => $row["reg_no"],
        "name" => $row["name"],
        "address" => $row["address"],
        "address2" => $row["address2"],
        "address3" => $row["address3"],
        "address4" => $row["address4"],
        "phone" => $row["phone"],
        "email" => $row["email"],
        "products" => $productNames,
        "domain_name" => $row["domain_name"],
        "sector" => $row["sector"],
    ];
}

echo json_encode([
    "status" => "success",
    "data" => $users,
]);
$db->close();
