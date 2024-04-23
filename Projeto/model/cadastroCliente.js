function submitClientes (){
    var form = document.getElementById("clienteForm");

    if (form.checkValidity()) {
        const cliente = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value
        };
    

    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const clientes = document.getElementById("cliente");
    const url = `${databaseURL}/${collectionPath}/${clientes}.json`;

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
    };
}
