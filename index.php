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
    <title>Jogos Bíblicos</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
            overflow: hidden;
        }
        .background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: url('images/imagem-fundo-6.jpg');
            background-size: cover;
            background-position: center;
        }
        .container {
            position: relative;
            z-index: 1;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.5);
        }
        h1 {
            font-size: 3.5em;
            color: #FFF;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            margin-bottom: 40px;
        }
        .btn {
            display: block;
            width: 280px;
            padding: 18px;
            margin: 20px auto;
            font-size: 1.2em;
            color: #FFF;
            background-color: rgba(255, 179, 71, 0.8);
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 8px rgba(0,0,0,0.15);
            background-color: rgba(255, 165, 0, 0.9);
        }
        .instagram-link {
            margin-top: 20px;
            font-size: 1.2em;
            color: #FFF;
            text-decoration: none;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
        }
        .instagram-icon {
            width: 24px;
            height: 24px;
            margin-left: 8px;
        }
        .logout-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            font-size: 1em;
            color: #FFF;
            background-color: rgba(255, 0, 0, 0.7);
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .logout-btn:hover {
            background-color: rgba(255, 0, 0, 0.9);
        }
    </style>
</head>
<body>
    <div class="background"></div>
    <div class="container">
        <h1>Jogos Bíblicos</h1>
        <a href="003.quiz-versiculos.php" class="btn">Quiz para Decorar Versículos</a>
        <a href="008.quiz-curiosidades.php" class="btn">Quiz Curiosidades</a>
        <a href="013.forca.php" class="btn">Jogo da Forca Bíblica</a>
        <a href="016.albumv.php" class="btn">Álbum Bíblico</a>
        <a href="019.criar.php" class="btn">Criar Meu Quiz</a>
        <a href="https://www.instagram.com/lucassbenvenutti/" class="instagram-link" target="_blank">
            Siga-me no Instagram
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" class="instagram-icon">
        </a>
        <a href="logout.php" class="logout-btn">Sair da conta</a>
    </div>
</body>
</html>
