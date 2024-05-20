function fetchClientes() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(url)
        .then(response => {
            const clientes = response.data;
            alert("Dados recebidos:", clientes);
            const clientesTable = document.getElementById("clientesBody");

            if (!clientesTable) {
                console.error("Tabela não encontrada.");
                return;
            }

            clientesTable.innerHTML = "";

            for (let clienteKey in clientes) {
                if (clientes.hasOwnProperty(clienteKey)) {
                    const cliente = clientes[clienteKey];
                    console.log("Detalhes do cliente:", cliente);

                    const adv = cliente.NomeAdvogado.toString();
                    const nomePeticionante = cliente[adv].NomePeticionante || "Nome não disponível";
                    const cpfAtivo = cliente[adv].CPFAtivo || "CPF não disponível";
                    const descricao = cliente[adv].Descrição || "Descrição não disponível";
                    const ultimaAlteracao = cliente[adv].ultimaAlteracao || "#";
    
                    const selectSituation = document.createElement('select');
                    selectSituation.id = `selectSituation-${clienteKey}`;

                    const options = ['Em cadastramento', 'Aguardando envio', 'Protocolada']; 
                    options.forEach(optionText => {
                        const option = document.createElement('option');
                        option.value = optionText.toLowerCase().replace(/\s/g, ''); 
                        option.textContent = optionText;
                        selectSituation.appendChild(option);
                    });

                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${nomePeticionante}</td>
                        <td>${cpfAtivo}</td>
                        <td>${descricao}</td>
                        <td>${ultimaAlteracao}</td>
                        <td></td>`;

                    const tdSituation = newRow.querySelector('td:last-of-type');
                    tdSituation.appendChild(selectSituation);

                    clientesTable.appendChild(newRow);
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
                        option.textContent = cliente.NomeAdvogado || "Nome não disponível";
                        select.appendChild(option);
                    }
                }
            } else {
                console.error("Elemento select com ID 'cadastradoPor' não encontrado.");
            }

            const selectEmNome = document.getElementById('emNomeDe');
            if (selectEmNome) {
                selectEmNome.innerHTML = "";
                for (let clienteKey in clientes) {
                    if (clientes.hasOwnProperty(clienteKey)) {
                        const cliente = clientes[clienteKey];
                        const adv = cliente.NomeAdvogado.toString();
                        const option = document.createElement('option');
                        option.value = clienteKey;
                        option.textContent = cliente[adv].NomePeticionante || "Nome não disponível";
                        selectEmNome.appendChild(option);
                    }
                }
            } else {
                console.error("DropDown não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

fetchClientes();
