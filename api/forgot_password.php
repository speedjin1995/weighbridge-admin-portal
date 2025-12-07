<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// require 'PHPMailer/src/Exception.php';
// require 'PHPMailer/src/PHPMailer.php';
// require 'PHPMailer/src/SMTP.php';
require 'vendor/autoload.php';

// MUST be first — CORS headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Handle preflight before anything else
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Content-Length: 0"); 
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(204);
    exit(0);
}

require_once 'db_connect.php';

function generateRandomPassword(int $length = 8): string {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $password = '';
    $max = strlen($chars) - 1;
    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[random_int(0, $max)];
    }
    return $password;
}

function sendTemporaryPasswordEmail(string $email, string $newPassword, string $userName): bool {
    $mail = new PHPMailer(true);
    
    try {
        // --- MAILHOG CONFIGURATION ---
        $mail->isSMTP();
        $mail->Host       = 'localhost'; // MailHog runs on localhost
        $mail->Port       = 1025;      // MailHog's SMTP port
        $mail->SMTPAuth   = false;     // No authentication needed for MailHog
        $mail->SMTPSecure = false;
        // $mail->Username = 'prod_user'; 
        // $mail->Password = 'prod_pass';
        
        $mail->setFrom('no-reply@yourdomain.test', 'Password Reset Service'); // to be replaced with actual sender
        $mail->addAddress($email);
        
        $mail->isHTML(true);
        $mail->Subject = 'Your password was reset';
        
        $body = "
            <p>Hello $userName,</p>
            <p>Your password has been successfully reset. Your temporary password is:</p>
            <p style='font-size: 1.2em; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px;'>{$newPassword}</p>
            <p>Please log in immediately and change this password to something secure.</p>
            <p>Thank you.</p>
        ";
        
        $mail->Body    = $body;
        $mail->AltBody = "Hello {$userName},\n\nYour temporary password is: {$newPassword}. Please log in and change it immediately.";

        $mail->send();
        return true;
        
    } catch (Exception $e) {
        // Log the error for debugging purposes
        error_log("MailHog/PHPMailer Error: {$mail->ErrorInfo}");
        return false;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents("php://input");
    $data = json_decode($json_input, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email provided.']);
        exit;
    }

    $email = trim($data['email']);
    
    $sql_user = $db->prepare("SELECT id, name, salt FROM users WHERE email = ?");
    $sql_user->bind_param('s', $email);
    $sql_user->execute();
    $result = $sql_user->get_result();
    $user = $result->fetch_assoc();
    $sql_user->close();

    if (!$user) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'If an account exists for that email address, the password has been reset and emailed to you.']);
        exit;
    }

    $userID = $user['id'];
    $salt = $user['salt'];
    $userName = $user['name'];

    $newClearPassword = generateRandomPassword(8);
    $newClearPassword = "123456";
    
    $newHashedPassword = hash('sha512', $newClearPassword . $salt);

    $sql_update = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
    $sql_update->bind_param('si', $newHashedPassword, $userID);
    
    if ($sql_update->execute()) {
        $sql_update->close();
        
        if (sendTemporaryPasswordEmail($email, $newClearPassword, $userName)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Your password has been reset and the temporary password has been sent to your email.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Password reset in DB, but failed to send the email. Contact support.']);
        }
        
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database update failed: ' . $db->error]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not supported.']);
}

$db->close();
?>