<?php // Страница авторизации

function generateCode($length = 6) // Функция для генерации случайной строки
{
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789";
    $code = "";
    $clen = strlen($chars) - 1;
    while (strlen($code) < $length) {
        $code .= $chars[mt_rand(0, $clen)];
    }
    return $code;
}

// Соединямся с БД
$link = mysqli_connect("localhost", "checkers", "Checkers-123456", "checkers");

if (isset($_POST['submit'])) { // Вытаскиваем из БД запись, у которой логин равняеться введенному
    $query = mysqli_query($link, "SELECT user_id, user_password FROM users WHERE user_login ='" .
        mysqli_real_escape_string($link, $_POST['login']) . "' LIMIT 1");
    $data = mysqli_fetch_assoc($query);

    if ($data['user_password'] === md5(md5($_POST['password']))) { // Сравниваем пароли
        $hash = md5(generateCode(10)); // Генерируем случайное число и шифруем его

        // Записываем в БД новый хеш авторизации
        mysqli_query($link, "UPDATE users SET user_hash ='" . $hash . "' " . " WHERE user_id ='" .
            $data['user_id'] . "'");

        setcookie("id", $data['user_id'], time() + 60 * 60 * 24 * 30); // Ставим куки
        setcookie("hash", $hash, time() + 60 * 60 * 24 * 30, null, null, null,
            true); // httponly !!!

        header("Location: check.php"); // Переадресовываем браузер на страницу проверки нашего скрипта
        exit();

    } else {
        print "Вы ввели неправильный логин/пароль";
    }
}
?>
<form method="POST">
    Логин <input name="login" type="text" required><br>
    Пароль <input name="password" type="password" required><br>
    <input name="submit" type="submit" value="Войти">
</form>