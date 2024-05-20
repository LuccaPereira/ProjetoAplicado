function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
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

    if (parseInt(cpf.charAt(10)) !== digitoVerif2) {
        return false;
    }

    return true;
}

function montarOData() {
    
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
    firebase.initializeApp(firebaseConfig);

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

    if (!validarCPF(cpfAtivo)) {
        alert('Favor inserir um CPF válido.');
        return Promise.reject('CPF inválido');
    }

    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Cliente";
    const url = `${databaseURL}/${collectionPath}/${NomeAdvogado}/${nomePeticionante}.json`;


    const oData = {
        NomePeticionante: nomePeticionante,
        CPFAtivo: cpfAtivo,
        CNPJ: cnpjPassivo,
        Acidente: acidente,
        Auxilio: auxilio,
        Valor: valor,
        Foro: foro,
        Procedimento: procedimento,
        Email : email,
        Telefone : telefone,
        Descrição: descricao
    };

    const pdfFile = document.getElementById("pdfFile")
    if(pdfFile){
        const storage = firebase.storage();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFile.name}`;
        const storageRef = storage.ref(`pdfs/${fileName}`);
        const pdfFile = document.getElementById("pdfFile").files[0];
    
    storageRef.put(pdfFile)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {
            oData.pdfURL = downloadURL;

            const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
            const collectionPath = "Cliente";
            const url = `${databaseURL}/${collectionPath}/${NomeAdvogado}/${nomePeticionante}.json`;
            return axios.post(url, oData);
        })
        .then((response) => {
            alert("Novo cliente foi adicionado com sucesso!", response.data.nome);
        })
        .catch((error) => {
            alert("Erro ao adicionar novo cliente: " + error.message);
        });

    } else {

        return axios.post(url, oData)
            .then(response => {
                console.log("Dados enviados para o Firebase:", response.data);
                //form.reset();
                return response.data;
            })
            .catch(error => {
                console.error("Erro ao enviar dados para o Firebase:", error);
                throw error;
            });
    }
    
}