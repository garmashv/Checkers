<?php

require_once 'connection.php';
$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));

$query = "UPDATE board SET board = '0010001002000001001010000000000000000000010000012020100002010002'";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
//$row = mysqli_fetch_all($result, MYSQLI_ASSOC);

if ($result) {
    echo 'OK!';
}

mysqli_close($link); // закрываем подключение к БД
