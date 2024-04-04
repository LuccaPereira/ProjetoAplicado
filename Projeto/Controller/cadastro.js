function submitForm() {
    var form = document.getElementById('cadAdv');
    
    if (form.checkValidity()) {
        const newLawyerData = {
            nome: document.getElementById('nome').value,
            OAB: document.getElementById('OAB').value,
            cpf: document.getElementById('inputCpf').value,
            email: document.getElementById('email').value
        };

        const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
        const collectionPath = "Advogado";
        const url = `${databaseURL}/${collectionPath}.json`;

        axios.post(url, newLawyerData)
            .then(response => {
                console.log("Novo advogado adicionado com ID:", response.data.name);
            })
            .catch(error => {
                console.error("Erro ao adicionar novo advogado:", error);
                // Exibe uma mensagem de erro para o usuário, etc.
            });
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}