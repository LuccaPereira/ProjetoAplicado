function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
        return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    return true;
}

function submitForm() {
    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const CPF = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!validarCPF(CPF)) {
        alert('Favor inserir um CPF válido.');
        return Promise.reject('CPF inválido');
    }

    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return Promise.reject('Senha muito curta');
    }

    if (OAB.length !== 8) {
        alert('O número da OAB deve conter 8 dígitos.');
        return Promise.reject('Número da OAB inválido');
    } 

    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    const oData = {
        nome: nome,
        OAB: OAB,
        CPF: CPF,
        email: email,
        senha: senha
    };

    return axios.post(url, oData)
        .then(response => {
            console.log("Dados enviados para o Firebase:", response.data);
            window.location.href = "../View/login.html";
            return response.data;
        })
        .catch(error => {
            console.error("Erro ao enviar dados para o Firebase:", error);
            throw error;
        });
}

document.querySelector('.cadAdv').addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm()
});
