<?php
// Conexão com o banco de dados
$servername = "localhost/projetoaplicado";
$username = "seu_usuario";
$password = "sua_senha";
$dbname = "nome_do_banco_de_dados";

// Conectando ao banco de dados
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificando a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Verificando se os dados do formulário foram enviados
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coletando os dados do formulário
    $nome = $_POST['nome'];
    $cpf = $_POST['inputCpf'];
    $senha = $_POST['senha'];
    $email = $_POST['email'];

    // Inserindo os dados no banco de dados
    $sql = "INSERT INTO usuarios (nome, cpf, senha, email) VALUES ('$nome', '$cpf', '$senha', '$email')";

    if ($conn->query($sql) === TRUE) {
        echo "Cadastro realizado com sucesso!";
    } else {
        echo "Erro ao cadastrar: " . $conn->error;
    }
}

// Fechando a conexão com o banco de dados
$conn->close();
?>
