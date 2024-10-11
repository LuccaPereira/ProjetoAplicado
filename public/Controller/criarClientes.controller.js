import { getClientes, updateCliente, addCliente, validarCPF,validarEmail, getLoggedInLawyer } from '../model/criarClientes.js';
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
    
    const clienteForm = document.getElementById("clienteForm");
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;


    if (!cpf || !senha || !email || !confirmarSenha) {
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


    const Lawyer = getLoggedInLawyer();
    console.log("Advogado logado:", Lawyer.OAB);
    const nomeAdvogado = Lawyer.nome;
    const oabAdvogado = Lawyer.OAB;

    const collectionPath = "Advogado";
    const clienteRef = firebase.database().ref(`${collectionPath}/${oabAdvogado}/PerfilDoCliente`);

    clienteRef.once("value")
        .then(async snapshot => {
            const clientes = snapshot.val();
            let clienteKeyExistente = null;

            if (clientes) {
                for (let clienteKey in clientes) {
                    if (clientes.hasOwnProperty(clienteKey)) {
                        const cliente = clientes[clienteKey];

                        if (cliente.cpf === cpf) {
                            clienteKeyExistente = clienteKey;

                            // Verifica se a senha é a mesma do cliente existente
                            if (cliente.senha === senha) {
                                alert("Usuário já cadastrado");
                                await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado);
                                return; // Para aqui se a senha já estiver cadastrada
                            }
                            break; // Pare aqui se encontrar o cliente
                        }
                    }
                }
            }

            // Se o cliente já existe e a senha é diferente, atualiza a senha
            if (clienteKeyExistente) {
                const clientRef = firebase.database().ref(`${collectionPath}/${oabAdvogado}/PerfilDoCliente/${clienteKeyExistente}`);
                
                clientRef.update({ senha: senha })
                    .then(async () => {
                        alert("Senha do cliente foi atualizada com sucesso!");
                        await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado);
                        clienteForm.reset();
                    })
                    .catch(error => {
                        alert("Erro ao atualizar senha do cliente: " + error.message);
                    });
            } else {
                // Se o cliente não existe, cria um novo cliente
                const oData = { cpf: cpf, senha: senha };

                clienteRef.child(cpf).set(oData) // Usa o push para adicionar um novo cliente
                    .then(async () => {
                        alert("Novo cliente foi adicionado com sucesso!");
                        await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado);
                        clienteForm.reset();
                    })
                    .catch(error => {
                        alert("Erro ao adicionar novo cliente: " + error.message);
                    });
            }
        })
        .catch(error => {
            alert("Erro ao buscar clientes: " + error.message);
        });
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