<?php
session_start();
require_once "config.php";

// Verifica se o usuário está autenticado
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    http_response_code(401); // Define o código de status HTTP para "Não autorizado"
    echo json_encode(["error" => "Usuário não autenticado"]);
    exit;
}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método não permitido
    echo json_encode(["error" => "Método não permitido"]);
    exit;
}

// Obtém e valida os dados JSON
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Dados JSON inválidos"]);
    exit;
}

// Verifica se todos os campos necessários estão presentes
$requiredFields = ['completedBooks', 'currentLevel', 'bookProgress'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Campo obrigatório ausente: $field"]);
        exit;
    }
}

$progresso = json_encode($data);

$sql = "UPDATE usuarios SET progresso = ? WHERE id = ?";

if ($stmt = mysqli_prepare($conn, $sql)) {
    mysqli_stmt_bind_param($stmt, "si", $progresso, $_SESSION["id"]);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success" => "Progresso salvo com sucesso",
            "data" => $data // Retorna os dados salvos para confirmação
        ]);
    } else {
        http_response_code(500); // Erro interno do servidor
        echo json_encode(["error" => "Erro ao salvar progresso: " . mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao preparar a declaração SQL: " . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
