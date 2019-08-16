<?php

error_reporting(-1);
$host = 'localhost'; // адрес сервера
$database = 'checkers'; // имя базы данных
$user = 'checkers'; // имя пользователя
$password = 'Checkers-123456'; // пароль
// ппрефикс "p:" - для постоянного (persistent) соединения, остается при переходе на др. скрипт (страницу)
$link = mysqli_connect("p:" . $host, $user, $password, $database) or die("Ошибка " . mysqli_error($link));
