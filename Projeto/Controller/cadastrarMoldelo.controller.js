function fetchClientes() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(`${databaseURL}/${collectionPath}.json`)
        .then(response => {
            
            const clientes = response.data;
            console.log("Dados recebidos:", clientes);
            const clientesTable = document.getElementById("clientesBody");
            const select = document.getElementById('cadastradoPor');

            if (!clientesTable) {
                console.error("Tabela HTML com ID 'clientesBody' não encontrada.");
                return;
            }

            clientesTable.innerHTML = "";
            let tableContent = "";
            select.innerHTML = "";
            let dropdownContent = "";

            for (let clienteKey in clientes) {
                const cliente = clientes[clienteKey];
                console.log("Detalhes do cliente:", cliente);

                const newRow = `<tr>
                                    <td>${cliente.NomePeticionante}</td>
                                    <td>${cliente.CPFAtivo}</td>
                                    <td>${cliente.Descrição}</td>
                                    <td><a href="${cliente.ultimaAlteracao}">Ultima Alteração</a></td>
                                </tr>`;
                tableContent += newRow;

                const newOption = `<option value="${clienteKey}">${clienteKey}</option>`;
                dropdownContent += newOption;
                console.log(newOption);
            }

            clientesTable.innerHTML = tableContent;
            select.innerHTML = dropdownContent;
        })

        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

fetchClientes();
