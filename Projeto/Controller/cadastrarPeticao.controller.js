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

// Função para validar o valor no formato R$ 00,00 usando regex
function validarValor(valor) {
    return /^R\$ \d{1,3}(\.\d{3})*,\d{2}$/.test(valor);
}

// Função para validar telefone brasileiro
function validarTelefoneOficial(telefone) {
    // Remove todos os caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Verifica se o telefone tem 10 ou 11 dígitos
    if (telefone.length === 10 || telefone.length === 11) {
        // Valida o DDD (código de área) - valores válidos de 11 a 99
        const ddd = parseInt(telefone.substring(0, 2));
        if (ddd >= 11 && ddd <= 99) {
            // Verifica se o número é válido
            // 8 dígitos para telefones fixos e 9 dígitos para celulares
            const numero = telefone.substring(2);
            if (telefone.length === 10 && /^[2-5]\d{7}$/.test(numero)) {
                return true; // Telefone fixo válido
            }
            if (telefone.length === 11 && /^[6-9]\d{8}$/.test(numero)) {
                return true; // Telefone celular válido
            }
        }
    }
    return false; // Telefone inválido
}

// Função para montar os dados e enviá-los para o Firebase
function montarOData() {
    // Obtém os valores dos campos do formulário
    const nomePeticionante = document.getElementById('nomePeticionante')?.value || '';
    const nomeAdvogado = document.getElementById('nomeAdvogado')?.value || '';
    const foro = document.getElementById('foro')?.value || '';
    const acidente = document.getElementById('acidente')?.value || '';
    const valor = document.getElementById('valor')?.value || '';
    const telefone = document.getElementById('telefone')?.value || '';
    const procedimento = document.getElementById('procedimento')?.value || '';
    const auxilio = document.getElementById('auxilio')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const descricao = document.getElementById('descricao')?.value || '';
    const cpfAtivo = document.getElementById('cpfAtivo')?.value || '';
    const cnpjPassivo = document.getElementById('cnpjPassivo')?.value || '';

    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são baseados em zero
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const ultimaAlteracao = getFormattedDate();

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

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Verifica se há campos vazios
    if (
        !nomePeticionante ||
        !nomeAdvogado ||
        !foro ||
        !acidente ||
        !valor ||
        !telefone ||
        !procedimento ||
        !auxilio ||
        !email ||
        !descricao ||
        !cpfAtivo ||
        !cnpjPassivo
    ) {
        alert('Por favor, preencha todos os campos.');
        return Promise.reject('Campos vazios');
    }

    // Valida o CPF ativo
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

    // Configura a URL e o caminho da coleção no banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
      const url = `${databaseURL}/${collectionPath}.json`;

    // Cria um objeto de dados com as informações do formulário
    const oData = {
        [nomePeticionante]: { // Utiliza o nome do peticionante como chave
            CNPJ: cnpjPassivo,
            NomePeticionante: nomePeticionante,
            NomeAdvogado: nomeAdvogado,
            Foro: foro,
            Acidente: acidente,
            Valor: valor,
            Procedimento: procedimento,
            Telefone: telefone,
            Auxilio: auxilio,
            Email: email,
            Descricao: descricao,
            CPFAtivo: cpfAtivo,
            UltimaAlt: ultimaAlteracao
        }
    };

    const pdfFileElement = document.getElementById("pdfFile");
    if (pdfFileElement && pdfFileElement.files.length > 0) {
        const storage = firebase.storage();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFileElement.name}`;
        const storageRef = storage.ref(`pdfs/${fileName}`);
        const pdfFile = pdfFileElement.files[0];

        return storageRef.put(pdfFile)
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((downloadURL) => {
                oData[nomePeticionante].pdfURL = downloadURL;

                return axios.post(url, oData);
            })
            .then(response => {
                alert("Arquivo PDF enviado com sucesso.");
                alert("Novo cliente cadastrado com sucesso", response.data);
                window.location.reload();
                return response.data;
            })
            .catch(error => {
                console.error("Erro ao enviar dados para o Firebase:", error);
                alert("Erro ao enviar o arquivo PDF.");
                throw error;
            });
    } else {
        // Envia os dados para o Firebase Database usando axios.post
        return axios.post(url, oData)
            .then(response => {
                alert("Novo cliente cadastrado com sucesso", response.data);
                window.location.reload();
                return response.data;
            })
            .catch(error => {
                console.error("Erro ao enviar dados para o Firebase:", error);
                throw error;
            });
    }
}
