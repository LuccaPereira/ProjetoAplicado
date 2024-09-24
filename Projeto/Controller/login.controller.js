function getLawyerByOAB(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = '${databaseURL}/${collectionPath}/${OAB}.json';

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
    const url = '${databaseURL}/${collectionPath}.json';

    return axios.get(url);
}

function login() {
    var oab = document.getElementById("OAB").value;
    var senha = document.getElementById("senha").value;

    if (validarCPF(oab)) {
        getCpfByCliente(oab)
            .then(response => {
                const cliente = response.data;
                console.log("Dados do cliente:", cliente);

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
                            localStorage.setItem('loggedInCliente', JSON.stringify(clienteGado));
                            window.location.href = "../View/consultar.html";
                            return true;
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
            const lawyerData = response.data;

            const profilesArray = Object.values(lawyerData);
            
            const PerfilAdvogado = profilesArray.find(profile => profile.OAB);

            if (!PerfilAdvogado) {
                alert("Perfil de advogado não encontrado.");
                return;
            }
    
            if (PerfilAdvogado.OAB == oab) {
                if (PerfilAdvogado.senha == senha) {
                    localStorage.setItem('loggedInLawyer', JSON.stringify(PerfilAdvogado));
                    window.location.href = "../View/menu.html";
                    return true;
                } else {
                    alert("Senha está incorreta");
                    return false;
                }
            } else {
                alert("OAB não encontrada");
            }
        })
        .catch(error => {
            console.error("Erro ao obter dados:", error);
        });

event.preventDefault();
}