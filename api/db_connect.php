<?php
$pdo = new PDO("mysql:host=localhost;dbname=myapp", "root", "", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);
?>