import { getClientes, updateCliente, addCliente, validarCPF, getLoggedInLawyer } from '../model/criarClientes.js';
import { getLoggedInLawyerEmail } from '../model/perfilAdvogado.js';

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
            localStorage.removeItem('loggedInLawyer');
            localStorage.removeItem('loggedInCliente');
            window.location.href = '../View/login.html';
        });
    }

    const formClientes = document.getElementById("clienteForm");
    if (formClientes) {
        formClientes.addEventListener("submit", submitClientes);
    } else {
        console.error("Elemento com ID 'formClientes' não foi encontrado.");
    }

    document.getElementById('loginBnt').addEventListener('click', function() {
        window.location.href = '../View/perfilAdvogado.html';
    });

    clickMenu();
});

async function submitClientes(event) {
    event.preventDefault();

    const firebaseConfig = {
        apiKey: "AIzaSyDs6dBCSuPHem7uxrtQNkmoM2KF-ZSEslE",
        authDomain: "projetoaplicado-2f578.firebaseapp.com",
        projectId: "projetoaplicado-2f578",
        storageBucket: "projetoaplicado-2f578.appspot.com",
        messagingSenderId: "115355511974",
        appId: "1:115355511974:web:5fca38830eb5a49d3a1867",
        measurementId: "G-T9MFZ37QLX",
        databaseURL: "https://projetoaplicado-1-default-rtdb.firebaseio.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const form = document.getElementById("formClientes");
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;

    if (!cpf || !senha) {
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

    const Lawyer = getLoggedInLawyer();
    console.log("Advogado logado:", Lawyer.OAB);

    // Passar o nome e a OAB do advogado para a função enviarEmail
    const nomeAdvogado = Lawyer.nome; // Supondo que o nome esteja armazenado em 'nome'
    const oabAdvogado = Lawyer.OAB;


    const collectionPath = `Advogado`;
    const PerfilDoCliente = "PerfilDoCliente";
    const url = `${firebaseConfig.databaseURL}/${collectionPath}/${Lawyer.OAB}/${PerfilDoCliente}.json`;

    try {
        const response = await getClientes(url);
        const clientes = response.data;
        let clienteKeyExistente = null;

        if (clientes) {
            for (let clienteKey in clientes) {
                if (clientes.hasOwnProperty(clienteKey)) {
                    const cliente = clientes[clienteKey];
                    if (cliente.cpf === cpf) {
                        clienteKeyExistente = clienteKey;
                        break;
                    }
                }
            }
        }

        if (clienteKeyExistente) {
            const urtl = `${firebaseConfig.databaseURL}/${collectionPath}/${Lawyer.OAB}/${PerfilDoCliente}/${clienteKeyExistente}.json`;
            const oData = { senha: senha };
            await updateCliente(urtl, oData);
            alert("Senha do cliente foi atualizada com sucesso!");
            // Enviar o e-mail com as credenciais usando EmailJS
            await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado); // Chamada atualizada
        } else {
            const oData = {
                [cpf]: {
                   cpf: cpf,
                   senha: senha,
                }
            };
            const uvl = `${firebaseConfig.databaseURL}/${collectionPath}/${Lawyer.OAB}/${PerfilDoCliente}.json`;
            await addCliente(uvl, oData);
            alert("Novo cliente foi adicionado com sucesso!");
            await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado); // Chamada atualizada
        }
    } catch (error) {
        console.error("Erro ao acessar o Firebase: ", error);
        alert("Erro: " + error.message);
    }
}

async function enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado) {
    const toEmail = document.getElementById('email').value;
    const fromEmail = getLoggedInLawyerEmail(); // Obtém o e-mail do advogado logado
    console.log('E-mail do destinatário:', toEmail);
    console.log('E-mail do remetente:', fromEmail);

    if (!toEmail || !fromEmail) {
        console.error("E-mail do destinatário ou remetente não encontrado.");
        return;
    }

    console.log('Iniciando envio de e-mail...');

    emailjs.init('iLy3T_KFtR_AdDLBo');

    const templateParams = {
        to_email: toEmail,
        cpf: cpf,
        senha: senha,
        nome_advogado: nomeAdvogado, // Adiciona o nome do advogado
        oab_advogado: oabAdvogado,    // Adiciona a OAB do advogado
        reply_to: fromEmail // Adiciona o e-mail do advogado no campo reply_to
    };

    try {
        const response = await emailjs.send('service_n2udugz', 'template_bfp8iap', templateParams);
        console.log('E-mail enviado com sucesso!', response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}