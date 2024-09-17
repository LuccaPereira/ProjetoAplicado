const {
    validarCPF,
    validarCNPJ,
    validarEmail,
    validarValor,
    validarTelefoneOficial,
    montarOData
} = require('../../model/cadastrarPeticao');

function enviarFormulario(event) {
    event.preventDefault();
    montarOData()
        .then(() => {
            alert("Novo cliente cadastrado com sucesso!");
            window.location.reload();
        })
        .catch(error => {
            alert(`Erro: ${error}`);
        });
}

document.getElementById('formulario').addEventListener('submit', enviarFormulario);
