import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Configurar Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAu1cx1J9ihabcJuaIu0clTXtU7JpyOwCM",
    authDomain: "projetoaplicado-1.firebaseapp.com",
    databaseURL: "https://projetoaplicado-1-default-rtdb.firebaseio.com",
    projectId: "projetoaplicado-1",
    storageBucket: "projetoaplicado-1.appspot.com",
    messagingSenderId: "546978495496",
    appId: "1:546978495496:web:502e5bab60ead7fcd0a5bd",
    measurementId: "G-WB0MPN3701"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const resetPasswordForm = document.getElementById('resetPasswordForm');
const messageElement = document.getElementById('message');

// Capturar o código de redefinição de senha da URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');

resetPasswordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    
    // Verificar se o código e a nova senha estão corretos
    if (oobCode && newPassword) {
        // Utilizar confirmPasswordReset da API modular corretamente
        confirmPasswordReset(auth, oobCode, newPassword)
        .then(() => {
            messageElement.textContent = "Senha redefinida com sucesso!";
            messageElement.style.color = "green";
        })
        .catch((error) => {
            messageElement.textContent = "Erro ao redefinir senha: " + error.message;
        });
    } else {
        messageElement.textContent = "Por favor, insira uma nova senha válida.";
    }
});
