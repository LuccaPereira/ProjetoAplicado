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

function login() {
    // Obtém o valor do campo de entrada de OAB
    var oab = document.getElementById("OAB").value;
    // Obtém o valor do campo de entrada de senha
    var senha = document.getElementById("senha").value;

    // Chama a função para obter os dados do advogado pela OAB
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
