<?php
require_once("db.php");
session_start();

if(!isset($_SESSION['user_id']))
{
    header("Location:user_login.php");
    exit();
}
$user_id=$_SESSION['user_id'];

$query=$conn->prepare ("SELECT COUNT(*) AS total_coins,SUM(value) AS total_value
FROM coins 
JOIN collections ON coins.collection_id=collection_id
WHERE  collection.user_id = ?");

$query->execute([$user_id]);
$statistics = $query->fetchAll(PDO::FETCH_ASSOC);
$total_coins=$statistics['total_coins'] ?? 0;
$total_value=$statistics['total_value'] ?? 0.00;

$query=$conn->prepare(
    "SELECT continent,COUNT(*) AS count FROM coins
    JOIN collections ON coins,collection_id=collections_id
    WHERE collections.user_id=?
    GROUP BY continent");

$query->execute([user_id]);
$continent_data = $query->fetchAll(PDO::FETCH_ASSOC);

$query=$conn->prepare(
    "SELECT year,COUNT(*) AS count FROM coins
    JOIN collections ON coins.collection.id=collections.id
    WHERE collection.user_id=?
    GROUP BY year ORDER BY year ASC"
);
$query->execute([$user_id]);
$year_data=$query->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode([
    'total_coins'=>$total_coins,
    'total_value'=>$total_value,
    'continent_data'=>$continent_data,
    'year_data'=>$year_data
]);
?>

