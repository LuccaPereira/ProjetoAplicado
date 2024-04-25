const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
const collectionPath = "Cliente";

function fetchClientes() {
    axios.get(`${databaseURL}/${collectionPath}.json`)
        .then(response => {
            const clientes = response.data;
            const clientesTable = document.getElementById("clientesBody");
            clientesTable.innerHTML = "";

            for (let clienteKey in clientes) {
                const cliente = clientes[clienteKey];
                const newRow = `<tr>
                                    <td>${cliente.nome}</td>
                                    <td>${cliente.email}</td>
                                    <td>${cliente.telefone}</td>
                                    <td><a href="${cliente.linkPDF}">PDF</a></td>
                                </tr>`;
                clientesTable.innerHTML += newRow;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
        });
}

fetchClientes();
