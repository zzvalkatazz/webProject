<?php
require_once("db.php");
session_start();

if(!isset($_SESSION['user_id']))
{
    header("Content-Type:application/json");
    echo json_encode(["error"=>"Не сте влезли в системата"]);
    exit();
}

$user_id=$_SESSION['user_id'];

if(!$conn)
{
    header("Content-Type:application/json");
    echo json_encode(["error"=>"Грешка при свързването с базата"]);
    exit();
}
$search=isset($_GET['search']) ? "%".$_GET['search']."%" : "%";
$continent=isset($_GET['continent']) && $_GET['continent'] !=="" ? $_GET['continent'] : null;
$sort= isset($_GET['sort']) ? $_GET['sort'] : "year-desc";

$query="SELECT id, name,year,value,country,continent,front_image,back_image
FROM coins
WHERE user_id= ? AND(name LIKE ? OR country LIKE ?)";

$parameters=[$user_id,$search,$search];
if($continent)
{
    $query.=" AND continent = ?";
    $parameters[]=$continent;
}

switch($sort)
{
    case "year-asc":
        $query.="ORDER BY year ASC";
        break;
    case "value-desc":
        $query.="ORDER BY CAST(value AS DECIMAL(10,2)) DESC";
        break;
    case "value-asc":
        $query.="ORDER BY CAST(value AS DECIMAL(10,2)) ASC";
        break;
    default:
    $query.="ORDER BY year DESC";
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
  echo json_encode(["error"=>"Грешка при изпълнение на заявката","details"=> $е->getMessage()]);
}