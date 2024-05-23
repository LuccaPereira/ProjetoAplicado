// Função para validar o CPF usando regras específicas do CPF brasileiro
function validarCPF(cpf) {
    // Remove todos os caracteres que não são números
    cpf = cpf.replace(/\D/g, '');

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

    // Inicializa o Firebase se ainda não estiver inicializado
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const form = document.getElementById("clienteForm"); // Obtém o formulário de clientes

    // Verifica se o formulário é válido
    if (form.checkValidity()) {
        const cpf = document.getElementById("cpf").value; // Obtém o valor do CPF
        const senha = document.getElementById("senha").value; // Obtém o valor da senha

        // Verifica se o CPF é válido
        if (validarCPF(cpf)) {
            const databaseURL = firebaseConfig.databaseURL; // URL do banco de dados Firebase
            const collectionPath = "Cliente"; // Caminho da coleção no Firebase
            const url = `${databaseURL}/${collectionPath}.json`; // URL completa para a coleção de clientes

            // Obtém os clientes existentes no Firebase
            axios.get(url)
                .then(response => {
                    const clientes = response.data; // Dados dos clientes obtidos
                    let clienteKeyExistente = null; // Chave do cliente existente, se houver

                    // Verifica se o cliente já existe
                    if (clientes) {
                        for (let clienteKey in clientes) {
                            if (clientes.hasOwnProperty(clienteKey)) {
                                const cliente = clientes[clienteKey];

                                // Se o CPF do cliente já existir, guarda a chave do cliente existente
                                if (cliente.cpf === cpf) {
                                    clienteKeyExistente = clienteKey;
                                    break;
                                }
                            }
                        }
                    }

                    // Se o cliente já existir, atualiza a senha
                    if (clienteKeyExistente) {
                        if (senha.length < 6 || !senha) {
                            alert('A senha deve ter no mínimo 6 caracteres e o campo não pode estar vazio!.');
                            return;
                        }

                        const oData = { senha: senha }; // Dados a serem atualizados
                        const clientRef = firebase.database().ref(`${collectionPath}/${clienteKeyExistente}`); // Referência ao cliente no Firebase

                        // Atualiza a senha do cliente
                        clientRef.update(oData)
                            .then(() => {
                                alert("Senha do cliente foi atualizada com sucesso!");
                                window.location.href = "../View/menu.html"; // Redireciona para a página de menu
                                form.reset(); // Reseta o formulário
                            })
                            .catch(error => {
                                alert("Erro ao atualizar senha do cliente: " + error.message);
                            });
                    } else {
                        // Se o cliente não existir, cria um novo cliente
                        if (senha.length < 6 || !senha) {
                            alert('A senha deve ter no mínimo 6 caracteres e o campo não pode estar vazio!.');
                            return;
                        }

                        const oData = { cpf: cpf, senha: senha }; // Dados do novo cliente

                        // Adiciona o novo cliente no Firebase
                        axios.post(url, oData)
                            .then(() => {
                                alert("Novo cliente foi adicionado com sucesso!");
                                form.reset(); // Reseta o formulário
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
