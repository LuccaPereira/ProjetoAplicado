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

export function renderClientes() {
    const loggedInCliente = clienteLogado();
    if (!loggedInCliente) {
        console.log("Nenhum advogado está logado.");
        return;
    }

    fetchClientes()
        .then(response => {
            console.log("Resposta da busca de clientes:", response);
            const clientes = response.data;
            const clientesTable = document.getElementById("clientesBody");

            if (!clientesTable) {
                console.error("Tabela não encontrada.");
                return;
            }

            clientesTable.innerHTML = "";
            const clienteLogado = loggedInCliente.uid;
            const perfil = clientes["PerfilDoCliente"];
            const clienteData = perfil[clienteLogado];
            
            if (!clienteData) {
                console.error("Advogado não encontrado.");
                return;
            }

            console.log("Dados do advogado:", clienteData);

            Object.keys(clienteData).forEach(clienteKey => {
                const cliente = clienteData[clienteKey];
                const nomePeticionante = cliente.NomePeticionante;
                const Keyfiltrada = clienteKey.replace(/\s+/g, '-').replace(/[^\w-]/g, '');

                console.log(`Processando cliente: ${nomePeticionante}`, cliente);

                if (nomePeticionante) {
                    const cpfAtivo = cliente.CPFAtivo || "CPF não disponível";
                    const descricao = cliente.Descricao || "Descrição não disponível";
                    const ultimaAlteracao = cliente.UltimaAlt || "#";
                    const situacao = cliente.situacao || "Ainda sem Status";

                    const newRow = document.createElement('tr');
                    newRow.setAttribute('data-cliente-key', clienteKey);
                    newRow.innerHTML = `
                          <td class="nome-peticionante">${nomePeticionante}</td>
                        <td class="cpf-ativo">${cpfAtivo}</td>
                        <td class="descricao">${descricao}</td>
                        <td class="ultima-alteracao">${ultimaAlteracao}</td>
                        <td>
                            <input type="text" value="${situacao}" class="form-control" readonly />
                        </td>
                        <td><button href="#" class="baixar-peticao" data-cliente-key="${Keyfiltrada}">Visualizar</button></td>`;


                    clientesTable.appendChild(newRow);

                    document.querySelectorAll('.baixar-peticao').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                    
                           
                            const currentClientKey = link.getAttribute('data-cliente-key');
                            console.log(`Visualizando detalhes do cliente ${currentClientKey}`);
                    
                            showClientDetails(clienteKey, currentClientKey, clienteData);
                        });
                    });
                }
            });

            populateSelectOptions(clienteData, 'emSituacao', 'situacao');

            document.getElementById('emSituacao').addEventListener('change', function() {
                const selectedOptionText = this.options[this.selectedIndex].textContent.trim();
                console.log(`Filtrando clientes por nome: ${selectedOptionText}`);
                const clientesFiltrados = filtrarClientesPorNomePeticionante(clienteData, selectedOptionText);
                renderClientes(clientesFiltrados);
            });
        })
        .catch(error => console.error("Erro ao buscar clientes:", error));
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

export function showClientDetails(clienteKey, currentClientKey, clienteData) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    const logCliente = JSON.parse(loggedInClienteString);
    const urlAtt = `${databaseURL}/Cliente/PerfilDoCliente/${logCliente.uid}/${clienteKey}.json`;

    console.log(`Buscando detalhes do cliente: ${urlAtt}`);
    axios.get(urlAtt)
        .then(response => {
            const cliente = response.data;

            // Verifique se o cliente existe e tem a propriedade esperada
            if (cliente && cliente.NomePeticionante === currentClientKey) {
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

export function populateSelectOptions(clienteData, selectId, optionKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error("Select não encontrado.");
        return;
    }

    console.log("Populando opções para o select:", selectId);
    select.innerHTML = ""; // Limpa as opções existentes

    // Adiciona a opção vazia somente se não houver dados para popular
    const emptyOption = document.createElement('option');
    emptyOption.value = "";
    emptyOption.textContent = "Selecione uma opção";
    select.appendChild(option);

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

    // Adiciona a opção vazia apenas se não houver opções
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