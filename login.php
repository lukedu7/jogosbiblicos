<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("Location: index.php");
    exit;
}

require_once "config.php";

$username = $password = "";
$username_err = $password_err = $login_err = "";

// Adicione esta linha para verificar se há uma mensagem de sucesso do registro
$success_message = isset($_SESSION['register_success']) ? $_SESSION['register_success'] : '';
unset($_SESSION['register_success']); // Limpa a mensagem após exibi-la

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(empty(trim($_POST["username"]))){
        $username_err = "Por favor, insira o nome de usuário.";
    } else{
        $username = trim($_POST["username"]);
        echo "Username: " . $username . "<br>";

    }
    
    if(empty(trim($_POST["password"]))){
        $password_err = "Por favor, insira sua senha.";
    } else{
        $password = trim($_POST["password"]);
        echo "Password: " . $password . "<br>";

    }
    
    if(empty($username_err) && empty($password_err)){
        $sql = "SELECT id, username, password FROM usuarios WHERE username = ?";
        
        if($stmt = mysqli_prepare($conn, $sql)){
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            
            $param_username = $username;
            
            if(mysqli_stmt_execute($stmt)){
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){                    
                    mysqli_stmt_bind_result($stmt, $id, $username, $hashed_password);
                    if(mysqli_stmt_fetch($stmt)){
                        if(password_verify($password, $hashed_password)){
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;                            
                            
                            header("Location: index.php");
                            exit();
                        } else{
                            $login_err = "Nome de usuário ou senha inválidos.";
                        }
                    }
                } else{
                    $login_err = "Nome de usuário ou senha inválidos.";
                }
            } else{
                $login_err = "Ops! Algo deu errado. Por favor, tente novamente mais tarde.";
            }

            mysqli_stmt_close($stmt);
        }
    }
    
    mysqli_close($conn);
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Quiz Bíblico</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .bg {
            background-image: url('images/login-background.jpg');
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
        .register-link {
            margin-top: 20px;
            display: block;
            color: #4CAF50;
            text-decoration: none;
        }
        .register-link:hover {
            text-decoration: underline;
        }
        .error-message {
            color: #D8000C;
            background-color: #FFBABA;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .success-message {
            color: #4F8A10;
            background-color: #DFF2BF;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
<div class="bg">
        <div class="login-container">
            <h2>Login - Quiz Bíblico</h2>
            <?php 
            if(!empty($login_err)){
                echo '<div class="error-message">' . $login_err . '</div>';
            }
            if(!empty($success_message)){
                echo '<div class="success-message">' . $success_message . '</div>';
            }
            ?>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <input type="text" name="username" placeholder="Nome de usuário" required>
                <input type="password" name="password" placeholder="Senha" required>
                <input type="submit" value="Entrar">
            </form>
            <a href="register.php" class="register-link">Cadastrar-se</a>
        </div>
    </div>
</body>
</html>
