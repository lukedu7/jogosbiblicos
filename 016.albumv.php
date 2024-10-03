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
    <title>Álbum Bíblico</title>
    <link rel="stylesheet" href="018.albumv.css"> <!-- Alterado para o novo CSS -->
</head>
<body>
    <div class="quiz-header">
        <h1>Álbum Bíblico</h1>
        <div id="levelInfo">Nível: 1</div>
        <div id="progressInfo">Progresso: 0/66 livros</div>
        <div id="bookInfo" style="font-weight: bold;"></div> <!-- Livro em negrito -->
    </div>

    <button id="backToAlbumButton" class="styled-button" onclick="window.location.href='016.albumv.php'">Voltar ao Álbum</button>
    
    <div id="albumContainer" class="container">
        <!-- O álbum será gerado aqui dinamicamente -->
    </div>

    <div id="gameContainer" class="container" style="display: none;">
        <div id="phaseInfo"></div>
        <div id="questionIndicator" class="question-indicator"></div>
        <div id="question" class="question"></div>
        <div id="alternatives" class="alternatives"></div>
        <button id="submitButton" class="styled-button">Enviar Resposta</button>
        <div id="result"></div>
    </div>
    
    <script src="017.albumv.js"></script>
</body>
</html>