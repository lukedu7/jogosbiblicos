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
    <title>Criar e Responder Quiz Bíblico</title>
    <link rel="stylesheet" href="021.criar.css">
    <script src="020.criar.js" defer></script>
</head>
<body>
    <div class="quiz-header">
        <h1>Criar e Responder Meu Quiz</h1>
    </div>
    
    <div id="quizCreation">
        <h2>Escreva suas perguntas</h2>
        <div id="perguntaContainer">
            <label id="perguntaLabel">Pergunta 1:</label>
            <input type="text" id="pergunta" placeholder="Digite a pergunta" /><br/>
            <label>Resposta Correta:</label>
            <input type="text" id="respostaCorreta" placeholder="Resposta correta" /><br/>
            <label>Alternativa 1:</label>
            <input type="text" id="alternativa1" placeholder="Alternativa 1" /><br/>
            <label>Alternativa 2:</label>
            <input type="text" id="alternativa2" placeholder="Alternativa 2" /><br/>
            <label>Alternativa 3:</label>
            <input type="text" id="alternativa3" placeholder="Alternativa 3" /><br/>
            <button class="styled-button" onclick="adicionarPergunta()">Adicionar Pergunta</button>
        </div>
        <button class="styled-button" onclick="confirmarQuiz()">Confirmar</button>
    </div>
    
    <div id="quizContainer" style="display: none;"></div>
    <div id="result" style="display: none;"></div>
</body>
</html>