function getLawyerByOAB(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    return axios.get(url);
}

function login() {
    var oab = document.getElementById("OAB").value;
    var senha = document.getElementById("senha").value;

    getLawyerByOAB(oab)
        .then(response => {
            const lawyerData = response.data;
            console.log("Dados do advogado:", lawyerData);

            var lawyerArray = Object.values(lawyerData);
            var posicaoAdvogado = lawyerArray.find(advoGado => {
                var position = advoGado.OAB;
                if (oab === position) {
                    for (var key in advoGado) {
                        if (advoGado.senha === senha) {
                            window.location.href = "../View/menu.html";
                        } else {
                            alert("Senha digitada esta errada")
                            return;
                        }
                    } 
                } else{
                    alert("OAB está incorreta ou você não esta cadastrado!");
                    return;  
                } 
            });
            console.log(posicaoAdvogado);
        })
        .catch(error => {
            console.error("Erro ao obter dados do advogado:", error);
        });

    event.preventDefault();
}