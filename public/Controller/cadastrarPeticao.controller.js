import { montarOData } from '../model/cadastrarPeticao.js';

function clickMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
})

function paginaPerfil() {
    window.location.href = '../View/perfilAdvogado.html';
}


//document.addEventListener('DOMContentLoaded', () => {
//    clickMenu();
//    const formulario = "";
//    if (formulario) {
//        formulario.addEventListener('submit', enviarFormulario);
//      }
//});

function enviarFormulario(event) {
    event.preventDefault();
    montarOData()
        .then(() => {
            alert("Novo cliente cadastrado com sucesso!");
            window.location.reload();
        })
        .catch(error => {
            alert(`Erro: ${error}`);
        });
}
