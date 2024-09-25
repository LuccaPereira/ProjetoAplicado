import { fetchClientes, archiveClient, updateSituacaoInDatabase, saveClientDetails } from '../model/consultar-modelo.js';

let protocolNumber = "";

export function oabAdvogadoLogado() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    console.log("Advogado logado (localStorage):", loggedInLawyerString);
    return loggedInLawyerString ? JSON.parse(loggedInLawyerString) : null;
}

function getCurrentDateTime() {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
}

function gerarNumeroAleatorio() {
    const numeroAleatorio = Math.floor(Math.random() * 900) + 100;
    return numeroAleatorio;
}

function clickMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('loggedInLawyer');
    localStorage.removeItem('loggedInCliente');

    window.location.href = '../View/login.html';
})

function paginaPerfil() {
    window.location.href = '../View/perfilAdvogado.html';
}


document.addEventListener('DOMContentLoaded', () => {
    clickMenu();
});

export function renderClientes() {
    const loggedInLawyer = oabAdvogadoLogado();
    if (!loggedInLawyer) {
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
            const advLogado = loggedInLawyer.OAB;
            const advogadoData = clientes[advLogado];
            if (!advogadoData) {
                console.error("Advogado não encontrado.");
                return;
            }

            console.log("Dados do advogado:", advogadoData);

            Object.keys(advogadoData).forEach(clienteKey => {
                const cliente = advogadoData[clienteKey];
                const nomePeticionante = cliente.NomePeticionante;
                const Keyfiltrada = clienteKey.replace(/\s+/g, '-').replace(/[^\w-]/g, '');

                console.log(`Processando cliente: ${nomePeticionante}`, cliente);

                if (nomePeticionante) {
                    const cpfAtivo = cliente.CPFAtivo || "CPF não disponível";
                    const descricao = cliente.Descrição || "Descrição não disponível";
                    const ultimaAlteracao = cliente.ultimaAlteracao || "#";

                    const newRow = document.createElement('tr');
                    newRow.setAttribute('data-cliente-key', clienteKey);
                    newRow.innerHTML = `
                        <td class="nome-peticionante">${nomePeticionante}</td>
                        <td class="cpf-ativo">${cpfAtivo}</td>
                        <td class="descricao">${descricao}</td>
                        <td class="ultima-alteracao">${ultimaAlteracao}</td>
                        <td>
                            <select id="selectSituation-${Keyfiltrada}" class="situation">
                                <option value="emcadastramento">Em cadastramento</option>
                                <option value="aguardandoenvio">Aguardando envio</option>
                                <option value="protocolada">Protocolada</option>
                            </select>
                        </td>
                        <td><button href="#" class="baixar-peticao" data-cliente-key="${Keyfiltrada}">Visualizar</button></td>
                        <td>
                            <button class="arquivar-btn" data-cliente-key="${Keyfiltrada}">Arquivar</button>
                        </td>`;

                    clientesTable.appendChild(newRow);

                    const select = newRow.querySelector(`#selectSituation-${Keyfiltrada}`);
                    if (select) {
                        select.value = cliente.situacao || 'Protocolada';
                        select.addEventListener('change', function() {
                            const selectedValue = this.value;
                            if (selectedValue === 'emcadastramento') {
                                var protocolField =  document.getElementById('protocolNumber'); 
                                if (protocolField.value === "") {
                                    protocolNumber = gerarNumeroAleatorio();
                                    protocolField.value = protocolNumber;
                                }
                                protocolField.setAttribute('readonly', true);
                    
                                const modal = new bootstrap.Modal(document.getElementById('editPetitionModal'));
                                modal.show();
                            }
                            console.log(`Alterando situação do cliente ${clienteKey} para ${selectedValue}`);
                            updateSituacaoInDatabase(clienteKey, selectedValue)
                                .then(() => alert("Nosso banco de dados foi atualizado!"))
                                .catch(error => console.error("Erro ao salvar detalhes do cliente:", error));
                        });
                    }
                    

                    document.querySelectorAll('.baixar-peticao').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            console.log(`Visualizando detalhes do cliente ${clienteKey}`);
                            showClientDetails(clienteKey, advogadoData);
                        });
                    });

                    document.querySelectorAll('.arquivar-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            const row = this.closest('tr');
                            const nomePeticionante = row.querySelector('.nome-peticionante').textContent;

                            Swal.fire({
                                title: 'Você tem certeza?',
                                text: `Deseja mesmo arquivar o processo de ${nomePeticionante}?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#0a3030',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Sim, arquivar!',
                                cancelButtonText: 'Cancelar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const clienteKey = this.getAttribute('data-cliente-key');
                                    console.log(`Arquivando cliente ${clienteKey}`);
                                    archiveClient(clienteKey)
                                        .then(() => {
                                            Swal.fire('Arquivado!', 'O processo foi arquivado com sucesso.', 'success');
                                            row.remove();
                                        })
                                        .catch(error => console.error("Erro ao arquivar cliente:", error));
                                } else {
                                    Swal.fire('Cancelado', 'O processo não foi arquivado.', 'error');
                                }
                            });
                        });
                    });
                }
            });

            populateSelectOptions(advogadoData, 'emNomeDe', 'NomePeticionante');

            document.getElementById('emNomeDe').addEventListener('change', function() {
                const selectedOptionText = this.options[this.selectedIndex].textContent.trim();
                console.log(`Filtrando clientes por nome: ${selectedOptionText}`);
                const clientesFiltrados = filtrarClientesPorNomePeticionante(advogadoData, selectedOptionText);
                renderClientes(clientesFiltrados);
            });
        })
        .catch(error => console.error("Erro ao buscar clientes:", error));
}

function saveStatus() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";

    const peticionante = document.getElementById('petitionId').value;
    const status = document.getElementById('petitionStatus').value;
    const protocolNumber = gerarNumeroAleatorio(); 
    const protocolDate = document.getElementById('protocolDate').value;
    const petitionPortal = document.getElementById('petitionPortal').value;
    const petitionObservations = document.getElementById('petitionObservations').value;

    // Atualiza o campo de número do protocolo com o valor gerado
    document.getElementById('protocolNumber').value = protocolNumber;
    console.log('Número do Protocolo gerado:', protocolNumber);
    const loggedInLawyer = oabAdvogadoLogado();
    const url = `${databaseURL}/${collectionPath}/${loggedInLawyer.OAB}/${peticionante}.json`;

    axios.patch(url, {
        situacao: status,
        protocoloNum: protocolNumber,
        protocoloData: protocolDate,
        protocoloPortal: petitionPortal,
        protocoloObservacao: petitionObservations
    })
    .then(response => {
        modal.hide();
        location.reload();
    })
    .catch(error => {
        console.error('Erro ao atualizar o status da petição:', error); 
    });
}

export function showClientDetails(clienteKey, advogadoData) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const urlAtt = `${databaseURL}/Advogado/${logAdv.OAB}/${clienteKey}.json`;

    console.log(`Buscando detalhes do cliente: ${urlAtt}`);
    axios.get(urlAtt)
    .then(response => {
        const cliente = response.data;

        if (cliente) {
            const adv = cliente.NomeAdvogado;
            if (adv) {
                // Preencher o modal com as informações do cliente
                document.getElementById('modalNome').textContent = cliente.NomePeticionante || "Nome não disponível";
                document.getElementById('modalCpf').textContent = cliente.CPFAtivo || "CPF não disponível";
                document.getElementById('modalDescricao').textContent = cliente.Descrição || "Descrição não disponível";
                document.getElementById('modalUltimaAlteracao').textContent = cliente.ultimaAlteracao || "Data não disponível";

                document.getElementById('editNome').value = cliente.NomePeticionante || "";
                document.getElementById('editCpf').value = cliente.CPFAtivo || "";
                document.getElementById('editDescricao').value = cliente.Descrição || "";
                document.getElementById('editUltimaAlteracao').value = cliente.ultimaAlteracao || "";
                document.getElementById('editUltimaAlteracao').readOnly = true;

                const editButton = document.getElementById('editButton');
                const saveButton = document.getElementById('saveButton');

                editButton.onclick = () => {
                    toggleEditMode(true);
                };

                saveButton.onclick = () => {
                    const updatedClientData = {
                        NomePeticionante: document.getElementById('editNome').value,
                        CPFAtivo: document.getElementById('editCpf').value,
                        Descrição: document.getElementById('editDescricao').value,
                        ultimaAlteracao: getCurrentDateTime(),
                    };
                    saveClientDetails(urlAtt, updatedClientData);
                    if(saveClientDetails){
                        Swal.fire({
                            title: 'Sucesso!',
                            text: `${updatedClientData.NomePeticionante} foi alterado com sucesso`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        modal.hide();
                    }else {
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Houve um erro ao alterar os dados. Tente novamente.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        console.error("Erro ao atualizar detalhes do cliente:", error);
                    }
                };

                toggleEditMode(false);

                const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
                modal.show();
            } else {
                console.error("Advogado não encontrado nos detalhes do cliente");
            }
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

    document.getElementById('editButton').classList.toggle('d-none', editMode);
    document.getElementById('saveButton').classList.toggle('d-none', !editMode);
}

export function populateSelectOptions(advogadoData, selectId, optionKey) {
    const select = document.getElementById(selectId);
    if (!select) {
        console.error("Select não encontrado.");
        return;
    }

    console.log("Populando opções para o select:", selectId);
    Object.keys(advogadoData).forEach(clienteKey => {
        const cliente = advogadoData[clienteKey];
        if (cliente[optionKey]) {
            const option = document.createElement('option');
            option.textContent = cliente[optionKey];
            select.appendChild(option);
        }
    });
}

export function filtrarClientesPorNomePeticionante(advogadoData, nomePeticionante) {
    const clientesFiltrados = {};
    console.log(`Filtrando clientes por nome: ${nomePeticionante}`);

    Object.keys(advogadoData).forEach(clienteKey => {
        const cliente = advogadoData[clienteKey];
        if (cliente.NomePeticionante === nomePeticionante) {
            clientesFiltrados[clienteKey] = cliente;
        }
    });

    console.log("Clientes filtrados:", clientesFiltrados);
    return clientesFiltrados;
}

renderClientes()