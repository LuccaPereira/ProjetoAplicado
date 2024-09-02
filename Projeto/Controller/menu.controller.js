function clickMenu() {
    if(itens.style.display == 'block'){
        itens.style.display = 'none';
    } else {
        itens.style.display = 'block'
    }
}

document.getElementById('logoutButton').addEventListener('click', function() {
    // Remover o token de autenticação do localStorage ou sessionStorage
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
});
