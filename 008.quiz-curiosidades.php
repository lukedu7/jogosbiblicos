<?php
session_start();

// Verifica se o usuário está logado
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Curiosidades Bíblicas</title>
    <link rel="stylesheet" href="002.style.css">
</head>
<body>
    <div class="quiz-header">
        <h1>Quiz Curiosidades Bíblicas</h1>
        <div id="levelInfo">Nível 1</div>
        <div id="progressInfo">Questão 1 de 10</div>
    </div>
    <div id="questionContainer"></div>
    <div id="result"></div>
    <button id="nextButton" style="display: none;">Próximo Nível</button>
    <button id="retryButton" style="display: none;">Tentar Novamente</button>
    <script src="009.script_curiosidades.js"></script>
</body>
</html>