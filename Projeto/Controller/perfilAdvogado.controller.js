function editProfile() {
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

function saveProfile() {
    const odata = {
        nome: document.getElementById('name').querySelector('input').value,
        job: document.getElementById('job').querySelector('input').value,
        senha: document.getElementById('senha').querySelector('input').value,
        OAB: document.getElementById('oab').querySelector('input').value,
        email: document.getElementById('email').querySelector('input').value
    };

    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const loggedInLawyer = JSON.parse(loggedInLawyerString);
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Advogado`;
    const url = `${databaseURL}/${collectionPath}/${loggedInLawyer.OAB}/${'PerfilAdvogado'}.json`;

    axios.patch(url, odata)
        .then(response => {
            alert("Perfil atualizado com sucesso!");
            localStorage.setItem('loggedInLawyer', JSON.stringify(odata));
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
}

function bringInfoModal() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');

    if (loggedInLawyerString) {
        const loggedInLawyer = JSON.parse(loggedInLawyerString);
        document.getElementById('name').innerText = loggedInLawyer.nome || '';
        document.getElementById('job').innerText = 'Advogado';
        document.getElementById('email').innerText = loggedInLawyer.email || '';
        document.getElementById('senha').innerText = loggedInLawyer.senha || '';
        document.getElementById('oab').innerText = loggedInLawyer.OAB || '';
    } else {
        console.log("Nenhum advogado está logado.");
    }
}

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


document.addEventListener('DOMContentLoaded', () => {
    clickMenu();
});

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


bringInfoModal();