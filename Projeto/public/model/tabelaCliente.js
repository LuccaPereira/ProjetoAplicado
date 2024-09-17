import axios from 'axios';

const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

export function oabAdvogadoLogado() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');

    if (loggedInLawyerString) {
        return JSON.parse(loggedInLawyerString);
    } else {
        console.log("Nenhum advogado está logado.");
        return null;
    }
}

export function fetchClientes(loggedInLawyer, callback) {
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(url)
        .then(response => {
            callback(response.data, loggedInLawyer);
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

export function archiveClient(clienteKey) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const collectionPath = `Advogado/${logAdv.OAB}/${clienteKey}.json`;
    const archivePath = `Arquivados/${clienteKey}.json`;

    axios.get(`${databaseURL}/${collectionPath}`)
        .then(response => {
            const clienteData = response.data;

            axios.put(`${databaseURL}/${archivePath}`, clienteData)
                .then(() => {
                    axios.delete(`${databaseURL}/${collectionPath}`)
                        .then(() => {
                            const row = document.querySelector(`tr[data-cliente-key="${clienteKey}"]`);
                            if (row) {
                                row.remove();
                            }
                            alert("Cliente arquivado com sucesso!");
                        })
                        .catch(error => {
                            console.error("Erro ao remover cliente original:", error);
                        });
                })
                .catch(error => {
                    console.error("Erro ao arquivar cliente:", error);
                });
        })
        .catch(error => {
            console.error("Erro ao buscar dados do cliente:", error);
        });
}

export function updateSituacaoInDatabase(clienteKey, selectedValue) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const collectionPath = `Advogado`;
    const urlAtt = `${databaseURL}/${collectionPath}/${logAdv.OAB}/${clienteKey}.json`;

    const updatedDetails = {
        situacao: selectedValue,
    };

    return axios.patch(urlAtt, updatedDetails)
        .then(response => {
            alert("Nosso banco de dados foi atualizado!");
            return response.data;
        })
        .catch(error => {
            console.error("Erro ao salvar detalhes do cliente:", error);
            alert('Erro ao salvar detalhes do cliente. Consulte o console para mais informações.');
        });
}

export function normalizeKey(key) {
    return key
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/[^\w-]/g, '');
}

export function getCurrentDateTime() {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
}

export function renderClientes(clientes, clientesTable) {
    if (!clientesTable) {
        console.error("Tabela não encontrada.");
        return;
    }

    if (clientes.length === 0) {
        console.log("Nenhum cliente encontrado para exibir.");
        return;
    }

    clientesTable.innerHTML = "";

    clientes.forEach(cliente => {
        const nomePeticionante = cliente.NomePeticionante || "Nome não disponível";
        const cpfAtivo = cliente.CPFAtivo || "CPF não disponível";
        const descricao = cliente.Descrição || "Descrição não disponível";
        const ultimaAlteracao = cliente.ultimaAlteracao || "#";
        const Keyfiltrada = normalizeKey(cliente.NomePeticionante);

        const newRow = document.createElement('tr');
        newRow.setAttribute('data-cliente-key', Keyfiltrada);
        newRow.innerHTML = `
            <td class="nome-peticionante">${nomePeticionante}</td>
            <td class="cpf-ativo">${cpfAtivo}</td>
            <td class="descricao">${descricao}</td>
            <td class="ultima-alteracao">${ultimaAlteracao}</td>
            <td>
                <select id="selectSituation-${Keyfiltrada}">
                    <option value="emcadastramento">Em cadastramento</option>
                    <option value="aguardandoenvio">Aguardando envio</option>
                    <option value="protocolada">Protocolada</option>
                </select>
            </td>
            <td><a href="#" class="baixar-peticao" data-cliente-key="${Keyfiltrada}">Visualizar</a></td>
            <td>
                <button class="arquivar-btn" data-cliente-key="${Keyfiltrada}">Arquivar</button>
            </td>`;

        clientesTable.appendChild(newRow);

        const select = newRow.querySelector(`#selectSituation-${Keyfiltrada}`);
        if (select) {
            select.value = cliente.situacao || 'emcadastramento';

            select.addEventListener('change', function() {
                const selectedValue = this.value;
                updateSituacaoInDatabase(Keyfiltrada, selectedValue);
            });
        } else {
            console.error(`Select com id 'selectSituation-${Keyfiltrada}' não encontrado.`);
        }
    });

    document.querySelectorAll('.arquivar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const clienteKey = this.getAttribute('data-cliente-key');
            archiveClient(clienteKey);
        });
    });

    document.querySelectorAll('.baixar-peticao').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const clienteKey = this.getAttribute('data-cliente-key');
            showClientDetails(clienteKey);
        });
    });
}

export function showClientDetails(clienteKey) {
    const urlAtt = `${databaseURL}/Advogado/${clienteKey}.json`;

    axios.get(urlAtt)
        .then(response => {
            const cliente = response.data;

            if (cliente) {
                document.getElementById('modalNome').textContent = cliente.NomePeticionante || "Nome não disponível";
                document.getElementById('modalCpf').textContent = cliente.CPFAtivo || "CPF não disponível";
                document.getElementById('modalDescricao').textContent = cliente.Descrição || "Descrição não disponível";
                document.getElementById('modalUltimaAlteracao').textContent = cliente.ultimaAlteracao || "Data não disponível";

                const editButton = document.getElementById('editButton');
                const saveButton = document.getElementById('saveButton');

                editButton.onclick = () => {
                    toggleEditMode(true);
                };

                saveButton.onclick = () => {
                    saveClientDetails(clienteKey, urlAtt);
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

export function toggleEditMode(editMode) {
    const viewElements = document.querySelectorAll('.form-control-plaintext');
    const editElements = document.querySelectorAll('.form-control');
    const pdfFileButton = document.getElementById('pdfFile');

    viewElements.forEach(el => {
        if (editMode) {
            el.classList.add('d-none');
            pdfFileButton.disabled = true;
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
}

export function saveClientDetails(clienteKey, urlAtt) {
    const nomePeticionante = document.getElementById('modalNome').textContent;
    const cpfAtivo = document.getElementById('modalCpf').textContent;
    const descricao = document.getElementById('modalDescricao').textContent;
    const ultimaAlteracao = getCurrentDateTime();
    
    const updatedDetails = {
        NomePeticionante: nomePeticionante,
        CPFAtivo: cpfAtivo,
        Descrição: descricao,
        ultimaAlteracao: ultimaAlteracao,
    };

    return axios.patch(urlAtt, updatedDetails)
        .then(response => {
            alert("Detalhes do cliente salvos com sucesso!");
            toggleEditMode(false);
        })
        .catch(error => {
            console.error("Erro ao salvar detalhes do cliente:", error);
            alert('Erro ao salvar detalhes do cliente. Consulte o console para mais informações.');
        });
}
