<?php
require("../session.php");

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["logged_in" => false]);
} else {
    echo json_encode(["logged_in" => true, "user" => $_SESSION['userID']]);
}
?>