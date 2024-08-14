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

function submitClientes(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Configuração do Firebase
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

    // Verifica se há campos vazios
    if (!cpf || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Verifica se o CPF é válido
    if (!validarCPF(cpf)) {
        alert("CPF inválido!");
        return;
    }

    // Verifica se a senha é válida
    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    // Verifica se o formulário é válido
    if (form.checkValidity()) {
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

                    axios.post(url, oData)
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
}
