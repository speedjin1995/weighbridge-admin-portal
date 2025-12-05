<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

$sql = "SELECT id, username, name, email, role_code FROM users WHERE deleted = 0";
$result = $db->query($sql);

$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "username" => $row["username"],
        "email" => $row["email"],
        "role" => $row["role_code"]
    ];
}

echo json_encode([
    "status" => "success",
    "data" => $users
]);
$db->close();
