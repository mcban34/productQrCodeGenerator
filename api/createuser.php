<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "qrapp";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection successful.<br>";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$username = 'admin';
$password = '123';

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$query = "INSERT INTO users (username, password) VALUES (:username, :password)";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $hashed_password);

if ($stmt->execute()) {
    echo "New user created successfully.";
} else {
    echo "Error: Could not execute the query.";
}
?>
