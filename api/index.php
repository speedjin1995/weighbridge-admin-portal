<?php
session_start();

if (!isset($_SESSION['userID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["status" => "unauthorized"]);
    exit();
}
?>
