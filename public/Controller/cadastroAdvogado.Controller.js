import { 
    validarCPF, 
    validarEmail, 
    registrarUsuario, 
    verificarOABExistente, 
    verificarCPFExistente, 
    mostrarMensagemErro, 
    enviarOdata 
} from "../model/cadastroAdvogado.js";

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

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig); 
const databaseURL = firebaseConfig.databaseURL;

// Exibir/ocultar senha
document.addEventListener("DOMContentLoaded", function () {
    ["togglePassword", "toggleConfirmPassword"].forEach(id => {
        const toggle = document.querySelector(`#${id}`);
        const field = document.querySelector(`#${id === "togglePassword" ? "senha" : "Confirmarsenha"}`);
        if (toggle && field) {
            toggle.addEventListener("click", function () {
                const type = field.getAttribute("type") === "password" ? "text" : "password";
                field.setAttribute("type", type);
                this.classList.toggle("eye-open");
            });
        }
    });
});

// Registrar novo advogado
async function submitForm(event) {
    event.preventDefault();

    // Obtenção de valores do formulário
    const form = event.target;
    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const cpf = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('Confirmarsenha').value;

    // Validações básicas
    if (!nome || !OAB || !cpf || !email || !senha || !confirmarSenha) {
        mostrarMensagemErro('Por favor, preencha todos os campos.');
        return;
    }
    if (!await validarCPF(cpf)) {
        mostrarMensagemErro('Favor inserir um CPF válido.');
        return;
    }
    if (senha.length < 6) {
        mostrarMensagemErro('A senha deve ter no mínimo 6 caracteres.');
        return;
    }
    if (OAB.length !== 8) {
        mostrarMensagemErro('O número da OAB deve conter 8 dígitos.');
        return;
    }
    if (!validarEmail(email)) {
        mostrarMensagemErro('Favor inserir um e-mail válido.');
        return;
    }
    if (senha !== confirmarSenha) {
        mostrarMensagemErro('As senhas não coincidem.');
        return;
    }

    try {
        // Verificações no banco de dados
        if (await verificarOABExistente(OAB)) {
            mostrarMensagemErro('OAB já cadastrada. Por favor, insira uma OAB diferente.');
            return;
        }
        if (await verificarCPFExistente(cpf)) {
            mostrarMensagemErro('CPF já cadastrado. Por favor, insira um CPF diferente.');
            return;
        }

        // Registro no Firebase Auth
        const userCredential = await registrarUsuario(email, senha);
        const uid = userCredential.uid;

        // Salvar os dados do advogado no Realtime Database
        const oData = { nome, OAB, CPF: cpf, email, uid };
        await enviarOdata(uid, oData);

        alert("Novo advogado registrado com sucesso.");
        window.location.href = "../View/login.html";
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            mostrarMensagemErro('Este endereço de email já está em uso. Por favor, insira um email diferente.');
        } else {
            mostrarMensagemErro('Erro ao registrar novo advogado: ' + error.message);
        }
    }
}

// Adiciona o listener ao formulário
document.querySelector('.cadAdv').addEventListener('submit', submitForm);
