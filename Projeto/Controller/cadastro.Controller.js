// Função para validar um CPF
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

// Função para validar e-mail usando regex
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Função para registrar o usuário no Firebase Authentication
async function registrarUsuario(email, senha) {
    const firebaseConfig = {
        apiKey: "AIzaSyAu1cx1J9ihabcJuaIu0clTXtU7JpyOwCM",
        authDomain: "projetoaplicado-1.firebaseapp.com",
        databaseURL: "https://projetoaplicado-1-default-rtdb.firebaseio.com",
        projectId: "projetoaplicado-1",
        storageBucket: "projetoaplicado-1.appspot.com",
        messagingSenderId: "546978495496",
        appId: "1:546978495496:web:502e5bab60ead7fcd0a5bd",
        measurementId: "G-WB0MPN3701"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
        return userCredential.user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
}

async function verificarOABExistente(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    try {
        const response = await axios.get(url);
        return response.data !== null;
    } catch (error) {
        console.error("Erro ao verificar OAB:", error);
        throw error;
    }
}

async function submitForm() {
    var form = document.getElementById('cadAdv');

    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const cpf = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('Confirmarsenha').value;

    // Verifica se algum campo está vazio
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
            const collectionPath = "Advogado";
            const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

            const oData = {
                nome: nome,
                OAB: OAB,
                CPF: cpf,
                email: email,
                senha: senha
            };

            await axios.post(url, oData);
            alert("Novo advogado registrado com sucesso.");
            window.location.href = "../View/login.html";
        } catch (error) {
            alert("Erro ao registrar novo advogado: " + error.message);
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

document.querySelector('.cadAdv').addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm();
});
