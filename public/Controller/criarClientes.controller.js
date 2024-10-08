import { getClientes, updateCliente, addCliente, validarCPF, getLoggedInLawyer } from '../model/criarClientes.js';

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

    const form = document.getElementById("formClientes");
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;

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
            window.location.href = "../View/menu.html";
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
            window.location.href = "../View/menu.html";
        }
    } catch (error) {
        console.error("Erro ao acessar o Firebase: ", error);
        alert("Erro: " + error.message);
    }
}
