function submitForm() {
    var form = document.getElementById('cadAdv');
    
    if (form.checkValidity()) {
        const newLawyerData = {
            nome: document.getElementById('nome').value,
            OAB: document.getElementById('OAB').value,
            cpf: document.getElementById('inputCpf').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        };

        const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
        const collectionPath = "Advogado";
        const OAB = document.getElementById('OAB').value;
        const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

        axios.post(url, newLawyerData)
            .then(response => {
                console.log("Novo advogado adicionado com ID:", response.data.name);
                window.location.href = "../View/login.html";
            })
            .catch(error => {
                console.error("Erro ao adicionar novo advogado:", error);
            });
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}
