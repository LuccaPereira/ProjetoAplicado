function logout() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');
    window.location.href = '../View/login.html';
}

function oabAdvogadoLogado() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    return loggedInLawyerString ? JSON.parse(loggedInLawyerString) : null;
}

module.exports = { logout, oabAdvogadoLogado };
