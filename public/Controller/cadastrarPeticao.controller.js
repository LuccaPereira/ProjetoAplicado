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
            Swal.fire({
                title: 'Cliente Cadastrado! ',
                text: `O cliente foi cadastrado com sucesso, você podera ver ele na aba da tabela`,
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#0a3030',
                confirmButtonText: 'Legal!'
            }).then((result) => {
                if (result.isConfirmed) {
            window.location.reload();
            }});
        })
        .catch(e => {
            Swal.fire('Erro!', 'O Cliente não foi criado. Verifique se os campos estão preenchidos!', 'error');
        });
});
