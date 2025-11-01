<?php
require("../session.php");

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["logged_in" => false]);
} else {
    echo json_encode(["logged_in" => true, "user" => $_SESSION['user']]);
}
?>