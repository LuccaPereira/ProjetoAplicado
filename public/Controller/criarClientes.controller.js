import { cpfModel } from '../model/criarClientes.js';

export const clienteController = {
    submitClientes(event) {
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

        const form = document.getElementById("clienteForm");
        const cpf = document.getElementById("cpf").value;
        const senha = document.getElementById("senha").value;

        if (!cpf || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (!cpfModel.validarCPF(cpf)) {
            alert("CPF inválido!");
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        const databaseURL = firebaseConfig.databaseURL;
        const collectionPath = "Cliente";
        const url = `${databaseURL}/${collectionPath}.json`;

        cpfModel.getClientes(url)
            .then(response => {
                const clientes = response.data;
                let clienteKeyExistente = null;

                if (clientes) {
                    for (let clienteKey in clientes) {
                        if (clientes.hasOwnProperty(clienteKey)) {
                            const cliente = clientes[clienteKey];

                            if (cliente.cpf === cpf) {
                                clienteKeyExistente = clienteKey;

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
                    cpfModel.updateCliente(`${collectionPath}/${clienteKeyExistente}`, oData)
                        .then(() => {
                            alert("Senha do cliente foi atualizada com sucesso!");
                            window.location.href = "../View/menu.html";
                            form.reset();
                        })
                        .catch(error => {
                            alert("Erro ao atualizar senha do cliente: " + error.message);
                        });
                } else {
                    const oData = { cpf: cpf, senha: senha };
                    cpfModel.addCliente(url, oData)
                        .then(() => {
                            alert("Novo cliente foi adicionado com sucesso!");
                            form.reset();
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
};
