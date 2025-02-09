<?php
require_once("./db.php");
session_start();

// ✅ Дебъгване на сесията (за премахване, след като приключат тестовете)
error_reporting(E_ALL);
ini_set('display_errors', 1);
// var_dump($_SESSION);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_SESSION["user_id"])) {
        echo json_encode(["success" => false, "message" => "Трябва да сте влезли в профила си!"]);
        exit();
    }

    $user_id = $_SESSION["user_id"];
    $coin_id = intval($_POST["coin_id"]);
    $image_type = $_POST["image_type"];

    // ✅ Дебъгване на входящите POST данни
    file_put_contents("debug_like.log", print_r($_POST, true), FILE_APPEND);

    // Проверка дали потребителят вече е харесал тази снимка
    $query = $conn->prepare("SELECT * FROM likes WHERE user_id = ? AND coin_id = ? AND image_type = ?");
    $query->execute([$user_id, $coin_id, $image_type]);

    if ($query->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Вече сте харесали тази снимка!"]);
        exit();
    }

    // Вмъкване на нов лайк
    $insert = $conn->prepare("INSERT INTO likes (user_id, coin_id, image_type) VALUES (?, ?, ?)");
    $insert->execute([$user_id, $coin_id, $image_type]);

    // Връщане на актуализирания брой лайкове
    $countQuery = $conn->prepare("SELECT COUNT(*) FROM likes WHERE coin_id = ? AND image_type = ?");
    $countQuery->execute([$coin_id, $image_type]);
    $likeCount = $countQuery->fetchColumn();

    echo json_encode(["success" => true, "likes" => $likeCount]);
    exit();
}

// GET заявка - извличане на лайковете
$query = $conn->query("SELECT coin_id, image_type, COUNT(*) AS likes FROM likes GROUP BY coin_id, image_type");
$likesData = $query->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($likesData);
?>
