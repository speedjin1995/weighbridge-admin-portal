<?php
require("session.php");

if (!isset($_SESSION['userID'])) {
    http_response_code(401);
    echo json_encode(["loggedIn" => false]);
} else {
    echo json_encode(["loggedIn" => true, "user" => $_SESSION['userID']]);
}
?>