const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('loggedInLawyer');
        localStorage.removeItem('loggedInCliente');
        window.location.href = '../View/login.html';
    });
}
