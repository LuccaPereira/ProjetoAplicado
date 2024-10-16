import { getLoggedInLawyer, updateProfileInDatabase, updateLocalStorage } from '../model/perfilAdvogado.js';

export function editProfile() {
    document.querySelectorAll('.profile-field').forEach(field => {
        field.classList.toggle('readonly');
        field.classList.toggle('editable');

        if (field.classList.contains('editable')) {
            const value = field.innerText;
            field.innerHTML = `<input type="text" value="${value}">`;
        } else {
            const input = field.querySelector('input');
            field.innerHTML = input.value;
        }
    });

    document.getElementById('saveProfileBtn').style.display = 'inline-block';
}

export function saveProfile() {
    const profileData = {
        nome: document.getElementById('name').querySelector('input').value,
        job: document.getElementById('job').querySelector('input').value,
        senha: document.getElementById('senha').querySelector('input').value,
        OAB: document.getElementById('oab').querySelector('input').value,
        email: document.getElementById('email').querySelector('input').value
    };

    const loggedInLawyer = getLoggedInLawyer();
    if (loggedInLawyer) {
        updateProfileInDatabase(loggedInLawyer.OAB, profileData)
            .then(() => {
                alert("Perfil atualizado com sucesso!");
                updateLocalStorage(profileData);
                document.querySelectorAll('.profile-field').forEach(field => {
                    field.classList.toggle('readonly');
                    field.classList.toggle('editable');
                    field.innerHTML = field.querySelector('input').value;
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

export function bringInfoModal() {
    const loggedInLawyer = getLoggedInLawyer();
    if (loggedInLawyer) {
        document.getElementById('name').innerText = loggedInLawyer.nome || '';
        document.getElementById('job').innerText = 'Advogado';
        document.getElementById('email').innerText = loggedInLawyer.email || '';
        document.getElementById('senha').innerText = loggedInLawyer.senha || '';
        document.getElementById('oab').innerText = loggedInLawyer.OAB || '';
    } else {
        console.log("Nenhum advogado está logado.");
    }
}
function clickMenucerto() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    clickMenucerto();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInLawyer');
            localStorage.removeItem('loggedInCliente');
            window.location.href = '../View/login.html';
        });
    }

    const loginBnt = document.getElementById('loginButton');
    if (loginBnt) {
        loginBnt.addEventListener('click', function() {
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
        bringInfoModal();
        uploadProfileImage();
        
    });

    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    document.getElementById('editProfileButton').addEventListener('click', editProfile);
}

initialize();