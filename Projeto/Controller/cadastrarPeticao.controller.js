// Função para validar CPF
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
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o primeiro dígito verificador
    if (parseInt(cpf.charAt(9)) !== digitoVerif1) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o segundo dígito verificador
    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    return true;
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    // Remove todos os caracteres não numéricos do CNPJ
    cnpj = cnpj.replace(/\D/g, '');

    // Verifica se o CNPJ tem exatamente 14 dígitos
    if (cnpj.length !== 14) {
        return false;
    }

    // Calcula o primeiro dígito verificador
    let soma = 0;
    let pos = 5;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos;
        pos -= 1;
        if (pos < 2) {
            pos = 9;
        }
    }
    let digitoVerif1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o primeiro dígito verificador
    if (parseInt(cnpj.charAt(12)) !== digitoVerif1) {
        return false;
    }

    // Calcula o segundo dígito verificador
    soma = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * pos;
        pos -= 1;
        if (pos < 2) {
            pos = 9;
        }
    }
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica o segundo dígito verificador
    if (parseInt(cnpj.charAt(13)) !== digitoVerif2) {
        return false;
    }

    return true;
}

// Função para validar e-mail usando regex
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar o valor no formato R$ 00,00 usando regex
function validarValor(valor) {
    const regex = /^R\$ \d{1,3}(\.\d{3})*,\d{2}$/;
    return regex.test(valor);
}

// Função principal para montar os dados e enviar para o Firebase
function montarOData() {
    // Configurações do Firebase
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

    // Inicializa o Firebase com as configurações
    firebase.initializeApp(firebaseConfig);

    // Obtém os valores dos campos do formulário
    const nomePeticionante = document.getElementById('nomePeticionante').value;
    const foro = document.getElementById('foro').value;
    const acidente = document.getElementById('acidente').value;
    const valor = document.getElementById('valor').value;
    const procedimento = document.getElementById('procedimento').value;
    const auxilio = document.getElementById('auxilio').value;
    const cpfAtivo = document.getElementById('cpfAtivo').value;
    const cnpjPassivo = document.getElementById('cnpjPassivo').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const descricao = document.getElementById('descricao').value;
    const NomeAdvogado = document.getElementById('NomeAdvogado').value;

    // Função para obter a data formatada
    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const ultimaAlteracao = getFormattedDate();

    // Verifica se há campos vazios
    if (
        !nomePeticionante ||
        !foro ||
        !acidente ||
        !valor ||
        !procedimento ||
        !auxilio ||
        !cpfAtivo ||
        !cnpjPassivo ||
        !email ||
        !telefone ||
        !descricao ||
        !NomeAdvogado
    ) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Valida o CPF
    if (!validarCPF(cpfAtivo)) {
        alert('Favor inserir um CPF válido.');
        return;
    }

    // Valida o CNPJ
    if (!validarCNPJ(cnpjPassivo)) {
        alert('Favor inserir um CNPJ válido.');
        return;
    }

    // Valida o e-mail
    if (!validarEmail(email)) {
        alert('Favor inserir um e-mail válido.');
        return;
    }

    // Valida o valor no formato correto
    if (!validarValor(valor)) {
        alert('Valor inválido. Favor inserir no formato R$ 00,00.');
        return;
    }

    // URL do banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}.json`;

    // Dados a serem enviados para o Firebase
    const oData = {
        NomeAdvogado: NomeAdvogado,
        [NomeAdvogado]: {
            NomePeticionante: nomePeticionante,
            CPFAtivo: cpfAtivo,
            CNPJ: cnpjPassivo,
            Acidente: acidente,
            Auxilio: auxilio,
            Valor: valor,
            Foro: foro,
            Procedimento: procedimento,
            Email: email,
            Telefone: telefone,
            Descrição: descricao,
            ultimaAlteracao: ultimaAlteracao
        }
    };

    // Verifica se há um arquivo PDF para upload
    const pdfFileInput = document.getElementById("pdfFile");
    if (pdfFileInput.value != "") {
        const storage = firebase.storage();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFileInput.name}`;
        const storageRef = storage.ref(`pdfs/${fileName}`);
        const pdfFile = pdfFileInput.files[0];

        // Faz o upload do arquivo PDF e obtém a URL de download
        storageRef.put(pdfFile)
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((downloadURL) => {
                oData.pdfURL = downloadURL;

                // Envia os dados para o Firebase
                return axios.post(url, oData);
            })
            .then((response) => {
                alert("Petição cadastrada com sucesso!");
                console.log("Cliente adicionado ao Firebase:", response.data);
            })
            .catch((error) => {
                alert("Erro ao cadastrar petição: " + error.message);
            });
    } else {
        // Envia os dados para o Firebase sem o arquivo PDF
        return axios.post(url, oData)
            .then(response => {
                alert("Petição cadastrada com sucesso!");
                console.log("Cliente adicionado ao Firebase:", response.data);
                return response.data;
            })
            .catch(error => {
                alert("Erro ao cadastrar petição: " + error);
                throw error;
            });
    }
}