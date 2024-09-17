import { firebaseConfig } from '../../model/firebaseConfig.js';
import { oabAdvogadoLogado, fetchClientes, renderClientes } from '../../model/tabelaCliente.js';

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function() {
    const loggedInLawyer = oabAdvogadoLogado();

    if (loggedInLawyer) {
        fetchClientes(loggedInLawyer, function(clientes) {
            const clientesTable = document.getElementById('clientesTable');
            if (clientesTable) {
                renderClientes(clientes, clientesTable);
            } else {
                console.error("Tabela de clientes não encontrada.");
            }
        });
    }
});
