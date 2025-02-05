<?php
require_once("./db.php");
session_start();



if(!$conn)
{
    header("Content-Type:application/json");
    echo json_encode(["error"=>"Грешка при свързването с базата"]);
    exit();
}
$search=isset($_GET['search']) ? "%".$_GET['search']."%" : "%";
$continent=isset($_GET['continent']) && $_GET['continent'] !=="" ? $_GET['continent'] : null;
$collection = isset($_GET['collection']) && $_GET['collection'] !=="" ? $_GET['collection'] : null;
$sort= isset($_GET['sort']) ? $_GET['sort'] : "year-desc";

$query="SELECT coins.id,coins.name,coins.year,coins.value,coins.country,coins.continent,
coins.front_image,coins.back_image,collections.name as collection_name,users.Username AS owner
FROM coins
JOIN collections ON coins.collection_id=collections.id
JOIN users ON collections.user_id=users.id
WHERE(coins.name LIKE ? OR coins.country LIKE ?)";
$parameters=[$search,$search];
if($continent)
{
    $query.=" AND coins.continent = ?";
    $parameters[]=$continent;
}

switch($sort)
{
    case "year-asc":
        $query.="ORDER BY coins.year ASC";
        break;
    case "value-desc":
        $query.="ORDER BY CAST(coins.value AS DECIMAL(10,2)) DESC";
        break;
    case "value-asc":
        $query.="ORDER BY CAST(coins.value AS DECIMAL(10,2)) ASC";
        break;
    default:
    $query.="ORDER BY coins.year DESC";
}

try
{
    $stmt=$conn->prepare($query);
    $stmt->execute($parameters);
    $coins= $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode(["coins"=>$coins]);
} catch(Exception $e){
  header("Content-Type:application/json");
  echo json_encode(["error"=>"Грешка при изпълнение на заявката","details"=> $e->getMessage()]);
}