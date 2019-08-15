<?php // Скрипт проверки

// Соединяемся с БД
$link = mysqli_connect("localhost", "checkers", "Checkers-123456", "checkers");

if (isset($_COOKIE['id']) and isset($_COOKIE['hash'])) {
    $query = mysqli_query($link, "SELECT * FROM users WHERE user_id = '" . intval($_COOKIE['id']) . "' LIMIT 1");
    $userdata = mysqli_fetch_assoc($query);

    if (($userdata['user_hash'] !== $_COOKIE['hash']) or ($userdata['user_id'] !== $_COOKIE['id'])) {
        setcookie("id", "", time() - 3600 * 24 * 30 * 12, "/");
        setcookie("hash", "", time() - 3600 * 24 * 30 * 12, "/");
        print "Хм, что-то не получилось";
    } else {
        print "Привет, " . $userdata['user_login'] . ". Всё работает!"; ?>

        <!DOCTYPE HTML>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Checkers</title>
        </head>
        <body>
        <button onclick="location.href = 'http://project.local/checkers/checkers.html'">New game</button>
        </body>
        </html>

        <?php
    }
} else {
    print "Включите куки";
}
?>
