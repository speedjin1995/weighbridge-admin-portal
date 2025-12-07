<?php
// ✅ MUST be BEFORE session_start()
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'ecwmsb.com.my',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

session_start();

// ✅ API Headers for React
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: https://ecwmsb.com.my");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
