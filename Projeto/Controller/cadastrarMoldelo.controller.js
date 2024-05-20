function fetchClientes() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(url)
        .then(response => {
            const clientes = response.data;
            console.log("Dados recebidos:", clientes);
            const clientesTable = document.getElementById("clientesBody");

            if (!clientesTable) {
                console.error("Tabela HTML com ID 'clientesBody' não encontrada.");
                return;
            }

            clientesTable.innerHTML = "";

            for (let clienteKey in clientes) {
                if (clientes.hasOwnProperty(clienteKey)) {
                    const cliente = clientes[clienteKey];
                    console.log("Detalhes do cliente:", cliente);

                    const nomePeticionante = cliente[nomePeticionante] || "Nome não disponível";
                    const cpfAtivo = cliente[cpfAtivo] || "CPF não disponível";
                    const descricao = cliente[Descrição] || "Descrição não disponível";
                    const ultimaAlteracao = cliente[ultimaAlteracao] || "#";

                    const newRow = `<tr>
                                        <td>${nomePeticionante}</td>
                                        <td>${cpfAtivo}</td>
                                        <td>${descricao}</td>
                                        <td><a href="${ultimaAlteracao}">Ultima Alteração</a></td>
                                    </tr>`;
                    clientesTable.innerHTML += newRow;
                }
            }

            const select = document.getElementById('cadastradoPor');
            if (select) {
                select.innerHTML = "";
                for (let clienteKey in clientes) {
                    if (clientes.hasOwnProperty(clienteKey)) {
                        const cliente = clientes[clienteKey];
                        const option = document.createElement('option');
                        option.value = clienteKey;
                        option.textContent = cliente.NomePeticionante || "Nome não disponível";
                        select.appendChild(option);
                    }
                }
            } else {
                console.error("Elemento select com ID 'cadastradoPor' não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

// Chamando a função para preencher a tabela e o dropdown
fetchClientes();
