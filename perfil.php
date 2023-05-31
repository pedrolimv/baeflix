<?php
session_start();
// Verifica se a sessão não está configurada corretamente
if (session_status() !== PHP_SESSION_ACTIVE) {
    header("Location: index.php");
}

// Verifica se a variável de sessão está definida
if (!isset($_SESSION["email"])) {
    header("Location: index.php");
}

// Se chegou até aqui, a sessão está correta
// Você pode continuar com a exibição da página protegida
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="images/icon.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="images/app-icon.png">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/perfil.css">
    <title>Baeflix</title>
</head>
<body>
    <!--session_start();
      
    if($_SESSION['login'] == false){
        echo "<script>alert('Faça login para prosseguir!',window.location.href='index.html')</script>";
    }-->
    <div class="container">
        <h1>Quem está assistindo?</h1>
        <div class="profiles">
            <div class="profile">
                <a style="text-decoration: none;" href="inicio.php">
                    <img src="images/user.png">
                    <p>Beatriz</p>
                </a>
            </div>
        </div>
        <div class="manage-profiles">
          <button>Gerenciar perfis</button>
      </div>
    </div>
</body>
</html>
