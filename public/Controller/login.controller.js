import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Sua configuração do Firebase
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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa o Auth

async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuário autenticado:', user);
        
        // Armazenar informações do usuário no localStorage
        const userInfo = {
            uid: user.uid,
            email: user.email,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
    
        // Redirecionar após login bem-sucedido
        window.location.href = "../View/menu.html"; 
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        
        // Mensagem genérica para todos os erros de autenticação
        if (error.code.startsWith('auth/')) {
            showErrorModal('Credenciais inválidas. Verifique seu email e senha. Se você ainda não tem uma conta, considere se cadastrar.');
        } else {
            showErrorModal('Erro ao fazer login: ' + error.message);
        }
    }
}

// Função para mostrar o modal de erro
function showErrorModal(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message; // Define a mensagem de erro
    const modal = document.getElementById('errorModal');
    modal.style.display = 'block'; // Exibe o modal

    // Adiciona evento para fechar o modal ao clicar no botão de fechar
    document.getElementById('closeModal').onclick = function() {
        modal.style.display = 'none'; // Oculta o modal
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Adiciona o listener ao evento de submissão do formulário
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value; // Captura o e-mail
            const password = document.getElementById('senha').value; // Captura a senha
            login(email, password);
        });
    } else {
        console.error("Formulário de login não encontrado.");
    }
});