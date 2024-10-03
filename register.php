<?php
// Inicia a sessão
session_start();

// Habilita a exibição de erros (remova em produção)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclui o arquivo de configuração
require_once "config.php";

// Inicializa variáveis
$username = $password = "";
$username_err = $password_err = $register_err = "";

// Processa os dados do formulário quando ele é submetido
if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    // Valida o nome de usuário
    if(empty(trim($_POST["username"]))){
        $username_err = "Por favor, insira um nome de usuário.";
    } else{
        $username = trim($_POST["username"]);
        echo "Nome de usuário inserido: " . $username . "<br>";
    }
    
    // Valida a senha
    if(empty(trim($_POST["password"]))){
        $password_err = "Por favor, insira uma senha.";
    } elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "A senha deve ter pelo menos 6 caracteres.";
    } else{
        $password = trim($_POST["password"]);
        echo "Senha inserida (não será exibida em produção): " . $password . "<br>";
    }
    
    // Verifica os erros de entrada antes de inserir no banco de dados
    if(empty($username_err) && empty($password_err)){
        
        // Prepara uma declaração de seleção
        $sql = "SELECT id FROM usuarios WHERE username = ?";
        
        if($stmt = mysqli_prepare($conn, $sql)){
            // Vincula variáveis à declaração preparada como parâmetros
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            
            // Define parâmetros
            $param_username = $username;
            
            // Tenta executar a declaração preparada
            if(mysqli_stmt_execute($stmt)){
                // Armazena resultado
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){
                    $username_err = "Este nome de usuário já está em uso.";
                    echo $username_err . "<br>";
                } else{
                    // Prepara uma declaração de inserção
                    $sql = "INSERT INTO usuarios (username, password) VALUES (?, ?)";
                     
                    if($stmt = mysqli_prepare($conn, $sql)){
                        // Vincula variáveis à declaração preparada como parâmetros
                        mysqli_stmt_bind_param($stmt, "ss", $param_username, $param_password);
                        
                        // Define parâmetros
                        $param_username = $username;
                        $param_password = password_hash($password, PASSWORD_DEFAULT); // Cria um hash da senha
                        
                        // Tenta executar a declaração preparada
                        if(mysqli_stmt_execute($stmt)){
                            // Redireciona para a página de login
                            $_SESSION['register_success'] = "Cadastro realizado com sucesso! Faça login para continuar.";
                            echo "Registro bem-sucedido. Redirecionando para login.php...<br>";
                            header("location: login.php");
                            exit();
                        } else{
                            echo "Algo deu errado. Por favor, tente novamente mais tarde. Erro: " . mysqli_error($conn) . "<br>";
                        }
                    } else {
                        echo "Erro na preparação da declaração SQL de inserção: " . mysqli_error($conn) . "<br>";
                    }
                }
            } else{
                echo "Oops! Algo deu errado. Por favor, tente novamente mais tarde. Erro: " . mysqli_error($conn) . "<br>";
            }

            // Fecha a declaração
            mysqli_stmt_close($stmt);
        } else {
            echo "Erro na preparação da declaração SQL de seleção: " . mysqli_error($conn) . "<br>";
        }
    } else {
        echo "Existem erros no formulário. Por favor, corrija-os e tente novamente.<br>";
    }
    
    // Fecha a conexão
    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Quiz Bíblico</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .bg {
            background-image: url('images/login-background.jpg'); /* Substitua pelo caminho da sua imagem de fundo */
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background-color: rgba(255, 255, 255, 0.8);
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            text-align: center;
        }
        h2 {
            margin-bottom: 20px;
            color: #333;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        input[type="submit"] {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .login-link {
            margin-top: 20px;
            display: block;
            color: #4CAF50;
            text-decoration: none;
        }
        .login-link:hover {
            text-decoration: underline;
        }
        .error-message {
            color: #D8000C;
            background-color: #FFBABA;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
<div class="bg">
        <div class="login-container">
            <h2>Registro - Quiz Bíblico</h2>
            <?php 
            if(!empty($username_err)){
                echo '<div class="error-message">' . $username_err . '</div>';
            }
            if(!empty($password_err)){
                echo '<div class="error-message">' . $password_err . '</div>';
            }
            if(!empty($register_err)){
                echo '<div class="error-message">' . $register_err . '</div>';
            }
            ?>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <input type="text" name="username" placeholder="Nome de usuário" value="<?php echo $username; ?>" required>
                <input type="password" name="password" placeholder="Senha" required>
                <input type="submit" value="Registrar">
            </form>
            <a href="login.php" class="login-link">Já tem uma conta? Entre aqui.</a>
        </div>
    </div>
</body>
</html>
