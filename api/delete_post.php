<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id > 0) {
        $sql = "SELECT image, qr_code FROM posts WHERE id=$id";
        $result = $conn->query($sql);

        if ($result && $row = $result->fetch_assoc()) {
            $images = json_decode($row['image'], true);
            $qrCode = $row['qr_code'];

            if (is_array($images)) {
                foreach ($images as $imagePath) {
                    $fullPath = __DIR__ . '/' . $imagePath;
                    if (file_exists($fullPath)) {
                        if (unlink($fullPath)) {
                            echo "Deleted image: $imagePath\n";
                        } else {
                            echo "Failed to delete image: $imagePath\n";
                        }
                    } else {
                        echo "Image file not found: $imagePath\n";
                    }
                }
            }

            $qrCodePath = __DIR__ . '/' . $qrCode;
            if (file_exists($qrCodePath)) {
                if (unlink($qrCodePath)) {
                    echo "Deleted QR code: $qrCode\n";
                } else {
                    echo "Failed to delete QR code: $qrCode\n";
                }
            } else {
                echo "QR code file not found: $qrCode\n";
            }

            $sqlDelete = "DELETE FROM posts WHERE id=$id";
            if ($conn->query($sqlDelete) === TRUE) {
                echo json_encode(["success" => true, "message" => "Record deleted successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error deleting record: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "No record found"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid ID"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

$conn->close();
?>
