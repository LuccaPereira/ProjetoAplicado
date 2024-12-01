import { fetchClientes, archiveClient, updateSituacaoInDatabase, saveClientDetails} from '../model/tabelaCliente.js';

let protocolNumber = "";

export function clienteLogado() {
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    console.log("Advogado logado (localStorage):", loggedInClienteString);
    return loggedInClienteString ? JSON.parse(loggedInClienteString) : null;
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
})

function renderClientes(clientesFiltrados = null) {
    const loggedInCliente = clienteLogado();
    if (!loggedInCliente) {
        console.log("Nenhum advogado está logado.");
        return;
    }

    if (!clientesFiltrados) {
        fetchClientes()
            .then(response => {
                console.log("Resposta da busca de clientes:", response);
                const clientes = response.data;
                const filtro = clientes["PerfilAdvogado"];
                const filtroUi = filtro[loggedInCliente.uidAdv];
                processarClientes(filtroUi, loggedInCliente);
            })
            .catch(error => console.error("Erro ao buscar clientes:", error));
    } else {
        processarClientes(clientesFiltrados, loggedInCliente);
    }
}

function processarClientes(clienteData, loggedInCliente) {
    const clientesTable = document.getElementById("clientesBody");

    if (!clientesTable) {
        console.error("Tabela não encontrada.");
        return;
    }

    clientesTable.innerHTML = "";

    Object.keys(clienteData).forEach(clienteKey => {
        const cliente = clienteData[clienteKey];
        const nomePeticionante = cliente.NomePeticionante;

        if (nomePeticionante === loggedInCliente.nome) {
            console.log(`Exibindo todas as ocorrências para: ${nomePeticionante}`);

            const Keyfiltrada = clienteKey.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            const cpfAtivo = cliente.CPFAtivo || "CPF não disponível";
            const descricao = cliente.Descricao || "Descrição não disponível";
            const ultimaAlteracao = cliente.UltimaAlt || "#";
            const situacao = cliente.situacao || "Ainda sem Status";
            const pdfURL = cliente.pdfURL || "";

            const newRow = document.createElement('tr');
            newRow.setAttribute('data-cliente-key', clienteKey);
            newRow.innerHTML = `
                <td class="nome-peticionante">${nomePeticionante}</td>
                <td class="cpf-ativo">${cpfAtivo}</td>
                <td class="descricao">${descricao}</td>
                 <td class="ultima-alteracao" style="cursor: pointer;" title="Ver histórico de alterações">${ultimaAlteracao}</td>
                <td>
                    <input type="text" value="${situacao}" class="form-control" readonly />
                </td>
                <td>
                    <button class="baixar-peticao" data-cliente-key="${Keyfiltrada}">Visualizar</button>
                </td>
                <td>
                    <button class="visualizar-pdf" data-pdf-url="${pdfURL}" data-cliente-key="${Keyfiltrada}">Visualizar PDF</button>
                </td>`;
            clientesTable.appendChild(newRow);
            const ultimaAlteracaoCell = newRow.querySelector('.ultima-alteracao');
                    ultimaAlteracaoCell.addEventListener('click', () => {
                        showHistorico(clienteKey);
                    });

        }
    });

    clientesTable.querySelectorAll('.visualizar-pdf').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const pdfURL = this.getAttribute('data-pdf-url');
            if (pdfURL) {
                window.open(pdfURL, '_blank');
            } else {
                alert('PDF não disponível.');
            }
        });
    });

    clientesTable.querySelectorAll('.baixar-peticao').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const currentClientKey = decodeURIComponent(this.getAttribute('data-cliente-key')).replace(/-/g, ' ');
            console.log(`Visualizando detalhes do cliente ${currentClientKey}`);
            showClientDetails(clienteKey, currentClientKey, clienteData);
        });
    });

    populateSelectOptions(clienteData, 'emSituacao', 'situacao');

    document.getElementById('emSituacao').addEventListener('change', function() {
        const selectedOptionText = this.options[this.selectedIndex].textContent.trim();
        console.log(`Filtrando clientes por nome: ${selectedOptionText}`);
        const clientesFiltrados = filtrarClientesPorNomePeticionante(clienteData, selectedOptionText);
        renderClientes(clientesFiltrados);
    });
}
            
function populateModalFields(cliente) {
    if (!cliente) return;
    
    document.getElementById('modalnomePeticionante').value = cliente.NomePeticionante || "Nome não disponível";
    document.getElementById('modalnomeAdvogado').value = cliente.NomeAdvogado || "Nome não disponível";
    document.getElementById('Modalforo').value = cliente.Foro || "Não disponível";
    document.getElementById('Modalacidente').value = cliente.Acidente || "Não disponível";
    document.getElementById('Modalvalor').value = cliente.Valor || "Não disponível";
    document.getElementById('Modaltelefone').value = cliente.Telefone || "Não disponível";
    document.getElementById('Modalprocedimento').value = cliente.Procedimento || "Não disponível";
    document.getElementById('Modalauxilio').value = cliente.Auxilio || "Não disponível";
    document.getElementById('Modalemail').value = cliente.Email || "Não disponível";
    document.getElementById('Modaldescricao').value = cliente.Descrição || "Não disponível";
    document.getElementById('ModalcpfAtivo').value = cliente.CPFAtivo || "Não disponível";
    document.getElementById('ModalcnpjPassivo').value = cliente.CNPJ || "Não disponível";
    document.getElementById('editUltimaAlteracao').value = cliente.ultimaAlteracao || "";
    document.getElementById('situação').value = cliente.situacao || "";
    
}

export function showClientDetails(clienteKey, formattedClientKey, clienteData) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    const logCliente = JSON.parse(loggedInClienteString);
    const urlAtt = `${databaseURL}/Cliente/PerfilDoCliente/${logCliente.uid}/${clienteKey}.json`;

    console.log(`Buscando detalhes do cliente: ${urlAtt}`);
    axios.get(urlAtt)
        .then(response => {
            const cliente = response.data;

            // Verifique se o cliente existe e tem a propriedade esperada
            if (cliente && cliente.NomePeticionante === formattedClientKey) {
                const modalElement = document.getElementById('clienteModal');
                const modal = new bootstrap.Modal(modalElement);

                modal.show();
                populateModalFields(cliente);
                
                const fieldsToMakeReadonly = [
                    'modalnomePeticionante',
                    'modalnomeAdvogado',
                    'Modalforo',
                    'Modalacidente',
                    'Modalvalor',
                    'Modaltelefone',
                    'Modalprocedimento',
                    'Modalauxilio',
                    'Modalemail',
                    'Modaldescricao',
                    'ModalcpfAtivo',
                    'ModalcnpjPassivo',
                    'editUltimaAlteracao'
                ];

                fieldsToMakeReadonly.forEach(field => {
                    document.getElementById(field).readOnly = true;
                });
            } else {
                console.error("Detalhes do cliente não encontrados.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar detalhes do cliente:", error);
        });
}

function showHistorico(clienteKey) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

    // Recupera o advogado logado ou cliente logado
    const loggedInLawyerString = localStorage.getItem('loggedInUser');
    const loggedInClienteString = localStorage.getItem('loggedInCliente');

    let uidAdvogado = null;
    if (loggedInLawyerString) {
        const loggedInLawyer = JSON.parse(loggedInLawyerString);
        uidAdvogado = loggedInLawyer.uidAdv; // UID do advogado logado
    } else if (loggedInClienteString) {
        const loggedInCliente = JSON.parse(loggedInClienteString);
        uidAdvogado = loggedInCliente.uidAdv; // UID do advogado vinculado ao cliente
    }

    // Se não houver advogado vinculado, exibe uma mensagem de erro
    if (!uidAdvogado) {
        console.error("UID do advogado não encontrado.");
        alert("Não foi possível encontrar o histórico. Tente novamente mais tarde.");
        return;
    }

    // URL para buscar o histórico de situações do cliente na tabela de advogado
    const urlHistorico = `${databaseURL}/Advogado/PerfilAdvogado/${uidAdvogado}/${clienteKey}/HistoricoSituacao.json`;

    // Faz a requisição ao Firebase
    axios.get(urlHistorico)
        .then(response => {
            const historico = response.data;

            // Configura o modal de histórico
            const modalElement = document.getElementById('historicoModal');
            const modalBody = modalElement.querySelector('.modal-body');

            // Limpa o conteúdo anterior
            modalBody.innerHTML = '';

            // Verifica se há dados no histórico
            if (historico && typeof historico === 'object' && Object.keys(historico).length > 0) {
                Object.keys(historico).forEach(chaveAleatoria => {
                    const entry = historico[chaveAleatoria];

                    // Verifica se existe uma data no registro
                    const data = entry.data || "Data não informada"; // Altere "data" para o nome correto no Firebase
                    const situacao = entry.situacao || "Situação não informada";

                    // Formata o conteúdo para exibir
                    const entryDiv = document.createElement('div');
                    entryDiv.innerHTML = `<strong>${data}:</strong> ${situacao}`;
                    modalBody.appendChild(entryDiv);
                });
            } else {
                modalBody.innerHTML = '<p>Nenhum histórico encontrado.</p>';
            }

            // Exibe o modal
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        })
        .catch(error => {
            console.error("Erro ao buscar histórico:", error);
            const modalElement = document.getElementById('historicoModal');
            const modalBody = modalElement.querySelector('.modal-body');
            modalBody.innerHTML = '<p>Erro ao carregar o histórico.</p>';
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        });
}

export function populateSelectOptions(clienteData, selectId, optionKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error("Select não encontrado.");
        return;
    }

    console.log("Populando opções para o select:", selectId);
    select.innerHTML = ""; 
    const emptyOption = document.createElement('option');
    emptyOption.value = "";
    emptyOption.textContent = "Selecione uma opção";
    select.appendChild(emptyOption);

    let hasOptions = false;

    Object.keys(clienteData).forEach(clienteKey => {
        const cliente = clienteData[clienteKey];
        if (cliente[optionKey]) {
            const option = document.createElement('option');
            option.textContent = cliente[optionKey];
            option.value = cliente[optionKey]; 
            select.appendChild(option);
            hasOptions = true;
        }
    });

    if (!hasOptions) {
        select.appendChild(emptyOption);
    } else {
        select.selectedIndex = 0; 
    }
}

export function filtrarClientesPorNomePeticionante(clienteData, situacao) {
    const clientesFiltrados = {};
    console.log(`Filtrando clientes por situação: ${situacao}`);

    Object.keys(clienteData).forEach(clienteKey => {
        const cliente = clienteData[clienteKey];
        if (cliente.situacao === situacao) {
            clientesFiltrados[clienteKey] = cliente;
        }
    });

    console.log("Clientes filtrados:", clientesFiltrados);
    return clientesFiltrados;
}

renderClientes()