const firebaseConfig = {
    apiKey: "AIzaSyAu1cx1J9ihabcJuaIu0clTXtU7JpyOwCM",
    authDomain: "projetoaplicado-1.firebaseapp.com",
    databaseURL: "https://projetoaplicado-1-default-rtdb.firebaseio.com",
    projectId: "projetoaplicado-1",
    storageBucket: "projetoaplicado-1.appspot.com",
    messagingSenderId: "546978495496",
    appId: "1:546978495496:web:502e5bab60ead7fcd0a5bd",
    measurementId: "G-WB0MPN3701"
};

function oabAdvogadoLogado() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');

    if (loggedInLawyerString) {
        const loggedInLawyer = JSON.parse(loggedInLawyerString);
        return loggedInLawyer;
    } else {
        console.log("Nenhum advogado está logado.");
        return null;
    }
}

function fetchClientes(loggedInLawyer) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
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

            const advogadoData = clientes[loggedInLawyer.OAB];
            if (!advogadoData) {
                console.error("Advogado não encontrado.");
                return;
            }

            Object.keys(advogadoData).forEach(clienteKey => {
                const cliente = advogadoData[clienteKey];
                const nomePeticionante = cliente.NomePeticionante
                if (nomePeticionante){
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
                                <select id="selectSituation-${clienteKey}" class="situation">
                                    <option value="emcadastramento">Em cadastramento</option>
                                    <option value="aguardandoenvio">Aguardando envio</option>
                                    <option value="protocolada">Protocolada</option>
                                </select>
                            </td>
                            <td><a href="#" class="baixar-peticao" data-cliente-key="${clienteKey}">Visualizar</a></td>
                            <td>
                                <button class="arquivar-btn" data-cliente-key="${clienteKey}">Arquivar</button>
                            </td>`;
        
                        const select = newRow.querySelector(`#selectSituation-${clienteKey}`);
                        select.value = cliente.situacao || 'em cadastramento';
        
                        select.addEventListener('change', function() {
                            const selectedValue = this.value;
                            updateSituacaoInDatabase(clienteKey, selectedValue, cliente);
                        });
        
                        clientesTable.appendChild(newRow);
                        
                        console.log(clientes);
                    };
                    const adv = cliente.NomeAdvogado;
                    if (adv){
                        populateSelectOptions(advogadoData, 'emNomeDe', 'NomePeticionante');
                        document.getElementById('emNomeDe').addEventListener('change', function() {
                                const nomePeticionanteSelecionado = cliente.NomePeticionante;
                                const clientesFiltrados = filtrarClientesPorNomePeticionante(cliente, nomePeticionanteSelecionado);
                                renderClientes(clientesFiltrados);
                        });
                    }

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
                            archiveClient(clienteKey);
                            Swal.fire(
                                'Arquivado!',
                                'O processo foi arquivado com sucesso.',
                                'success'
                            );
                        } else {
                            Swal.fire(
                                'Cancelado',
                                'O processo não foi arquivado.',
                                'error'
                            );
                        }
                    });
                });
            });

            console.log(clientes);
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

function filtrarClientesPorNomePeticionante(clientes, nomePeticionante) {
    const clientesFiltrados = {};
    console.log("Filtrando clientes por nome peticionante:", nomePeticionante);
    
    var selectElement = document.getElementById('emNomeDe');
    var selectedIndex = selectElement.selectedIndex;
    var selectedOptionText = selectElement.options[selectedIndex].textContent;

    for (const clienteKey in clientes) {
        const subobjeto = clientes[clienteKey];
        const nomePeticionanteCliente = subobjeto.NomePeticionante || "";
        
        if (nomePeticionanteCliente === selectedOptionText) {
            clientesFiltrados[clienteKey] = subobjeto;
        }
    }

    return clientesFiltrados;
}


function renderClientes(clientesFiltrados) {
    const clientesTable = document.getElementById("clientesBody");

    if (!clientesTable) {
        console.error("Tabela não encontrada.");
        return;
    }

    clientesTable.innerHTML = "";

    for (const clienteKey in clientesFiltrados) {
        const cliente = clientesFiltrados[clienteKey];
        const adv = cliente.NomeAdvogado;
        if (adv) {
            const nomePeticionante = cliente.NomePeticionante || "Nome não disponível";
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
                    <select id="selectSituation-${clienteKey}">
                        <option value="emcadastramento">Em cadastramento</option>
                        <option value="aguardandoenvio">Aguardando envio</option>
                        <option value="protocolada">Protocolada</option>
                    </select>
                </td>
                <td><a href="#" class="baixar-peticao" data-cliente-key="${clienteKey}">Visualizar</a></td>
                <td>
                    <button class="arquivar-btn" data-cliente-key="${clienteKey}">Arquivar</button>
                </td>`;

            const select = newRow.querySelector(`#selectSituation-${clienteKey}`);
            select.value = cliente.situacao || 'em cadastramento';

            select.addEventListener('change', function() {
                const selectedValue = this.value;
                updateSituacaoInDatabase(clienteKey, selectedValue, cliente);
            });

            clientesTable.appendChild(newRow);
        }
    }
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

function archiveClient(clienteKey) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Cliente/${clienteKey}.json`;
    const archivePath = `Arquivados/${clienteKey}.json`;

    axios.get(`${databaseURL}/${collectionPath}`)
        .then(response => {
            const clienteData = response.data;

            // Enviar os dados para a coleção "Arquivados"
            axios.put(`${databaseURL}/${archivePath}`, clienteData)
                .then(() => {
                    // Remover o cliente da coleção original "Cliente"
                    axios.delete(`${databaseURL}/${collectionPath}`)
                        .then(() => {
                            // Atualizar a tabela na interface removendo a linha arquivada
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


function updateSituacaoInDatabase(clienteKey, selectedValue, cliente) {
    const clienteKeyAtt = cliente.NomeAdvogado;
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Cliente`;
    const urlAtt = `${databaseURL}/${collectionPath}/${clienteKey}/${clienteKeyAtt}.json`;

    const updatedDetails = {
        situacao: selectedValue,
    };

    console.log("Updated Details:", updatedDetails);

    return axios.patch(urlAtt, updatedDetails)
        .then(response => {
            alert("Nosso banco de dados foi atualizado!");
            window.location.reload();
            return response.data;
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
                select.appendChild(option);
            }
        });
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
                const adv = cliente.NomeAdvogado;
                if (adv && cliente[adv]) {
                    const clientDetails = cliente[adv];

                    document.getElementById('modalNome').textContent = clientDetails.NomePeticionante || "Nome não disponível";
                    document.getElementById('modalCpf').textContent = clientDetails.CPFAtivo || "CPF não disponível";
                    document.getElementById('modalDescricao').textContent = clientDetails.Descrição || "Descrição não disponível";
                    document.getElementById('modalUltimaAlteracao').textContent = clientDetails.ultimaAlteracao || "Data não disponível";
                    document.getElementById('modalPeticao').innerHTML = `<a href="#">Visualizar</a>`;

                    document.getElementById('editNome').value = clientDetails.NomePeticionante || "";
                    document.getElementById('editCpf').value = clientDetails.CPFAtivo || "";
                    document.getElementById('editDescricao').value = clientDetails.Descrição || "";
                    document.getElementById('editUltimaAlteracao').value = clientDetails.ultimaAlteracao || "";

                    const editButton = document.getElementById('editButton');
                    const saveButton = document.getElementById('saveButton');

                    editButton.onclick = () => {
                        toggleEditMode(true);
                    };

                    saveButton.onclick = () => {
                        saveClientDetails(response, clienteKey);
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

function saveClientDetails(response, clienteKey) {
    console.log(response.data.NomeAdvogado);
    const clienteKeyAtt = response.data.NomeAdvogado;
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Cliente`;
    const urlAtt = `${databaseURL}/${collectionPath}/${clienteKey}/${clienteKeyAtt}.json`;
    firebase.initializeApp(firebaseConfig);

    const updatedDetails = {
        NomePeticionante: document.getElementById('editNome').value,
        CPFAtivo: document.getElementById('editCpf').value,
        Descrição: document.getElementById('editDescricao').value,
        ultimaAlteracao: getCurrentDateTime()
    };

    console.log("Updated Details:", updatedDetails);

    const pdfFileInput = document.getElementById("pdfFile");

    if (pdfFileInput.files.length > 0) {
        const storage = firebase.storage();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFileInput.files[0].name}`;
        const storageRef = storage.ref(`pdfs/${fileName}`);
        const pdfFile = pdfFileInput.files[0];

        storageRef.put(pdfFile)
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((downloadURL) => {
                updatedDetails.pdfURL = downloadURL;

                return axios.patch(urlAtt, updatedDetails);
            })
            .then(() => {
                alert("Nosso banco de dados foi atualizado!");
                const modalElement = document.getElementById('clienteModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.hide();
                window.location.reload();
            })
            .catch((error) => {
                console.error("Erro ao salvar detalhes do cliente:", error);
                alert('Erro ao salvar detalhes do cliente. Consulte o console para mais informações.');
            });
    } else {
        axios.patch(urlAtt, updatedDetails)
            .then(() => {
                alert("Nosso banco de dados foi atualizado!");
                const modalElement = document.getElementById('clienteModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.hide();
                window.location.reload();
            })
            .catch((error) => {
                console.error("Erro ao salvar detalhes do cliente:", error);
                alert('Erro ao salvar detalhes do cliente. Consulte o console para mais informações.');
            });
    }
}

function getCurrentDateTime() {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
}

document.addEventListener("DOMContentLoaded", function() {
    const loggedInLawyer = oabAdvogadoLogado();
    if (loggedInLawyer) {
        fetchClientes(loggedInLawyer);
    } else {
        console.log("Nenhum advogado logado. Redirecionando para a página de login.");
        // Redirecionar para a página de login ou mostrar uma mensagem de erro
    }
});
