import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase(app);

// Função para login e redirecionamento baseado no e-mail
async function loginWithEmailAndCheckClient(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuário autenticado:', user);

        const userInfo = {
            uid: user.uid,
            email: user.email,
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userInfo));

        // Verifica se o e-mail existe na coleção 'Cliente'
        const isClient = await checkIfEmailIsClient(email);

        if (isClient) {
            console.log('Redirecionando para tabelaCliente.html');
            window.location.href = "../View/tabelaCliente.html"; // Redireciona para a página de clientes
        } else {
            console.log('Redirecionando para menu.html');
            window.location.href = "../View/menu.html"; // Redireciona para a página de menu se não for cliente
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showErrorModal('Erro ao fazer login: ' + error.message);
    }
}

// Função para verificar se o e-mail existe na coleção 'Cliente'
async function checkIfEmailIsClient(email) {
    const advogadoRef = ref(db, 'Advogado');
    const advogadoSnapshot = await get(advogadoRef);

    if (!advogadoSnapshot.exists()) {
        console.log('Nenhum advogado encontrado.');
        return false; // Retorna false se não houver advogados
    }

    const advogados = advogadoSnapshot.val();
    // Percorre todos os advogados
    for (const numeroOAB in advogados) {
        const perfilClienteRef = ref(db, `Advogado/${numeroOAB}/PerfilDoCliente`);
        const perfilClienteSnapshot = await get(perfilClienteRef);

        if (perfilClienteSnapshot.exists()) {
            const clientes = perfilClienteSnapshot.val();
            // Percorre todos os clientes
            for (const cpf in clientes) {
                const loginData = clientes[cpf]; // Obtemos o objeto correspondente ao CPF
                if (loginData && loginData.email === email) {
                    console.log(`E-mail encontrado para o CPF ${cpf} no advogado ${numeroOAB}`);
                    return true; // Retorna true se o e-mail for encontrado
                }
            }
        } else {
            console.log(`Perfil de cliente não encontrado para o advogado ${numeroOAB}`);
        }
    }

    console.log('E-mail não encontrado em nenhum advogado.');
    return false; // Retorna false se o e-mail não for encontrado em nenhum advogado
}

// Função para mostrar o modal de erro
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
            const email = document.getElementById('email').value; // Captura o e-mail
            const password = document.getElementById('senha').value; // Captura a senha
            loginWithEmailAndCheckClient(email, password);
        });
    } else {
        console.error("Formulário de login não encontrado.");
    }
});
