import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, get, } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

import { updateProfileInDatabase, updateLocalStorage } from '../model/perfilCliente.js';

// Configuração do Firebase
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa a autenticação

// Função para obter o advogado logado
// Função para obter o advogado logado
async function getLoggedInCliente() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid; // Obter o uid do usuário logado
                const db = getDatabase(app);
                const advogadoRef = ref(db, `Cliente/PerfilDoCliente/${uid}`); // Acesse diretamente pelo uid

                try {
                    const snapshot = await get(advogadoRef);
                    if (snapshot.exists()) {
                        // Retorna os dados do advogado
                        resolve({ uid: uid, ...snapshot.val() });
                    } else {
                        console.log("Nenhum advogado encontrado com esse UID.");
                        resolve(null);
                    }
                } catch (error) {
                    console.error("Erro ao acessar o banco de dados:", error);
                    reject(error);
                }
            } else {
                console.log("Nenhum advogado está logado.");
                resolve(null);
            }
        });
    });
}
// Monitorar o estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário logado:", user.uid);
        // Chamando a função para carregar as informações do advogado logado
        bringInfoModal(); // Isso já está correto!
    } else {
        console.log("Nenhum usuário logado.");
        // Aqui você pode redirecionar para a página de login, se necessário
    }
});

async function bringInfoModal() {
    console.log("Chamando bringInfoModal...");
    try {
        const ClienteInfo = await getLoggedInCliente(); // Chama a função para obter os dados do advogado

        if (ClienteInfo) {
            console.log("Dados do advogado logado:", ClienteInfo);
            // Atualizando os elementos do modal ou qualquer parte da UI com os dados do advogado
            document.getElementById('nomemodal').innerText = ClienteInfo.nome || "Nome não disponível";
            document.getElementById('senhamodal').innerText = ClienteInfo.senha || "senha não disponível";
            document.getElementById('cpfmodal').innerText = ClienteInfo.cpf || "CPF não disponível";
            document.getElementById('emailmodal').innerText = ClienteInfo.email|| "Email não disponível";

            // Caso tenha mais campos no modal, você pode adicioná-los aqui
            // Exemplo: 
            // document.getElementById('telefone').innerText = advogadoInfo.telefone || "Telefone não disponível";
            
        } else {
            console.log("Nenhum advogado encontrado com esse UID.");
            // Aqui você pode exibir uma mensagem ao usuário ou lidar com a ausência de dados
        }
    } catch (error) {
        console.error("Erro ao trazer informações do advogado:", error);
        // Aqui você pode lidar com o erro, como mostrar uma mensagem de erro ao usuário
    }
}
function toggleEditMode(field) {
    field.classList.toggle('readonly');
    field.classList.toggle('editable');

    if (field.classList.contains('editable')) {
        const value = field.innerText;
        field.innerHTML = `<input type="text" value="${value}">`;
    } else {
        const input = field.querySelector('input');
        field.innerHTML = input.value;
    }
}

export function editProfile() {
    document.querySelectorAll('.profile-field').forEach(field => {
        toggleEditMode(field);
    });
    document.getElementById('saveProfileBtn').style.display = 'inline-block';
}

export async function saveProfile() {
    const profileData = {
        nome: document.getElementById('nomemodal').querySelector('input').value,
        senha: document.getElementById('senhamodal').querySelector('input').value,
        cpf:document.getElementById('cpfmodal').querySelector('input').value,
        email:  document.getElementById('emailmodal').querySelector('input').value
    };

    const loggedInCliente = await getLoggedInCliente(); // Obtém os dados do advogado logado
    if (loggedInCliente) {
        // Passando o uid do advogado logado
        updateProfileInDatabase(loggedInCliente.uid, profileData) // Passando o uid corretamente
            .then(() => {
                alert("Perfil atualizado com sucesso!");
                updateLocalStorage(profileData);
                document.querySelectorAll('.profile-field').forEach(field => {
                    toggleEditMode(field);
                    const inputElement = field.querySelector('input');
                
                    if (inputElement) { // Verifica se o input existe
                        field.innerHTML = inputElement.value; // Atualiza o valor final
                    } else {
                        console.warn("Nenhum input encontrado para o campo:", field);
                    }
                });
                document.getElementById('saveProfileBtn').style.display = 'none';
            })
            .catch(error => {
                console.error("Erro ao salvar detalhes do perfil:", error);
                alert('Erro ao salvar detalhes do perfil. Consulte o console para mais informações.');
            });
    } else {
        console.log("Nenhum advogado está logado.");
    }
}

function clickMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    clickMenu();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInLawyer');
            localStorage.removeItem('loggedInCliente');
            window.location.href = '../View/login.html';
        });
    }

    const loginBtn = document.getElementById('loginButton');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = '../View/perfilCliente.html';
        });
    }
});

export function uploadProfileImage() {
    document.getElementById('profile-image-upload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-image').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

export function initialize() {
    document.addEventListener('DOMContentLoaded', () => {
        clickMenu();
        uploadProfileImage();
    });

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('loggedInLawyer');
        localStorage.removeItem('loggedInCliente');
        window.location.href = '../View/login.html';
    });

    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('editProfileButton').addEventListener('click', editProfile);
}

initialize();
