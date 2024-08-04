<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'config.php';
$id = $_GET['id'];

$sql = "SELECT title, image , description FROM posts WHERE id = $id";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $post = $result->fetch_assoc();
    $post['image'] = json_decode($post['image']);
    echo json_encode($post);
} else {
    echo json_encode(["message" => "No post found"]);
}

$conn->close();
?>
