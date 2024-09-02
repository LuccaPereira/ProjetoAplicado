function clickMenu() {
    if(itens.style.display == 'block'){
        itens.style.display = 'none';
    } else {
        itens.style.display = 'block'
    }
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');
    
    window.location.href = '../View/login.html';
});
