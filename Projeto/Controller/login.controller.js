function getLawyerByOAB(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    return axios.get(url);
}

function getCpfByCliente(cpfAtivo) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}/${cpfAtivo}.json`;

    return axios.get(url);
}

function login() {
    var oab = document.getElementById("OAB").value;
    var senha = document.getElementById("senha").value;

    getLawyerByOAB(oab)
        .then(response => {
            const lawyerData = response.data;
            console.log("Dados do advogado:", lawyerData);

            if (!lawyerData) {
                alert("Você não está cadastrado ou sua OAB está incorreta");
                return;
            }

            var lawyerArray = Object.values(lawyerData);
            var posicaoAdvogado = lawyerArray.find(advoGado => {
                var position = advoGado.OAB;
                if (oab === position){
                    if(advoGado.senha === senha) {
                        window.location.href = "../View/menu.html";
                    } else {
                        alert("Senha está incorreta");
                        return;
                    }
                } 
            });
            console.log(posicaoAdvogado);
        })
        .catch(error => {
            console.error("Erro ao obter dados do advogado:", error);
        });

    event.preventDefault();
}
