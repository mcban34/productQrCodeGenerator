<?php
require 'vendor/autoload.php';
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require 'config.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $category_id = $_POST['category_id'];
    $target_dir = "uploads/";
    $uploaded_files = [];

    foreach ($_FILES['images']['name'] as $key => $name) {
        $target_file = $target_dir . basename($name);
        if (move_uploaded_file($_FILES['images']['tmp_name'][$key], $target_file)) {
            $uploaded_files[] = $target_file;
        }
    }

    if (!empty($uploaded_files)) {
        $images_json = json_encode($uploaded_files);

        $sql = "INSERT INTO posts (title,description, image, category_id) VALUES ('$title','$description', '$images_json','$category_id')";
        if ($conn->query($sql) === TRUE) {
            $post_id = $conn->insert_id;

            $url = 'http://localhost:5173/product/' . $post_id;
            $options = new QROptions([
                'version'    => 5,
                'outputType' => QRCode::OUTPUT_IMAGE_PNG,
                'eccLevel'   => QRCode::ECC_L,
            ]);
            $qrcode = new QRCode($options);
            $qr_image = $target_dir . 'qrcode_' . $post_id . '.png';
            $qrcode->render($url, $qr_image);

            $qr_image_url = 'uploads/qrcode_' . $post_id . '.png';
            $update_sql = "UPDATE posts SET qr_code = '$qr_image_url' WHERE id = $post_id";
            if ($conn->query($update_sql) === TRUE) {
                echo json_encode(["message" => "Record added and QR code created successfully"]);
            } else {
                echo json_encode(["message" => "Error updating QR code: " . $conn->error]);
            }
        } else {
            echo json_encode(["message" => "Error: " . $sql . "<br>" . $conn->error]);
        }
    } else {
        echo json_encode(["message" => "Sorry, there was an error uploading your files."]);
    }
}

$conn->close();
?>
