import { montarOData } from '../model/cadastrarPeticao.js';


document.getElementById('Click').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });
});

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
})

document.getElementById('loginBnt').addEventListener('click', function() {
    window.location.href = '../View/perfilAdvogado.html';
});

document.getElementById('envio').addEventListener('click', function() {
    montarOData()
        .then(() => {
            alert("Novo cliente cadastrado com sucesso!");
            window.location.reload();
        })
        .catch(error => {
            alert(`Erro: ${error}`);
        });
});
