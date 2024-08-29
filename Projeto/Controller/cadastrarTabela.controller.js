// Função para validar um CPF
function validarCPF(cpf) {
    // Remove todos os caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem exatamente 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    // Determina o valor do primeiro dígito verificador
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica se o primeiro dígito verificador está correto
    if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    // Determina o valor do segundo dígito verificador
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica se o segundo dígito verificador está correto
    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    // Retorna verdadeiro se ambos os dígitos verificadores estiverem corretos
    return true;
}

// Função para montar os dados e enviá-los para o Firebase
function montarOData() {
    // Obtém os valores dos campos do formulário
    const nomePeticionante = document.getElementById('nomePeticionante').value;
    const foro = document.getElementById('foro').value;
    const acidente = document.getElementById('acidente').value;
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;
    const codigo = document.getElementById('codigo').value;
    const cpfAtivo = document.getElementById('cpfAtivo').value;
    const cnpjPassivo = document.getElementById('cnpjPassivo').value;

    // Valida o CPF ativo
    if (!validarCPF(cpfAtivo)) {
        alert('Favor inserir um CPF válido.');
        return Promise.reject('CPF inválido');
    }

    // Configura a URL e o caminho da coleção no banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    const oData = {
        CNPJ: cnpjPassivo,
        NomePeticionante: nomePeticionante,
        Foro: foro,
        Acidente: acidente,
        Valor: valor,
        Procedimento: procedimento,
        Codigo: codigo,
        CPFAtivo: cpfAtivo
    };

    // Envia os dados para o Firebase Database usando axios.post
    return axios.post(url, oData)
        .then(response => {
            // Exibe mensagem de sucesso e retorna os dados da resposta
            console.log("Dados enviados para o Firebase:", response.data);
            return response.data;
        })
        .catch(error => {
            // Exibe mensagem de erro em caso de falha no envio dos dados
            console.error("Erro ao enviar dados para o Firebase:", error);
            throw error;
        });
}
