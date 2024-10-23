import {validarCPF, getAdvogadoInfo, getClienteInfo} from "../model/login.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function loginWithEmailAndCheckClient(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuário autenticado:', user);

        const cpfOab = document.getElementById('cpfOab').value;

        let userInfo;

        if (validarCPF(cpfOab)) {
            userInfo = await getClienteInfo(user.uid);
            if (userInfo.cpf === cpfOab) {
                localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
                console.log('Informações do usuário salvas no localStorage:', userInfo);
                window.location.href = "../View/telaInicialCliente.html";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'CPF não cadastrado!'
                });
            }
        } else {
            userInfo = await getAdvogadoInfo(user.uid);
            if (userInfo.oab === cpfOab) {
                localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
                console.log('Informações do usuário salvas no localStorage:', userInfo);
                window.location.href = "../View/menu.html";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'OAB não cadastrado!'
                });
            }
        }

        if (!userInfo) {
            throw new Error('Usuário não encontrado no banco de dados.');
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showErrorModal('Erro ao fazer login: ' + error.message);
    }
}

function showErrorModal(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    const modal = document.getElementById('errorModal');
    modal.style.display = 'block';

    document.getElementById('closeModal').onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Adiciona o listener ao evento de submissão do formulário
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;
            loginWithEmailAndCheckClient(email, password);
        });
    } else {
        console.error("Formulário de login não encontrado.");
    }
});
