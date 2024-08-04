<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="qrcodes.zip"');

$dsn = 'mysql:host=localhost;dbname=qrapp';
$username = 'root';
$password = '';
$options = [];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    exit("Database connection failed: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!empty($data)) {
        $zip = new ZipArchive();
        $zipFilename = 'qrcodes_' . time() . '.zip';

        if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
            exit("Cannot open <$zipFilename>\n");
        }

        foreach ($data as $item) {
            $qrCodePath = __DIR__ . '/' . $item['qr_code'];
            $productName = $item['title'] . '.png';
            $categoryId = $item['category_id'];

            $stmt = $pdo->prepare("SELECT name FROM categories WHERE id = :id");
            $stmt->execute(['id' => $categoryId]);
            $categoryName = $stmt->fetchColumn();

            if ($categoryName && file_exists($qrCodePath)) {
                $zip->addFile($qrCodePath, $categoryName . '/' . $productName);
            }
        }

        $zip->close();

        if (file_exists($zipFilename)) {
            readfile($zipFilename);
            unlink($zipFilename);
        } else {
            exit("Failed to create <$zipFilename>\n");
        }
    } else {
        exit("No data provided\n");
    }
} else {
    exit("Invalid request method\n");
}
?>
