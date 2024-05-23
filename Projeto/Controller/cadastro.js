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
    let digitoVerif2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Verifica se o segundo dígito verificador está correto
    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    // Retorna verdadeiro se ambos os dígitos verificadores estiverem corretos
    return true;
}

// Função para enviar o formulário de cadastro de advogado
function submitForm() {
    // Obtém os valores dos campos do formulário
    const nome = document.getElementById('nome').value;
    const OAB = document.getElementById('OAB').value;
    const CPF = document.getElementById('inputCpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Valida o CPF
    if (!validarCPF(CPF)) {
        alert('Favor inserir um CPF válido.');
        return Promise.reject('CPF inválido');
    }

    // Verifica se a senha tem no mínimo 6 caracteres
    if (senha.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return Promise.reject('Senha muito curta');
    }

    // Verifica se o número da OAB tem exatamente 8 dígitos
    if (OAB.length !== 8) {
        alert('O número da OAB deve conter 8 dígitos.');
        return Promise.reject('Número da OAB inválido');
    }

    // Configura a URL e o caminho da coleção no banco de dados Firebase
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    // Cria um objeto de dados com as informações do formulário
    const oData = {
        nome: nome,
        OAB: OAB,
        CPF: CPF,
        email: email,
        senha: senha
    };

    // Envia os dados para o Firebase Database
    return axios.post(url, oData)
        .then(response => {
            // Exibe mensagem de sucesso e redireciona para a página de login
            console.log("Dados enviados para o Firebase:", response.data);
            window.location.href = "../View/login.html";
            return response.data;
        })
        .catch(error => {
            // Exibe mensagem de erro em caso de falha no envio dos dados
            console.error("Erro ao enviar dados para o Firebase:", error);
            throw error;
        });
}

// Adiciona um evento de escuta ao formulário de cadastro de advogado
document.querySelector('.cadAdv').addEventListener('submit', function(event) {
    // Previne o envio padrão do formulário
    event.preventDefault();
    // Chama a função para enviar o formulário
    submitForm();
});
