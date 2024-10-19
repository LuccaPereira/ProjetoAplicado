import { montarOData } from '../model/cadastrarPeticao.js';


document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('expanded');
});


document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
})

document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = '../View/perfilAdvogado.html';
});

const form = document.getElementById('petitionForm');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    montarOData()
        .then(() => {
            alert("Novo cliente cadastrado com sucesso!");
            window.location.reload();
        })
        .catch(error => {
            alert(`Erro: ${error}`);
        });
});
