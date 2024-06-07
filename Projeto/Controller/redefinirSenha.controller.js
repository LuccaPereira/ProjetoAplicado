function redifinirSenha(event) {
    // Configuração do Firebase para a aplicação
    var config = {
        apiKey: "AIzaSyAu1cx1J9ihabcJuaIu0clTXtU7JpyOwCM",
        authDomain: "projetoaplicado-2f578.firebaseapp.com",
        databaseURL: "https://projetoaplicado-1-default-rtdb.firebaseio.com"
    }

    // Inicializa o Firebase com as configurações fornecidas
    firebase.initializeApp(config);

    // Obtém a referência para o serviço de autenticação do Firebase
    const auth = firebase.auth();

    // Obtém o formulário de redefinição de senha a partir do DOM
    const modificarSenha = document.querySelector('.redefinirSenhaForm');

    // Obtém o valor do campo de entrada de email
    const email = document.getElementById('emailDeRedefinir').value;

    // Envia um email de redefinição de senha para o email fornecido
    auth.sendPasswordResetEmail(email)
        .then(() => {
            console.log('Email de redefinição de senha enviado para:', email);
            alert('Um email de redefinição de senha foi enviado para o seu email.');
            // Redireciona o usuário para a página de login após o email ser enviado
            window.location.href = "../View/login.html";
        })
        .catch((error) => {
            console.error('Erro ao enviar email de redefinição de senha:', error.message);
            alert('Ocorreu um erro ao enviar o email de redefinição de senha. Verifique se o email está correto.');
        });
}

// Adiciona um evento de 'submit' ao formulário de redefinição de senha
// Impede o comportamento padrão do formulário e chama a função 'redifinirSenha'
document.querySelector('.redefinirSenhaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    redifinirSenha();
});
