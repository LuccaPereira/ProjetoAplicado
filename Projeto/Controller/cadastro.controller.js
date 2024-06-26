import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

async function registrarUsuario(email, senha) {
   try {
        const app = initializeApp(firebaseConfig);
        const { getAuth, createUserWithEmailAndPassword, sendEmailVerification } = require('firebase/auth');
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        await sendEmailVerification(user);
        console.log("Email de verificação enviado para", user.email);
    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message);
    }
}

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


async function submitForm() {
    var form = document.getElementById('cadAdv');

    if (form.checkValidity()) {
        const nome = document.getElementById('nome').value;
        const OAB = document.getElementById('OAB').value;
        const cpf = document.getElementById('inputCpf').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

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
        await registrarUsuario(email, senha);
        alert("Novo advogado registrado com sucesso.");
        window.location.href = "../View/login.html";

    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

