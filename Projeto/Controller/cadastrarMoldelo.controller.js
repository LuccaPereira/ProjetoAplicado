function fetchClientes() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(url)
        .then(response => {
            const clientes = response.data;
            const clientesTable = document.getElementById("clientesBody");

            if (!clientesTable) {
                console.error("Tabela não encontrada.");
                return;
            }

            clientesTable.innerHTML = "";

            for (let clienteKey in clientes) {
                if (clientes.hasOwnProperty(clienteKey)) {
                    const cliente = clientes[clienteKey];
                    
                    if (cliente.NomeAdvogado) {
                        const adv = cliente.NomeAdvogado.toString();
                        
                        if (cliente[adv]) {
                            const nomePeticionante = cliente[adv].NomePeticionante || "Nome não disponível";
                            const cpfAtivo = cliente[adv].CPFAtivo || "CPF não disponível";
                            const descricao = cliente[adv].Descrição || "Descrição não disponível";
                            const ultimaAlteracao = cliente[adv].ultimaAlteracao || "#";
                            //const pdf = firebase.storage || "#";

                            if (nomePeticionante !== "Nome não disponível" || cpfAtivo !== "CPF não disponível" || descricao !== "Descrição não disponível" || ultimaAlteracao !== "#") {
                                const newRow = document.createElement('tr');
                                newRow.innerHTML = `
                                    <td>${nomePeticionante}</td>
                                    <td>${cpfAtivo}</td>
                                    <td>${descricao}</td>
                                    <td>${ultimaAlteracao}</td>
                                    <td>
                                        <select id="selectSituation-${clienteKey}">
                                            <option value="emcadastramento">Em cadastramento</option>
                                            <option value="aguardandoenvio">Aguardando envio</option>
                                            <option value="protocolada">Protocolada</option>
                                        </select>
                                    </td>
                                    <td><a href="#">Baixar</a></td>`;

                                newRow.addEventListener('click', function() {
                                    showClientDetails(clienteKey);
                                });

                                clientesTable.appendChild(newRow);
                            }
                        } else {
                            console.log("Advogado não encontrado nos detalhes do cliente");
                        }
                    } else {
                        console.log("Cliente sem dados de advogado");
                    }
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
                        if (cliente.NomeAdvogado) {
                            const adv = cliente.NomeAdvogado.toString();
                            const nomePeticionante = cliente[adv]?.NomePeticionante || "Nome não disponível";
                            const option = document.createElement('option');
                            option.value = clienteKey;
                            option.textContent = nomePeticionante;
                            selectEmNome.appendChild(option);
                        } else {
                            console.log("Cliente sem dados de advogado");
                        }
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

function showClientDetails(clienteKey) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Cliente/${clienteKey}.json`;
    const url = `${databaseURL}/${collectionPath}`;

    axios.get(url)
        .then(response => {
            const cliente = response.data;

            if (cliente) {
                const adv = cliente.NomeAdvogado.toString();
                const clientDetails = cliente[adv];

                document.getElementById('modalNome').textContent = `Nome: ${clientDetails.NomePeticionante || "Nome não disponível"}`;
                document.getElementById('modalCpf').textContent = `CPF: ${clientDetails.CPFAtivo || "CPF não disponível"}`;
                document.getElementById('modalDescricao').textContent = `Descrição: ${clientDetails.Descrição || "Descrição não disponível"}`;
                document.getElementById('modalUltimaAlteracao').textContent = `Última alteração: ${clientDetails.ultimaAlteracao || "Data não disponível"}`;
                document.getElementById('modalSituacao').textContent = `Situação: ${clientDetails.situacao || "Situação não disponível"}`;
                document.getElementById('modalPeticao').innerHTML = `<a href="#">Baixar</a>`;

                const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
                modal.show();
            } else {
                console.error("Detalhes do cliente não encontrados.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar detalhes do cliente:", error);
        });
}

fetchClientes();