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

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

    // Inicializa o Firebase apenas uma vez
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
        return userCredential.user; // Retorna o usuário registrado
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error; // Propaga o erro
    }
}

async function verificarOABExistente(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    try {
        const response = await axios.get(url);
        return response.data !== null; // Retorna true se a OAB já existe
    } catch (error) {
        console.error("Erro ao verificar OAB:", error);
        throw error; // Propaga o erro
    }
}

async function verificarCPFExistente(cpf) {
    try {
        const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/"; // Substitua pelo seu URL do Firebase
        const response = await axios.get(`${databaseURL}/Advogado.json`);
        
        const advogados = response.data;

        // Verifica se os dados foram retornados corretamente
        if (!advogados) {
            return false; // Não há advogados cadastrados, então o CPF não existe
        }

        // Verifica se algum advogado possui o CPF informado
        for (const OAB in advogados) {
            const perfilAdvogado = advogados[OAB].PerfilAdvogado; // Acessa o nó PerfilAdvogado
            if (perfilAdvogado && perfilAdvogado.CPF === cpf) {
                return true; // CPF já existe
            }
        }

        return false; // CPF não existe
    } catch (error) {
        console.error("Erro ao verificar o CPF: ", error);
        throw error; // Lança o erro para ser tratado no fluxo principal
    }
}

async function submitForm(event) {
    event.preventDefault();

    // Obtenha o elemento do formulário
    const form = event.target; // O elemento que disparou o evento é o formulário

    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const cpf = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('Confirmarsenha').value;

    // Validações
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

    // Verifica se o formulário é válido
    if (form.checkValidity()) {
        try {
            const OABExistente = await verificarOABExistente(OAB);
            const CPFExistente = await verificarCPFExistente(cpf); // Função para verificar CPF no banco de dados

            if (OABExistente) {
                mostrarMensagemErro('OAB já cadastrada. Por favor, insira uma OAB diferente.');
                return;
            }

            if (CPFExistente) {
                mostrarMensagemErro('CPF já cadastrado. Por favor, insira um CPF diferente.');
                return;
            }

            // Registrar o usuário com Firebase Auth
            const userCredential = await registrarUsuario(email, senha); // Utiliza a função registrarUsuario
            const uid = userCredential.uid; // Obter o UID do usuário

            // Salvar os dados do advogado no Realtime Database
            const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
            const collectionPath = `Advogado/${OAB}/PerfilAdvogado.json`;
            const url = `${databaseURL}/${collectionPath}`;

            const oData = {
                uid: uid, // Armazene o UID para referência futura
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
            // O email será tratado pelo Firebase diretamente no catch
            if (error.code === 'auth/email-already-in-use') {
                mostrarMensagemErro('Este endereço de email já está em uso. Por favor, insira um email diferente.');
            } else {
                mostrarMensagemErro('Erro ao registrar novo advogado: ' + error.message);
            }
        }
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function mostrarMensagemErro(mensagem) {
    const mensagemErro = document.createElement('div');
    mensagemErro.classList.add('mensagem-erro');
    mensagemErro.textContent = mensagem;

    // Adiciona a mensagem ao container de cadastro
    const formContainer = document.querySelector('.cadastro-box');
    formContainer.appendChild(mensagemErro);

    // Remove a mensagem de erro após 5 segundos
    setTimeout(() => {
        mensagemErro.remove();
    }, 5000);
}

// Adiciona o listener ao evento de submit do formulário
document.querySelector('.cadAdv').addEventListener('submit', submitForm);
