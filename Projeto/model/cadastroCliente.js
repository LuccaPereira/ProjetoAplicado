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
    event.preventDefault();

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica se o primeiro dígito verificador está correto
    if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
        return false;
    }

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica se o segundo dígito verificador está correto
    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    return true; // Retorna verdadeiro se o CPF é válido
}

// Função para submeter os dados do formulário de clientes
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

    const form = document.getElementById("clienteForm"); // Obtém o formulário de clientes

    // Verifica se o formulário é válido
    if (form.checkValidity()) {
        const cpf = document.getElementById("cpf").value;
        const senha = document.getElementById("senha").value;

        if (validarCPF(cpf)) {
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
                                    break;
                                }
                            }
                        }
                    }

                    if (clienteKeyExistente) {
                        if (senha.length < 6 || !senha) {
                            alert('A senha deve ter no mínimo 6 caracteres e o campo não pode estar vazio!.');
                            return;
                        }

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
                        if (senha.length < 6 || !senha) {
                            alert('A senha deve ter no mínimo 6 caracteres e o campo não pode estar vazio!.');
                            return;
                        }

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
        } else {
            alert("CPF inválido! Ou vazio!");
        }
    }
}