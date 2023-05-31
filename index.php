<?php
$servername = "localhost"; // nome do servidor
$username = "root"; // nome de usuário do MySQL
$password = "usbw"; // senha do MySQL
$database = "db_baeflix"; // nome do banco de dados

// Criar a conexão
$conn = new mysqli($servername, $username, $password, $database);

// Verificar a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Verifica se o formulário de login foi submetido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtém os dados do formulário
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    // Consulta SQL para verificar se o email e a senha correspondem a um usuário válido
    $sql = "SELECT * FROM tb_usuario WHERE nm_email = '$email' AND nm_senha = '$senha'";
    $result = $conn->query($sql);

    // Verifica se encontrou algum registro
    if ($result->num_rows > 0) {
        // Inicia a sessão
        session_start();

        // Define uma variável de sessão para armazenar o email do usuário
        $_SESSION["email"] = $email;

        // Login bem-sucedido
        header("Location: perfil.php");
    } else {
        header("Location: index.php");
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <link rel="icon" href="images/icon.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="images/app-icon.png">
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login.css">
    <title>Baeflix</title>
</head>

<body>
    <div class="header">
        <div class="logo">
            <a href="index.php">
                <img src="images/logo.png">
            </a>
        </div>
    </div>

    <div class="login_body">
        <div class="login_box">
            <h2>Entrar</h2>
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <div class="input_box">
                    <input style="font-family: 'Netflix Sans'; font-size: 16px"required name="email" type="email" placeholder="Email ou número de telefone">
                </div>

                <div class="input_box">
                    <input style="font-family: 'Netflix Sans'; font-size: 16px" required name="senha" type="password" placeholder="Senha">
                </div>

                <div>
                    <button class="submit">
                        Entrar
                    </button>
                </div>
            </form>

            <div class="support">
                <div style="font-size: 14px" class="remember">
                    <span><input type="checkbox" style="margin: 0;padding: 0; height: 13px;"></span>
                    <span>Lembre-se de mim</span>
                </div>
                <div style="font-size: 14px" class="help">
                    <a href="index.html">
                        Precisa de ajuda?
                    </a>
                </div>
            </div>

            <div class="login_footer">
                <div style="font-size: 16px" class="sign_up">
                    <p>Novo por aqui? <a href="#">Assine agora.</a></p>
                </div>

                <div style="font-size: 13px" class="terms">
                    <p>Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô. <a href="#">Saiba mais</a></p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>