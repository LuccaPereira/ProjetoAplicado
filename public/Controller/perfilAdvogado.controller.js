import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getDatabase, ref, get, update } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

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
const storage = getStorage(app); // Inicializa o Storage

// Função para obter o advogado logado
async function getLoggedInLawyer() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid; // Obter o uid do usuário logado
                const db = getDatabase(app);
                const advogadoRef = ref(db, `Advogado/PerfilAdvogado/${uid}`); // Acesse diretamente pelo uid

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
        bringInfoModal(); // Chama a função para carregar as informações do advogado logado
    } else {
        console.log("Nenhum usuário logado.");
    }
});

// Função para carregar as informações do advogado no modal
async function bringInfoModal() {
    console.log("Chamando bringInfoModal...");
    try {
        const advogadoInfo = await getLoggedInLawyer();

        if (advogadoInfo) {
            console.log("Dados do advogado logado:", advogadoInfo);

            document.getElementById('nome').innerText = advogadoInfo.nomeOriginal || "Nome não disponível";
            document.getElementById('email').innerText = advogadoInfo.email || "Email não disponível";
            document.getElementById('oab').innerText = advogadoInfo.OAB || "OAB não disponível";
            document.getElementById('senha').innerText = advogadoInfo.senha || "Senha não disponível";
            document.getElementById('job').innerText = advogadoInfo.job || "Advogado";

            // Atualiza a imagem de perfil, se disponível
            const profileImage = advogadoInfo.profileImage || 'default-profile-image-url.png';
            document.getElementById('profile-image').src = profileImage;
        } else {
            console.log("Nenhum advogado encontrado com esse UID.");
        }
    } catch (error) {
        console.error("Erro ao trazer informações do advogado:", error);
    }
}

// Função para alternar entre editar e visualizar
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

// Função para editar o perfil
export function editProfile() {
    document.querySelectorAll('.profile-field').forEach(field => {
        toggleEditMode(field);
    });
    document.getElementById('saveProfileBtn').style.display = 'inline-block';
}

// Função para salvar o perfil
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
        const db = getDatabase(app);
        const userRef = ref(db, `Advogado/PerfilAdvogado/${loggedInLawyer.uid}`);
        await update(userRef, profileData);
        swal.fire("Atualizado!", "Perfil atualizado com sucesso!", "success");
        bringInfoModal(); // Atualiza as informações do advogado

        document.querySelectorAll('.profile-field').forEach(field => {
            toggleEditMode(field);
            const inputElement = field.querySelector('input');
        
            if (inputElement) {
                field.innerHTML = inputElement.value;
            } else {
                console.warn("Nenhum input encontrado para o campo:", field);
            }
        });
        document.getElementById('saveProfileBtn').style.display = 'none';
    } else {
        console.log("Nenhum advogado está logado.");
    }
}

// Função para upload de imagem de perfil
export function uploadProfileImage() {
    document.getElementById('profile-image-upload').addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            try {
                const loggedInLawyer = await getLoggedInLawyer();
                if (!loggedInLawyer) {
                    console.error("Nenhum advogado logado para associar a imagem.");
                    return;
                }

                const lawyerUid = loggedInLawyer.uid;
                const storagePath = `profile-images/${lawyerUid}/${file.name}`;
                const fileRef = storageRef(storage, storagePath);

                // Upload do arquivo para o Firebase Storage
                const snapshot = await uploadBytes(fileRef, file);
                console.log('Upload concluído:', snapshot);

                // Obter a URL de download
                const downloadURL = await getDownloadURL(fileRef);
                console.log('URL da imagem:', downloadURL);

                // Salvar a URL no Realtime Database
                const db = getDatabase(app);
                const userRef = ref(db, `Advogado/PerfilAdvogado/${lawyerUid}`);
                await update(userRef, { profileImage: downloadURL });

                // Atualizar a imagem no DOM
                document.getElementById('profile-image').src = downloadURL;

                alert('Imagem de perfil atualizada com sucesso!');
            } catch (error) {
                console.error('Erro ao fazer upload da imagem:', error);
                alert('Erro ao carregar a imagem. Verifique o console para mais detalhes.');
            }
        }
    });
}

// Função para configurar o menu lateral
function clickMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
}

// Inicialização
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
