import {
    getClientData,
    archiveClientData,
    updateClientDetails,
    getAllClients,
    uploadPDF
} from '../model/consultar-modelo';
import "../View/consultar-modelo.css";

function clickMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });
}

function setupLogoutButton() {
    document.getElementById('logoutButton').addEventListener('click', () => {
        logout();
    });
}

function renderClientes(clientesFiltrados) {
    const clientesTable = document.getElementById("clientesBody");

    if (!clientesTable || clientesFiltrados.length === 0) {
        console.log("Nenhum cliente encontrado ou tabela não encontrada.");
        return;
    }

    clientesTable.innerHTML = "";

    clientesFiltrados.forEach(cliente => {
        const newRow = document.createElement('tr');
        const Keyfiltrada = normalizeKey(cliente.NomePeticionante);

        newRow.innerHTML = `
            <td class="nome-peticionante">${cliente.NomePeticionante || "Nome não disponível"}</td>
            <td class="cpf-ativo">${cliente.CPFAtivo || "CPF não disponível"}</td>
            <td class="descricao">${cliente.Descrição || "Descrição não disponível"}</td>
            <td class="ultima-alteracao">${cliente.ultimaAlteracao || "#"}</td>
            <td>
                <select id="selectSituation-${Keyfiltrada}">
                    <option value="emcadastramento">Em cadastramento</option>
                    <option value="aguardandoenvio">Aguardando envio</option>
                    <option value="protocolada">Protocolada</option>
                </select>
            </td>
            <td><button class="baixar-peticao" data-cliente-key="${Keyfiltrada}">Visualizar</button></td>
            <td><button class="arquivar-btn" data-cliente-key="${Keyfiltrada}">Arquivar</button></td>
        `;

        clientesTable.appendChild(newRow);

        const select = newRow.querySelector(`#selectSituation-${Keyfiltrada}`);
        if (select) {
            select.value = cliente.situacao || 'emcadastramento';
            select.addEventListener('change', () => {
                const selectedValue = select.value;
                updateSituacaoInDatabase(Keyfiltrada, selectedValue, cliente);
            });
        }

        newRow.querySelector('.baixar-peticao').addEventListener('click', () => {
            showClientDetails(cliente);
        });

        newRow.querySelector('.arquivar-btn').addEventListener('click', () => {
            archiveClient(Keyfiltrada);
        });
    });
}

function archiveClient(clienteKey, clientes) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);

    if (!clienteKey) {
        clienteKey = clientes.NomePeticionante;
    }

    getClientData(logAdv, clienteKey)
        .then(response => {
            const clienteData = response.data;
            return archiveClientData(logAdv, clienteKey, clienteData);
        })
        .then(() => {
            const row = document.querySelector(`tr[data-cliente-key="${clienteKey}"]`);
            if (row) {
                row.remove();
            }
            alert("Cliente arquivado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao arquivar cliente:", error);
        });
}

function updateSituacaoInDatabase(clienteKey, selectedValue, cliente) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const clienteKeyAtt = cliente.NomePeticionante;

    const updatedDetails = {
        situacao: selectedValue,
    };

    updateClientDetails(logAdv, clienteKeyAtt, updatedDetails)
        .then(() => {
            alert("Nosso banco de dados foi atualizado!");
            document.querySelector(`tr[data-cliente-key="${clienteKey}"] .situation`).textContent = selectedValue;
        })
        .catch(error => {
            console.error("Erro ao salvar detalhes do cliente:", error);
            alert('Erro ao salvar detalhes do cliente. Consulte o console para mais informações.');
        });
}

function populateSelectOptions(advogadoData, selectId, property) {
    const select = document.getElementById(selectId);
    
    if (select) {
        select.innerHTML = "";
        const clientesArray = Object.values(advogadoData);

        clientesArray.forEach(cliente => {
            if (cliente[property]) {
                const option = document.createElement('option');
                option.value = cliente[property];
                option.textContent = cliente[property];
                if (!Array.from(select.options).some(option => option.value === cliente[property])) {
                    select.appendChild(option);
                }
            }
        });
    } else {
        console.error(`Elemento select com ID '${selectId}' não encontrado.`);
    }
}

function showClientDetails(clienteFiltrado) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const clienteKeyAtt = clienteFiltrado.NomePeticionante;

    getClientData(logAdv, clienteKeyAtt)
        .then(response => {
            const cliente = response.data;
            if (cliente) {
                document.getElementById('modalNome').textContent = cliente.NomePeticionante || "Nome não disponível";
                document.getElementById('modalCpf').textContent = cliente.CPFAtivo || "CPF não disponível";
                document.getElementById('modalDescricao').textContent = cliente.Descrição || "Descrição não disponível";
                document.getElementById('modalUltimaAlteracao').textContent = cliente.ultimaAlteracao || "Data não disponível";
                document.getElementById('modalPeticao').innerHTML = `<a href="#">Visualizar</a>`;
                
                document.getElementById('editNome').value = cliente.NomePeticionante || "";
                document.getElementById('editCpf').value = cliente.CPFAtivo || "";
                document.getElementById('editDescricao').value = cliente.Descrição || "";
                document.getElementById('editUltimaAlteracao').value = cliente.ultimaAlteracao || "";

                const editButton = document.getElementById('editButton');
                const saveButton = document.getElementById('saveButton');

                editButton.onclick = () => {
                    toggleEditMode(true);
                };

                saveButton.onclick = () => {
                    saveClientDetails(response, clienteKeyAtt);
                };

                toggleEditMode(false);
                const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
                modal.show();
            }
        })
        .catch(error => {
            console.error("Erro ao buscar detalhes do cliente:", error);
        });
}

function saveClientDetails(response, clienteKey) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);

    const updatedDetails = {
        NomePeticionante: document.getElementById('editNome').value,
        CPFAtivo: document.getElementById('editCpf').value,
        Descrição: document.getElementById('editDescricao').value,
        ultimaAlteracao: getCurrentDateTime()
    };

    const pdfFileInput = document.getElementById("pdfFile");

    if (pdfFileInput.files.length > 0) {
        const pdfFile = pdfFileInput.files[0];
        uploadPDF(pdfFile)
            .then(downloadURL => {
                updatedDetails.pdfURL = downloadURL;
                return updateClientDetails(logAdv, clienteKey, updatedDetails);
            })
            .then(() => {
                alert("Nosso banco de dados foi atualizado!");
                const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
                modal.hide();
                window.location.reload();
            })
            .catch(error => {
                console.error("Erro ao salvar detalhes do cliente:", error);
            });
    } else {
        updateClientDetails(logAdv, clienteKey, updatedDetails)
            .then(() => {
                alert("Nosso banco de dados foi atualizado!");
                const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
                modal.hide();
                window.location.reload();
            })
            .catch(error => {
                console.error("Erro ao salvar detalhes do cliente:", error);
            });
    }
}

export { clickMenu, setupLogoutButton };
