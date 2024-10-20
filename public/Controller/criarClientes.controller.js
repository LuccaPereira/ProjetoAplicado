import { getClientes, updateCliente, addCliente, validarCPF, validarEmail } from '../model/criarClientes.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get, set} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Sua configuração do Firebase
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


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const userLogged = localStorage.getItem('loggedInUser');
const userLoggedJson = JSON.parse(userLogged);
//const urlAtt = `${databaseURL}/Advogado/PerfilAdvogado/${logAdv.uid}.json`;
const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com";
const clienteCollectionPath = `Cliente/PerfilDoCliente`; 
const clienteRef = ref(db, clienteCollectionPath);

document.addEventListener('DOMContentLoaded', () => {
    function clickMenu() {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.getElementById('menuToggle');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('expanded');
            });
        }
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInCliente');
            window.location.href = '../View/login.html';
        });
    }

    const clienteForm = document.getElementById("clienteForm");
    if (clienteForm) {
        clienteForm.addEventListener("submit", submitClientes);
    } else {
        console.error("Elemento com ID 'clienteForm' não foi encontrado.");
    }

    document.getElementById('loginButton').addEventListener('click', function() {
        window.location.href = '../View/perfilAdvogado.html';
    });

    clickMenu();
});

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

async function submitClientes(event) {
    event.preventDefault();

    const clienteForm = document.getElementById("clienteForm");
    if (!clienteForm) {
        console.error("Elemento com ID 'clienteForm' não foi encontrado.");
        return;
    }

    // Captura dos valores dos campos do formulário
    const cpfElement = document.getElementById("cpf");
    const senhaElement = document.getElementById("senha");
    const emailElement = document.getElementById("email");
    const confirmarSenhaElement = document.getElementById('confirmarSenha');
    const numeroOABElement = document.getElementById("numeroOAB");

    if (!cpfElement || !senhaElement || !emailElement || !confirmarSenhaElement || !numeroOABElement) {
        console.error("Um ou mais elementos do formulário não foram encontrados.");
        return;
    }

    const cpf = cpfElement.value;
    const senha = senhaElement.value;
    const email = emailElement.value;
    const confirmarSenha = confirmarSenhaElement.value;
    const numeroOAB = numeroOABElement.value; // OAB do advogado

    // Validações...
    if (!cpf || !senha || !email || !confirmarSenha || !numeroOAB) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido!");
        return;
    }

    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    if (!validarEmail(email)) {
        alert('Favor inserir um e-mail válido.');
        return;
    }

    // Verificar se o advogado existe
    const advRef = ref(db, `Advogado/PerfilAdvogado/${userLoggedJson.uid}`);
    get(advRef)
        .then(async advSnapshot => {
            if (!advSnapshot.exists()) {
                alert("Advogado com essa OAB não encontrado.");
                return;
            }

            // Verifica se o cliente já existe
            const clienteSnapshot = await get(clienteRef);
            const clientes = clienteSnapshot.val();
            let clienteKeyExistente = null;

            if (clientes) {
                for (let clienteKey in clientes) {
                    const clienteData = clientes[clienteKey];

                    if (clienteData.cpf === cpf) {
                        clienteKeyExistente = clienteKey;

                        if (clienteData.senha === senha) {
                            alert("Usuário já cadastrado");
                            await enviarEmail(cpf, senha, email);
                            return;
                        }
                        break;
                    }
                }
            }

            // Se o cliente já existe e a senha é diferente, atualiza a senha
            if (clienteKeyExistente) {
                const clientRef = ref(db, `${clienteCollectionPath}/${clienteKeyExistente}`);

                update(clientRef, { senha: senha })
                    .then(async () => {
                        alert("Senha do cliente foi atualizada com sucesso!");
                        await enviarEmail(cpf, senha, email);
                        clienteForm.reset();
                    })
                    .catch(error => {
                        alert("Erro ao atualizar senha do cliente: " + error.message);
                    });
            } else {
                // Se o cliente não existe, cria um novo cliente
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
                    const user = userCredential.user;
                    const uid = user.uid;
                    
                    const oData = {
                        [uid]: {
                            cpf: cpf,
                            senha: senha,
                            email: email,
                            uid: uid
                        }
                    };
                    await refFunction(clienteCollectionPath, oData);
                    alert("Novo cliente foi adicionado com sucesso!");
                    await enviarEmail(cpf, senha, email);
                    clienteForm.reset();
                } catch (error) {
                    alert("Erro ao registrar o e-mail: " + error.message);
                }
            }
        })
        .catch(error => {
            alert("Erro ao buscar advogado: " + error.message);
        });
}

async function refFunction(clienteCollectionPath, oData) {
    const clienteReferencia = ref(db, `${clienteCollectionPath}`);
    await set(clienteReferencia, oData);
}

async function enviarEmail(cpf, senha, email) {
    const toEmail = email; // E-mail do cliente
    const fromEmail = "smartlegalentrerprise@gmail.com"; // E-mail do remetente fixo

    console.log('E-mail do destinatário:', toEmail);
    console.log('E-mail do remetente:', fromEmail);

    if (!toEmail) {
        console.error("E-mail do destinatário não encontrado.");
        return;
    }

    console.log('Iniciando envio de e-mail...');

    emailjs.init('iLy3T_KFtR_AdDLBo');

    const templateParams = {
        to_email: toEmail,
        email: toEmail,
        senha: senha,
        reply_to: fromEmail
    };

    try {
        const response = await emailjs.send('service_n2udugz', 'template_bfp8iap', templateParams);
        console.log('E-mail enviado com sucesso!', response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}
