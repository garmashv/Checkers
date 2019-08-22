<?php
setcookie("id", "", time() - 3600 * 24 * 30 * 12, "/checkers/");
setcookie("hash", "", time() - 3600 * 24 * 30 * 12, "/checkers/");
header("Location: login.php");
exit();
?>

