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

const app = firebase.initializeApp(firebaseConfig); 
const auth = firebase.auth(); 
const database = firebase.database();

// Validation Functions
async function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(cpf.charAt(9)) !== digitoVerif1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return parseInt(cpf.charAt(10)) === digitoVerif2;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Firebase Functions
async function registrarUsuario(email, senha) {

    if (!firebase.apps.length) {
        app
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
        return userCredential.user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error; // Propagate the error for handling later
    }
}
async function verificarOABExistente(OAB) {
    const url = `https://projetoaplicado-1-default-rtdb.firebaseio.com/Advogado/PerfilAdvogado.json`;
    try {
        const response = await axios.get(url);
        const advogados = response.data;

        // Verifica se existem advogados no banco de dados
        if (!advogados) return false;

        // Itera pelos perfis de advogados para verificar se a OAB já existe
        return Object.values(advogados).some(advogado => 
            advogado.OAB && advogado.OAB === OAB
        );
    } catch (error) {
        console.error("Erro ao verificar OAB:", error);
        throw error;
    }
}

async function verificarCPFExistente(cpf) {
    const url = `https://projetoaplicado-1-default-rtdb.firebaseio.com/Advogado/PerfilAdvogado.json`;
    try {
        const response = await axios.get(url);
        const advogados = response.data;

        // Verifica se existem advogados no banco de dados
        if (!advogados) return false;

        // Itera pelos perfis de advogados para verificar se o CPF já existe
        return Object.values(advogados).some(advogado => 
            advogado.CPF && advogado.CPF === cpf
        );
    } catch (error) {
        console.error("Erro ao verificar o CPF:", error);
        throw error;
    }
}


// Error Display Function
async function mostrarMensagemErro(mensagem, duration = 5000) {
    const mensagemErro = document.createElement('div');
    mensagemErro.classList.add('mensagem-erro');
    mensagemErro.textContent = mensagem;

    const formContainer = document.querySelector('.cadastro-box');
    formContainer.appendChild(mensagemErro);

    setTimeout(() => {
        mensagemErro.remove();
    }, duration);
}

async function enviarOdata(uid, oData) {
    await database.ref(`Advogado/PerfilAdvogado/${uid}`).set(oData);
}

// Exporting Functions
export {
    validarCPF,
    validarEmail,
    registrarUsuario,
    verificarOABExistente,
    verificarCPFExistente,
    mostrarMensagemErro,
    enviarOdata
};
