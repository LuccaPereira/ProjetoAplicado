// Define a URL do banco de dados Firebase Realtime Database
const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com";

// Define o caminho da coleção dentro do banco de dados
const collectionPath = "Cliente/Gabriel/Murilo"; //DEPOIS DO GBRIEL, TEM QUE FAZER ELE PEGAR DE FORMA DINAMICA AS DOIS DADOS MURILO E SIVA

// Define a função para buscar clientes no banco de dados
function fetchClientes() {
    // Faz uma requisição GET à URL do banco de dados seguida do caminho da coleção
    axios.get(`${databaseURL}/${collectionPath}.json`)
        // Manipula a resposta da requisição quando ela for bem-sucedida
        .then(response => {
            // Armazena os dados da resposta em uma variável chamada 'clientes'
            const clientes = response.data;

            // Verifica os dados recebidos
            console.log("Dados recebidos:", clientes);

            // Obtém uma referência à tabela HTML com o ID "clientesBody"
            const clientesTable = document.getElementById("clientesBody");

            // Verifica se a tabela foi encontrada
            if (!clientesTable) {
                console.error("Tabela HTML com ID 'clientesBody' não encontrada.");
                return;
            }

            // Limpa o conteúdo atual da tabela
            clientesTable.innerHTML = "";

            // Inicia a construção do conteúdo da tabela
            let tableContent = "";

            // Itera sobre cada cliente retornado pela requisição
            for (let clienteKey in clientes) {
                // Obtém os detalhes do cliente atual
                const cliente = clientes[clienteKey];

                // Verifica os detalhes do cliente atual
                console.log("Detalhes do cliente:", cliente);

                // Cria uma nova linha para a tabela, preenchendo-a com os detalhes do cliente
                const newRow = `<tr>
                                    <td>${cliente.NomePeticionante}</td>
                                    <td>${cliente.CPFAtivo}</td>
                                    <td>${cliente.Descrição}</td>
                                    <td><a href="${cliente.ultimaAlteracao}">Ultima Alteração</a></td>
                                </tr>`;
                // Adiciona a nova linha ao conteúdo da tabela
                tableContent += newRow;
            }

            // Atualiza o conteúdo da tabela HTML com as novas linhas adicionadas
            clientesTable.innerHTML = tableContent;
        })

        // Manipula qualquer erro ocorrido durante a requisição
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

// Chama a função para iniciar o processo de busca e preenchimento da tabela
fetchClientes();
