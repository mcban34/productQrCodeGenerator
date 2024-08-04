<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "qrapp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// $dsn = 'mysql:host=localhost;dbname=qrapp';
// $username = 'root';
// $password = '';
// $options = [];

// try {
//     $pdo = new PDO($dsn, $username, $password, $options);
//     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// } catch (PDOException $e) {
//     exit("Database connection failed: " . $e->getMessage());
// }

