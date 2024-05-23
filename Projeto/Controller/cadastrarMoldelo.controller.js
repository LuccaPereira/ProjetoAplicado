// Função para buscar clientes do banco de dados Firebase e exibi-los em uma tabela HTML
function fetchClientes() {
    // URL do banco de dados Firebase e caminho da coleção 'Cliente'
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    // Faz uma requisição GET para buscar os dados dos clientes
    axios.get(url)
        .then(response => {
            // Armazena os dados recebidos na variável 'clientes'
            const clientes = response.data;
            console.log("Dados recebidos:", clientes);
            // Obtém o elemento da tabela HTML onde os dados serão exibidos
            const clientesTable = document.getElementById("clientesBody");

            // Verifica se a tabela foi encontrada
            if (!clientesTable) {
                console.error("Tabela HTML com ID 'clientesBody' não encontrada.");
                return;
            }

            // Limpa o conteúdo atual da tabela
            clientesTable.innerHTML = "";

            // Itera sobre cada cliente nos dados recebidos
            for (let clienteKey in clientes) {
                if (clientes.hasOwnProperty(clienteKey)) {
                    const cliente = clientes[clienteKey];
                    console.log("Detalhes do cliente:", cliente);

                    // Extrai informações do cliente
                    const adv = cliente.NomeAdvogado.toString();
                    const nomePeticionante = cliente[adv].NomePeticionante || "Nome não disponível";
                    const cpfAtivo = cliente[adv].CPFAtivo || "CPF não disponível";
                    const descricao = cliente[adv].Descrição || "Descrição não disponível";
                    const ultimaAlteracao = cliente[adv].ultimaAlteracao || "#";

                    // Cria um elemento 'select' para a situação do cliente
                    const selectSituation = document.createElement('select');
                    selectSituation.id = `selectSituation-${clienteKey}`;

                    // Define as opções para o select
                    const options = ['Em cadastramento', 'Aguardando envio', 'Protocolada', 'Inicial', 'Intermediária'];
                    options.forEach(optionText => {
                        const option = document.createElement('option');
                        option.value = optionText.toLowerCase().replace(/\s/g, ''); // Transforma a opção em minúsculas e remove espaços
                        option.textContent = optionText;
                        selectSituation.appendChild(option);
                    });

                    // Cria uma nova linha na tabela para o cliente
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${nomePeticionante}</td>
                        <td>${cpfAtivo}</td>
                        <td>${descricao}</td>
                        <td>${ultimaAlteracao}</td>
                        <td></td>`;

                    // Adiciona o select na última célula da linha
                    const tdSituation = newRow.querySelector('td:last-of-type');
                    tdSituation.appendChild(selectSituation);

                    // Adiciona a nova linha à tabela
                    clientesTable.appendChild(newRow);
                }
            }

            // Atualiza o elemento select com ID 'cadastradoPor' com os advogados
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
        })
        .catch(error => {
            // Exibe uma mensagem de erro em caso de falha na requisição
            console.error("Erro ao buscar clientes:", error);
        });
}

// Chama a função fetchClientes ao carregar o script
fetchClientes();
