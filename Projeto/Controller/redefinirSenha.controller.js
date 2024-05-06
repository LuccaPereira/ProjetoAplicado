function redifinirSenha(event){
    var config = {
        apiKey: "AIzaSyAu1cx1J9ihabcJuaIu0clTXtU7JpyOwCM",
        authDomain: "projetoaplicado-2f578.firebaseapp.com",
        databaseURL : "https://projetoaplicado-1-default-rtdb.firebaseio.com"
    }

    //var ref = new Firebase("https://projetoaplicado-1-default-rtdb.firebaseio.com")
    
    firebase.initializeApp(config);
    const auth = firebase.auth();
    const modificarSenha = document.querySelector('.redefinirSenhaForm');
    const email = document.getElementById('emailDeRedefinir').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            console.log('Email de redefinição de senha enviado para:', email);
            alert('Um email de redefinição de senha foi enviado para o seu email.');
            window.location.href = "../View/login.html";
        })
        .catch((error) => {
            console.error('Erro ao enviar email de redefinição de senha:', error.message);
            alert('Ocorreu um erro ao enviar o email de redefinição de senha. Verifique se o email está correto.');
        });
}

document.querySelector('.redefinirSenhaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    redifinirSenha();
});