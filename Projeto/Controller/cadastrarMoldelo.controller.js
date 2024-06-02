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

                            if (nomePeticionante !== "Nome não disponível" || cpfAtivo !== "CPF não disponível" || descricao !== "Descrição não disponível" || ultimaAlteracao !== "#") {
                                const newRow = document.createElement('tr');
                                newRow.setAttribute('data-cliente-key', clienteKey);
                                newRow.innerHTML = `
                                    <td class="nome-peticionante">${nomePeticionante}</td>
                                    <td class="cpf-ativo">${cpfAtivo}</td>
                                    <td class="descricao">${descricao}</td>
                                    <td class="ultima-alteracao">${ultimaAlteracao}</td>
                                    <td>
                                        <select id="selectSituation-${clienteKey}">
                                            <option value="emcadastramento">Em cadastramento</option>
                                            <option value="aguardandoenvio">Aguardando envio</option>
                                            <option value="protocolada">Protocolada</option>
                                        </select>
                                    </td>
                                    <td><a href="#" class="baixar-peticao" data-cliente-key="${clienteKey}">Baixar</a></td>`;

                                // Defina o valor selecionado no select de acordo com a situação
                                const select = newRow.querySelector(`#selectSituation-${clienteKey}`);
                                select.value = cliente[adv].situacao || 'emcadastramento';

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

            populateSelectOptions(clientes, 'cadastradoPor', 'NomeAdvogado');
            populateSelectOptions(clientes, 'emNomeDe', 'NomePeticionante');

            document.querySelectorAll('.baixar-peticao').forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const clienteKey = this.getAttribute('data-cliente-key');
                    showClientDetails(clienteKey);
                });
            });

        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

function populateSelectOptions(clientes, selectId, property) {
    const select = document.getElementById(selectId);
    if (select) {
        select.innerHTML = "";
        for (let clienteKey in clientes) {
            if (clientes.hasOwnProperty(clienteKey)) {
                const cliente = clientes[clienteKey];
                const option = document.createElement('option');
                option.value = clienteKey;
                option.textContent = cliente[property] || "Nome não disponível";
                select.appendChild(option);
            }
        }
    } else {
        console.error(`Elemento select com ID '${selectId}' não encontrado.`);
    }
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

                document.getElementById('modalNome').textContent = clientDetails.NomePeticionante || "Nome não disponível";
                document.getElementById('modalCpf').textContent = clientDetails.CPFAtivo || "CPF não disponível";
                document.getElementById('modalDescricao').textContent = clientDetails.Descrição || "Descrição não disponível";
                document.getElementById('modalUltimaAlteracao').textContent = clientDetails.ultimaAlteracao || "Data não disponível";
                document.getElementById('modalSituacao').textContent = clientDetails.situacao || "Situação não disponível";
                document.getElementById('modalPeticao').innerHTML = `<a href="#">Baixar</a>`;

                document.getElementById('editNome').value = clientDetails.NomePeticionante || "";
                document.getElementById('editCpf').value = clientDetails.CPFAtivo || "";
                document.getElementById('editDescricao').value = clientDetails.Descrição || "";
                document.getElementById('editUltimaAlteracao').value = clientDetails.ultimaAlteracao || "";
                document.getElementById('editSituacao').value = clientDetails.situacao || "";
                document.getElementById('editPeticao').value = "Baixar";

                const editButton = document.getElementById('editButton');
                const saveButton = document.getElementById('saveButton');

                editButton.onclick = () => {
                    toggleEditMode(true);
                };

                saveButton.onclick = () => {
                    saveClientDetails(clienteKey);
                };

                toggleEditMode(false);

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

function toggleEditMode(editMode) {
    const viewElements = document.querySelectorAll('.form-control-plaintext');
    const editElements = document.querySelectorAll('.form-control');

    viewElements.forEach(el => {
        if (editMode) {
            el.classList.add('d-none');
        } else {
            el.classList.remove('d-none');
        }
    });

    editElements.forEach(el => {
        if (editMode) {
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    });

    document.getElementById('editButton').classList.toggle('d-none', editMode);
    document.getElementById('saveButton').classList.toggle('d-none', !editMode);
}

function saveClientDetails(clienteKey) {
    const updatedDetails = {
        NomePeticionante: document.getElementById('editNome').value,
        CPFAtivo: document.getElementById('editCpf').value,
        Descrição: document.getElementById('editDescricao').value,
        ultimaAlteracao: document.getElementById('editUltimaAlteracao').value,
        situacao: document.getElementById('editSituacao').value,
    };

    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Cliente/${clienteKey}.json`;
    const url = `${databaseURL}/${collectionPath}`;

    axios.patch(url, updatedDetails)
        .then(response => {
            toggleEditMode(false);

            // Atualiza a tabela diretamente após salvar os detalhes
            const clienteRow = document.querySelector(`tr[data-cliente-key="${clienteKey}"]`);
            if (clienteRow) {
                clienteRow.querySelector('.nome-peticionante').textContent = updatedDetails.NomePeticionante;
                clienteRow.querySelector('.cpf-ativo').textContent = updatedDetails.CPFAtivo;
                clienteRow.querySelector('.descricao').textContent = updatedDetails.Descrição;
                clienteRow.querySelector('.ultima-alteracao').textContent = updatedDetails.ultimaAlteracao;
            }

            // Atualiza o modal com os novos detalhes
            document.getElementById('modalNome').textContent = updatedDetails.NomePeticionante || "Nome não disponível";
            document.getElementById('modalCpf').textContent = updatedDetails.CPFAtivo || "CPF não disponível";
            document.getElementById('modalDescricao').textContent = updatedDetails.Descrição || "Descrição não disponível";
            document.getElementById('modalUltimaAlteracao').textContent = updatedDetails.ultimaAlteracao || "Data não disponível";
            document.getElementById('modalSituacao').textContent = updatedDetails.situacao || "Situação não disponível";
            
            alert('Detalhes do cliente atualizados com sucesso!');
        })
        .catch(error => {
            console.error("Erro ao salvar detalhes do cliente:", error);
        });
}

// Chama a função para buscar e exibir os clientes ao carregar a página
fetchClientes();

