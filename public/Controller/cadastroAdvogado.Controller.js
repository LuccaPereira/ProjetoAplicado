import { 
    validarCPF, 
    validarEmail, 
    registrarUsuario, 
    verificarOABExistente, 
    verificarCPFExistente, 
    mostrarMensagemErro,
    enviarOdata,
    verificarNome
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

const app = firebase.initializeApp(firebaseConfig); 
const auth = firebase.auth(); 
const database = firebase.database();
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.querySelector("#togglePassword");
    const passwordField = document.querySelector("#senha");

    if (togglePassword && passwordField) {
        togglePassword.addEventListener("click", function () {
            const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
            passwordField.setAttribute("type", type);
            this.classList.toggle("eye-open");
        });
    }

    const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
    const confirmPasswordField = document.querySelector("#Confirmarsenha");

    if (toggleConfirmPassword && confirmPasswordField) {
        toggleConfirmPassword.addEventListener("click", function () {
            const type = confirmPasswordField.getAttribute("type") === "password" ? "text" : "password";
            confirmPasswordField.setAttribute("type", type);
            this.classList.toggle("eye-open");
        });
    }
});

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

    const verifyCpf = await verificarCPFExistente(cpf);
    const verifyOAB = await verificarOABExistente(OAB)

    // Validações básicas
    if (!nome || !OAB || !cpf || !email || !senha || !confirmarSenha) {
        mostrarMensagemErro('Por favor, preencha todos os campos.');
        return;
    }

    const nomeOriginal = nome;
    let nomeFormatado = verificarNome(nomeOriginal);
    
    if (!nomeFormatado) {
        nomeFormatado = verificarNome(nomeOriginal);
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
        if (verifyOAB) {
            mostrarMensagemErro('OAB já cadastrada. Por favor, insira uma OAB diferente.');
            return;
        }
        if (verifyCpf) {
            mostrarMensagemErro('CPF já cadastrado. Por favor, insira um CPF diferente.');
            return;
        }

            // Registrar o usuário com Firebase Auth
            const userCredential = await registrarUsuario(email, senha); // Utiliza a função registrarUsuario
            const uid = userCredential.uid; // Obter o UID do usuário

        // Salvar os dados do advogado no Realtime Database
        const oData = { nomeOriginal: nome, nomeFormatado: nomeFormatado, OAB, CPF: cpf, email, uid, senha};
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

// Adiciona o listener ao evento de submit do formulário
document.querySelector('.cadAdv').addEventListener('submit', submitForm);