import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { updateProfileInDatabase, updateLocalStorage } from '../model/perfilAdvogado.js';

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
function getLoggedInLawyer() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                const db = getDatabase(app);
                const lawyerRef = ref(db, 'Advogado/' + uid);

                get(lawyerRef)
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            resolve({ uid: uid, ...snapshot.val() });
                        } else {
                            console.log("Nenhum advogado encontrado com esse UID.");
                            resolve(null);
                        }
                    })
                    .catch(error => {
                        console.error("Erro ao acessar o banco de dados:", error);
                        reject(error);
                    });
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
        // Você pode chamar a função bringInfoModal aqui para carregar informações do advogado logado
        bringInfoModal();
    } else {
        console.log("Nenhum usuário logado.");
        // Aqui você pode redirecionar para a página de login, se necessário
    }
});

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
        nome: document.getElementById('nome').querySelector('input').value,
        job: document.getElementById('job').querySelector('input').value,
        senha: document.getElementById('senha').querySelector('input').value,
        OAB: document.getElementById('oab').querySelector('input').value,
        email: document.getElementById('email').querySelector('input').value
    };

    const loggedInLawyer = await getLoggedInLawyer();
    if (loggedInLawyer) {
        updateProfileInDatabase(loggedInLawyer.uid, profileData) // Agora passando o UID corretamente
            .then(() => {
                alert("Perfil atualizado com sucesso!");
                updateLocalStorage(profileData);
                document.querySelectorAll('.profile-field').forEach(field => {
                    toggleEditMode(field);
                    field.innerHTML = field.querySelector('input').value; // Atualiza o valor final
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


export async function bringInfoModal() {
    const loggedInLawyer = await getLoggedInLawyer();
    console.log("Dados do advogado logado:", loggedInLawyer); 

    // Verifica se os elementos HTML existem
    console.log("Elementos do DOM:");
    console.log("nome:", document.getElementById('nome'));
    console.log("job:", document.getElementById('job'));
    console.log("email:", document.getElementById('email'));
    console.log("senha:", document.getElementById('senha'));
    console.log("OAB:", document.getElementById('oab'));

    if (loggedInLawyer && loggedInLawyer.PerfilAdvogado) {
        // Acessa os dados do advogado na nova estrutura
        const perfilAdvogado = loggedInLawyer.PerfilAdvogado;

        document.getElementById('nome').innerText = perfilAdvogado.nome || '';
        document.getElementById('job').innerText = perfilAdvogado.job || 'Advogado';
        document.getElementById('email').innerText = perfilAdvogado.email || '';
        document.getElementById('senha').innerText = perfilAdvogado.senha || '';
        document.getElementById('oab').innerText = perfilAdvogado.OAB || '';
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
            window.location.href = '../View/perfilAdvogado.html';
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
