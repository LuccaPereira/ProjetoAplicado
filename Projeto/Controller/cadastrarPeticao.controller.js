// Função para validar um CPF
function validarCPF(cpf) {
    // Remove todos os caracteres não numéricos do CPF
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
        return false;
    }
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return parseInt(cpf.charAt(10)) === digitoVerif2;
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
        return false;
    }
    let soma = 0, pos = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(cnpj.charAt(12)) !== digitoVerif1) {
        return false;
    }
    soma = 0; pos = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return parseInt(cnpj.charAt(13)) === digitoVerif2;
}

// Função para validar e-mail usando regex
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function montarOData() {
    
    const nomePeticionante = document.getElementById('nomePeticionante').value;
    const foro = document.getElementById('foro').value;
    const acidente = document.getElementById('acidente').value;
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;
    const codigo = document.getElementById('codigo').value;
    const cpfAtivo = document.getElementById('cpfAtivo').value;
    const cnpjPassivo = document.getElementById('cnpjPassivo').value;
    const senhaCliente = document.getElementById('senhaCliente').value;
    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const ultimaAlteracao = getFormattedDate();

    if (!validarCPF(cpfAtivo)) {
        alert('Favor inserir um CPF válido.');
        return Promise.reject('CPF inválido');
    }

    // Valida o CNPJ
    if (!validarCNPJ(cnpjPassivo)) {
        alert('Favor inserir um CNPJ válido.');
        return Promise.reject('CNPJ inválido');
    }

    // Valida o e-mail
    if (!validarEmail(email)) {
        alert('Favor inserir um e-mail válido.');
        return Promise.reject('E-mail inválido');
    }

    // Valida o valor no formato correto
    if (!validarValor(valor)) {
        alert('Valor inválido. Favor inserir no formato R$ 00,00.');
        return Promise.reject('Valor inválido');
    }

    // Valida o telefone
    if (!validarTelefoneOficial(telefone)) {
        alert('Telefone inválido. Favor inserir um telefone válido.');
        return Promise.reject('Telefone inválido');
    }

    // Valida o CNPJ
    if (!validarCNPJ(cnpjPassivo)) {
        alert('Favor inserir um CNPJ válido.');
        return Promise.reject('CNPJ inválido');
    }

    // Valida o e-mail
    if (!validarEmail(email)) {
        alert('Favor inserir um e-mail válido.');
        return Promise.reject('E-mail inválido');
    }

    // Valida o valor no formato correto
    if (!validarValor(valor)) {
        alert('Valor inválido. Favor inserir no formato R$ 00,00.');
        return Promise.reject('Valor inválido');
    }

    // Configura a URL e o caminho da coleção no banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;


    const oData = {
        [nomePeticionante]: {
            CNPJ: cnpjPassivo,
            NomePeticionante: nomePeticionante,
            Foro: foro,
            Acidente: acidente,
            Valor: valor,
            Procedimento: procedimento,
            Codigo: codigo,
            CPFAtivo: cpfAtivo,
            senhaCliente: senhaCliente,
            UltimaAlt: ultimaAlteracao
        }
    };

    return axios.post(url, oData)
        .then(response => {
            console.log("Dados enviados para o Firebase:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Erro ao enviar dados para o Firebase:", error);
            throw error;
        });
}


