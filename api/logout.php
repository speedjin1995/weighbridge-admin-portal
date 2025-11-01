<?php
require("../session.php");
session_destroy();
echo json_encode(["success" => true]);
?>