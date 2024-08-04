<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
require 'config.php';

$data = json_decode(file_get_contents("php://input"));
$name = $data->name;

$stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    echo json_encode(array("message" => "Category added successfully."));
} else {
    echo json_encode(array("message" => "Error: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
