<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "qrapp";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$secret_key = "qrApp1234";
$jwt = null;

$headers = apache_request_headers();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

if ($authHeader) {
    list($bearer, $jwt) = explode(" ", $authHeader);

    if ($jwt) {
        try {
            $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            http_response_code(200);
            echo json_encode(array(
                "message" => "Access granted.",
                "data" => $decoded->data
            ));
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array(
                "message" => "Access denied.",
                "error" => $e->getMessage()
            ));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Access denied."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Authorization header not found."));
}
?>
