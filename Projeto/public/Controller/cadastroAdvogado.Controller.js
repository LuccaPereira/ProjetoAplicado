const {
    validarCPF,
    validarEmail,
    registrarUsuario,
    verificarOABExistente
} = require('../model/cadastroAdvogado');

async function submitForm(event) {
    event.preventDefault();

    var form = document.getElementById('cadAdv');

    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const cpf = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('Confirmarsenha').value;

    if (!nome || !OAB || !cpf || !email || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!validarCPF(cpf)) {
        alert('Favor inserir um CPF válido.');
        return;
    }

    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    if (OAB.length !== 8) {
        alert('O número da OAB deve conter 8 dígitos.');
        return;
    }

    if (!validarEmail(email)) {
        alert('Favor inserir um e-mail válido.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    if (form.checkValidity()) {
        try {
            const OABExistente = await verificarOABExistente(OAB);

            if (OABExistente) {
                alert('OAB já cadastrada. Por favor, insira uma OAB diferente.');
                return;
            }

            await registrarUsuario(email, senha);

            const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
            const collectionPath = `Advogado/${OAB}/PerfilAdvogado.json`;
            const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

            const oData = {
                nome: nome,
                OAB: OAB,
                CPF: cpf,
                email: email,
                senha: senha
            };

            await axios.put(url, oData);
            alert("Novo advogado registrado com sucesso.");
            window.location.href = "../View/login.html";
        } catch (error) {
            alert("Erro ao registrar novo advogado: " + error.message);
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

document.querySelector('.cadAdv').addEventListener('submit', submitForm);
