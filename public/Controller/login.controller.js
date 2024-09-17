const { getLawyerByOAB, validarCPF, getCpfByCliente } = require('../model/login');

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
                            window.location.href = "../View/menu.html";
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

login()