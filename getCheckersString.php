<?php
require_once 'connection.php';

$link = mysqli_connect($host, $user, $password, $database) or die("Ошибка " . mysqli_error($link));
$query ="SELECT board FROM board WHERE 1"; // выбрать записи из табл. board, только поле board
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link)); // выполнить запрос
$row = mysqli_fetch_all($result, MYSQLI_ASSOC); // строки результата - в массив

if($result) {
    echo implode($row[0]); // строка шашек из массива выборки из БД (0-я запись в таблице board)
}

mysqli_close($link); // закрываем подключение к БД
?>