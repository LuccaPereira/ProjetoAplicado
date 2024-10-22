import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js'; // Módulo de banco de dados
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js'; // Módulo de armazenamento
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
const auth = getAuth(app);
const storage = getStorage(app);

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

async function fetchImage(fileName) {
    const picUid = await getLoggedInCliente();
    try {
        // Cria a referência da imagem
        const imageRef = storageRef(storage, `profileImages/${picUid.uid}/${fileName}`);
        
        // Obtém a URL de download da imagem
        const url = await getDownloadURL(imageRef);
        
        return url; // Retorna a URL da imagem
    } catch (error) {
        console.error("Erro ao resgatar a imagem:", error);
        throw error; // Repassa o erro se necessário
    }
}

async function bringInfoModal() {
    console.log("Chamando bringInfoModal...");
    try {
        const ClienteInfo = await getLoggedInCliente();
        
        if (ClienteInfo) {
            console.log("Dados do cliente logado:", ClienteInfo);
            
            if (ClienteInfo.foto) {
                const imageUrl = await fetchImage(ClienteInfo.foto);
                document.getElementById('profile-image').src = imageUrl;
            } else {
                console.log("Nome do arquivo da foto não disponível.");
            }

            document.getElementById('nome').innerText = ClienteInfo.nome || "Nome não disponível";
            document.getElementById('senha').innerText = ClienteInfo.senha || "Senha não disponível";
            document.getElementById('cpf').innerText = ClienteInfo.cpf || "CPF não disponível";
            document.getElementById('email').innerText = ClienteInfo.email || "Email não disponível";

            // Caso tenha mais campos no modal, você pode adicioná-los aqui
        } else {
            console.log("Nenhum cliente encontrado.");
            // Aqui você pode exibir uma mensagem ao usuário ou lidar com a ausência de dados
        }
    } catch (error) {
        console.error("Erro ao trazer informações do cliente:", error);
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

export async function savePic() {
    const fileInput = document.getElementById('profile-image-upload');
    if (!fileInput) {
        console.error("Elemento de entrada de arquivo não encontrado.");
        return null;
    }

    const file = fileInput.files[0];
    const picUid = await getLoggedInCliente();

    if (!picUid || !picUid.uid) {
        console.error("Usuário não está logado ou UID não disponível.");
        return null;
    }

    if (file) {
        const imageRef = storageRef(storage, `profileImages/${picUid.uid}/${file.name}`);
        
        try {
            const snapshot = await uploadBytes(imageRef, file); // Envia o arquivo, não o nome
            console.log('Imagem enviada com sucesso!');
            
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('URL da imagem:', downloadURL);
            return file.name; // Retorna o nome do arquivo
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error);
            throw error; 
        }
    } else {
        console.log("Nenhum arquivo selecionado.");
        return null;
    }
}

export async function saveProfile() {
    try {
        const fotoURL = await savePic();
        const nomeInput = document.getElementById('nome')?.querySelector('input');
        const senhaInput = document.getElementById('senha')?.querySelector('input');
        const cpfInput = document.getElementById('cpf')?.querySelector('input');
        const emailInput = document.getElementById('email')?.querySelector('input');

        if (!nomeInput || !senhaInput || !cpfInput || !emailInput) {
            console.error("Um ou mais campos de entrada não foram encontrados.");
            alert("Erro ao salvar o perfil. Verifique se todos os campos estão preenchidos.");
            return; // Retorna se algum campo não for encontrado
        }

        const profileData = {
            nome: nomeInput.value,
            senha: senhaInput.value,
            cpf: cpfInput.value,
            email: emailInput.value,
            ...(fotoURL ? { foto: fotoURL } : {}) // Adiciona a foto somente se estiver presente
        };

        const loggedInCliente = await getLoggedInCliente(); 
        if (loggedInCliente) {
            await updateProfileInDatabase(loggedInCliente.uid, profileData);
            alert("Perfil atualizado com sucesso!");
            updateLocalStorage(profileData);

            document.querySelectorAll('.profile-field').forEach(field => {
                toggleEditMode(field);
                const inputElement = field.querySelector('input');

                if (inputElement) {
                    field.innerHTML = inputElement.value; // Atualiza o campo com o valor
                }
            });

            document.getElementById('saveProfileBtn').style.display = 'none';
        } else {
            console.log("Nenhum cliente está logado.");
        }
    } catch (error) {
        console.error("Erro ao salvar o perfil:", error);
        alert('Erro ao salvar o perfil. Consulte o console para mais informações.');
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
