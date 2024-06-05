function getLawyerByOAB(OAB) {
    // Define a URL do banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    // Define o caminho da coleção no banco de dados
    const collectionPath = "Advogado";
    // Cria a URL completa para acessar os dados do advogado com a OAB fornecida
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    // Faz uma solicitação GET para obter os dados do advogado
    return axios.get(url);
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

function getCpfByCliente(cpfAtivo) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    return axios.get(url);
}

function login() {
    // Obtém o valor do campo de entrada de OAB
    var oab = document.getElementById("OAB").value;
    // Obtém o valor do campo de entrada de senha
    var senha = document.getElementById("senha").value;

    if(validarCPF(oab)) {
        getCpfByCliente(oab)
            .then(response => {
                const cliente = response.data;
                console.log("Dados do advogado:", cliente);
    
                if (!cliente) {
                    alert("Você não está cadastrado ou seu CPF está incorreto");
                    return;
                }
    
                var clienteArray = Object.values(cliente);
                var posicaoCliente = clienteArray.find(clienteGado => {
                    var positionCpf;
                    var senhaClientela;
    
                    if (clienteGado.NomeAdvogado) {
                        const adv = clienteGado.NomeAdvogado.toString();
                        positionCpf = clienteGado[adv].CPFAtivo;
                        senhaClientela = clienteGado[adv].senhaCliente;
                    } else {
                        positionCpf = clienteGado.cpf;
                        senhaClientela = clienteGado.senha;
                    }
    
                    if (oab === positionCpf) {
                        if (senha === senhaClientela) {
                            window.location.href = "../View/consultar.html";
                            return true; 
                        } else {
                            alert("Senha está incorreta");
                            return false; 
                        }
                    }
    
                    return false; 
                });
    
                if (!posicaoCliente) {
                    alert("CPF não encontrado ou senha incorreta");
                }
    
                console.log(posicaoCliente);
            })
        .catch(error => {
            console.error("Erro ao obter dados do cliente:", error);
            alert("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
        });
    } else {
        console.log("CPF inválido");
    }
    
    
    getLawyerByOAB(oab)
        .then(response => {
            // Armazena os dados do advogado obtidos da resposta
            const lawyerData = response.data;
            console.log("Dados do advogado:", lawyerData);

            // Verifica se não há dados do advogado
            if (!lawyerData) {
                alert("Você não está cadastrado ou sua OAB está incorreta");
                return;
            }

            // Converte os dados do advogado em um array de valores
            var lawyerArray = Object.values(lawyerData);
            // Procura no array um advogado cuja OAB corresponda ao valor fornecido
            var posicaoAdvogado = lawyerArray.find(advoGado => {
                var position = advoGado.OAB;
                if (oab === position) {
                    // Verifica se a senha fornecida corresponde à senha do advogado
                    if (advoGado.senha === senha) {
                        // Redireciona para a página do menu se a senha estiver correta
                        window.location.href = "../View/menu.html";
                    } else {
                        // Exibe um alerta se a senha estiver incorreta
                        alert("Senha está incorreta");
                        return;
                    }
                }
            });
            console.log(posicaoAdvogado);
        })
        .catch(error => {
            // Exibe um erro no console se a solicitação falhar
            console.error("Erro ao obter dados do advogado:", error);
        });

    // Impede o comportamento padrão do formulário de ser enviado
    event.preventDefault();
}