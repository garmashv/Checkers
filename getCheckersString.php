<?php

require_once 'connection.php';
$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));

$query ="SELECT * FROM board WHERE 1";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
$row = mysqli_fetch_all($result, MYSQLI_ASSOC);

if($result) {
    echo substr(implode($row[0]), 1, 64); // строка шашек из массива выборки из БД
}

mysqli_close($link); // закрываем подключение к БД
