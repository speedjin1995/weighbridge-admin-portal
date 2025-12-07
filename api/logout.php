<?php
session_start();
session_unset();
session_destroy();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");

echo json_encode(["success" => true, "message" => "Logged out"]);
?>