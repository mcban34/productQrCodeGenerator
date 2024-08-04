<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require 'config.php';

$sql = "SELECT id, title,description, image, qr_code, created_at, category_id FROM posts";
$result = $conn->query($sql);

$posts = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['image'] = json_decode($row['image']);
        $posts[] = $row;
    }
}

echo json_encode($posts);

$conn->close();
?>
