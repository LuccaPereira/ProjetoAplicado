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

    const clienteForm = document.getElementById("clienteForm");
    if (clienteForm) {
        clienteForm.addEventListener("submit", submitClientes);
    } else {
        console.error("Elemento com ID 'clienteForm' não foi encontrado.");
    }

    function paginaPerfil() {
        window.location.href = '../View/perfilAdvogado.html';
    }

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


    const databaseURL = firebaseConfig.databaseURL;
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    if (clienteForm) {
        if (clienteForm.checkValidity()) {
            // Sua lógica
        } else {
            console.error("O clienteFormulário não é válido.");
        }
    } else {
        console.error("Elemento com ID 'clienteForm' não foi encontrado.");
    }

    // Verifica se o clienteFormulário é válido
    if (clienteForm.checkValidity()) {
        const databaseURL = firebaseConfig.databaseURL;
        const collectionPath = "Cliente";
        const url = `${databaseURL}/${collectionPath}.json`;

        axios.get(url)
            .then(response => {
                const clientes = response.data;
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
                                    return;
                                }

                                break;
                            }
                        }
                    }
                }

                if (clienteKeyExistente) {
                    const oData = { senha: senha };
                    const clientRef = firebase.database().ref(`${collectionPath}/${clienteKeyExistente}`);

                    clientRef.update(oData)
                        .then(async () => {
                            alert("Senha do cliente foi atualizada com sucesso!");
                            await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado); // Chamada atualizada
                            window.location.href = "../View/menu.html";
                            clienteForm.reset();
                        })
                        .catch(error => {
                            alert("Erro ao atualizar senha do cliente: " + error.message);
                        });
                } else {
                    const oData = { cpf: cpf, senha: senha };

                    axios.post(url, oData)
                        .then(async () => {
                            alert("Novo cliente foi adicionado com sucesso!");
                            await enviarEmail(cpf, senha, email, nomeAdvogado, oabAdvogado); // Chamada atualizada
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