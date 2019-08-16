<?php
require_once 'connection.php';

$checkersString = $_POST['checkersString']; // параметр, переданный данному скрипту в массиве POST (строка шашек)
$currentMove = $_POST['currentMove'];

//$link = mysqli_connect($host, $user, $password, $database) or die("Ошибка " . mysqli_error($link));
$query = "UPDATE board SET board = '$checkersString', currentMove = '$currentMove'"; // записать строку с располож. шашек в БД MySQL
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); // выполнить запрос
//mysqli_close($link); // закрываем подключение к БД

?>