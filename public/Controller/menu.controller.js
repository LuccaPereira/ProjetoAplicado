function clickMenu() {
<<<<<<< HEAD:Projeto/Controller/menu.controller.js
    if(itens.style.display == 'block'){
        itens.style.display = 'none';
    } else {
        itens.style.display = 'block'
    }
}

document.getElementById('logoutButton').addEventListener('click', function() {
    // Remover o token de autenticação do localStorage ou sessionStorage
=======
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });
}

document.getElementById('logoutButton').addEventListener('click', function() {
>>>>>>> 312306bfab98b1842a5574410ef17c893e5c3e6c:public/Controller/menu.controller.js
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
<<<<<<< HEAD:Projeto/Controller/menu.controller.js
=======
})

function paginaPerfil() {
    window.location.href = '../View/perfilAdvogado.html';
}


document.addEventListener('DOMContentLoaded', () => {
    clickMenu();
>>>>>>> 312306bfab98b1842a5574410ef17c893e5c3e6c:public/Controller/menu.controller.js
});
