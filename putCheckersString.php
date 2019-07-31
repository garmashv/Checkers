<?php

require_once 'connection.php';

$checkersString = $_POST['checkersString'];

$link = mysqli_connect($host, $user, $password, $database) or die("Ошибка " . mysqli_error($link));
$query = "UPDATE board SET board = '$checkersString'";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
mysqli_close($link); // закрываем подключение к БД

?>