import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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

// Função para login e buscar dados do advogado no Realtime Database
async function loginWithEmailAndCheckClient(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('Usuário autenticado:', user);

        // Recupera os dados adicionais do advogado no Realtime Database
        const userInfo = await getAdvogadoInfo(user.uid);

        // Verifica se o usuário é cliente ou advogado
        const isClient = await checkIfEmailIsClient(email);

        // Salva as informações completas no localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
        console.log('Informações do usuário salvas no localStorage:', userInfo);

        // Redireciona conforme o tipo de usuário
        if (isClient) {
            console.log('Redirecionando para tabelaCliente.html');
            window.location.href = "../View/tabelaCliente.html";
        } else {
            console.log('Redirecionando para menu.html');
            window.location.href = "../View/menu.html";
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showErrorModal('Erro ao fazer login: ' + error.message);
    }
}

// Função para buscar as informações completas do advogado no Realtime Database
async function getAdvogadoInfo(uid) {
    const advogadoRef = ref(db, `Advogado/PerfilAdvogado/${uid}`);
    const snapshot = await get(advogadoRef);

    if (snapshot.exists()) {
        const dadosAdvogado = snapshot.val();
        return {
            uid: uid,
            email: auth.currentUser.email,
            nome: dadosAdvogado.nome || '',
            oab: dadosAdvogado.OAB || '',
            senha: dadosAdvogado.senha || '',
            cpf: dadosAdvogado.CPF || ''
        };
    } else {
        console.log('Perfil do advogado não encontrado no banco de dados.');
        return { uid: uid, email: auth.currentUser.email };
    }
}

// Função para verificar se o e-mail existe na coleção 'Cliente'
async function checkIfEmailIsClient(email) {
    const advogadoRef = ref(db, 'Advogado');
    const advogadoSnapshot = await get(advogadoRef);

    if (!advogadoSnapshot.exists()) {
        console.log('Nenhum advogado encontrado.');
        return false;
    }

    const advogados = advogadoSnapshot.val();
    for (const numeroOAB in advogados) {
        const perfilClienteRef = ref(db, `Advogado/${numeroOAB}/PerfilDoCliente`);
        const perfilClienteSnapshot = await get(perfilClienteRef);

        if (perfilClienteSnapshot.exists()) {
            const clientes = perfilClienteSnapshot.val();
            for (const cpf in clientes) {
                const loginData = clientes[cpf];
                if (loginData && loginData.email === email) {
                    console.log(`E-mail encontrado para o CPF ${cpf} no advogado ${numeroOAB}`);
                    return true;
                }
            }
        } else {
            console.log(`Perfil de cliente não encontrado para o advogado ${numeroOAB}`);
        }
    }

    console.log('E-mail não encontrado em nenhum advogado.');
    return false;
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
            const email = document.getElementById('email').value;
            const password = document.getElementById('senha').value;
            loginWithEmailAndCheckClient(email, password);
        });
    } else {
        console.error("Formulário de login não encontrado.");
    }
});
