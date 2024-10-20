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

const app = firebase.initializeApp(firebaseConfig); 
const auth = firebase.auth(); 
const database = firebase.database();

export function validarCPF(cpf) {
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

export function validarCNPJ(cnpj) {
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

export function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validarValor(valor) {
    valor = valor.replace('R$', '').trim().replace(/\s+/g, '').replace(',', '.');

    return /^\d+(\.\d{2})?$/.test(valor);
}


export function validarTelefoneOficial(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 10 || telefone.length === 11) {
        const ddd = parseInt(telefone.substring(0, 2));
        if (ddd >= 11 && ddd <= 99) {
            const numero = telefone.substring(2);
            if (telefone.length === 10 && /^[2-5]\d{7}$/.test(numero)) {
                return true;
            }
            if (telefone.length === 11 && /^[6-9]\d{8}$/.test(numero)) {
                return true;
            }
        }
    }
    return false;
}

export function oabAdvogadoLogado() {
    const loggedInLawyerString = localStorage.getItem('loggedInUser');
    console.log("Advogado logado (localStorage):", loggedInLawyerString);
    return loggedInLawyerString ? JSON.parse(loggedInLawyerString) : null;
}

async function naosuportomais(uid, oData){
    await database.ref(`Advogado/PerfilAdvogado/${uid}`).update(oData);
}

export async function montarOData() {
    const loggedInLawyer = oabAdvogadoLogado();
    const logAdv = loggedInLawyer;

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

    const limiteCaracteres = (campo, limite) => campo.length <= limite;

    if (!limiteCaracteres(nomePeticionante, 200)) throw new Error('Nome do Peticionante muito longo');
    if (!limiteCaracteres(nomeAdvogado, 200)) throw new Error('Nome do Advogado muito longo');
    if (!limiteCaracteres(foro, 200)) throw new Error('Foro muito longo');
    if (!limiteCaracteres(acidente, 200)) throw new Error('Descrição do Acidente muito longa');
    if (!limiteCaracteres(procedimento, 200)) throw new Error('Procedimento muito longo');
    if (!limiteCaracteres(descricao, 500)) throw new Error('Descrição muito longa');

    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const ultimaAlteracao = getFormattedDate();

    if (!nomePeticionante || !nomeAdvogado || !foro || !acidente || !valor ||
        !telefone || !procedimento || !auxilio || !email || !descricao ||
        !cpfAtivo || !cnpjPassivo) {
        throw new Error('Campos vazios');
    }

    if (!validarCPF(cpfAtivo)) throw new Error('CPF inválido');
    if (!validarCNPJ(cnpjPassivo)) throw new Error('CNPJ inválido');
    if (!validarEmail(email)) throw new Error('E-mail inválido');
    if (!validarValor(valor)) throw new Error('Valor inválido');
    if (!validarTelefoneOficial(telefone)) throw new Error('Telefone inválido');

    const oData = {
        [nomePeticionante]: {
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
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFileElement.files[0].name}`;
        const pdfFile = pdfFileElement.files[0];
    
        const pdfStorageRef = storageRef(storage, `pdfs/${fileName}`);
    
        try {
            await uploadBytes(pdfStorageRef, pdfFile);
            const downloadURL = await getDownloadURL(pdfStorageRef);
            oData[nomePeticionante].pdfURL = downloadURL;
    
            const uid = logAdv.uid;
            console.log('UID:', uid);
            console.log('oData:', oData);
            
            await naosuportomais(uid, oData);
        } catch (error) {
            console.error('Erro ao enviar o PDF:', error);
        }
    } else {
        const uid = logAdv.uid;
        console.log('Chamando naosuportomais com UID:', uid);
        
        try {
            await naosuportomais(uid, oData);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    }
}

function aplicarMascaraValor(elemento) {
    elemento.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        valor = (valor / 100).toFixed(2) + ''; // Divide por 100 para ajustar casas decimais
        valor = valor.replace('.', ','); // Troca o ponto decimal por vírgula
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos a cada milhar
        e.target.value = 'R$ ' + valor; // Adiciona o 'R$' no início
    });

    // Coloca o cursor sempre no final
    elemento.addEventListener('focus', (e) => {
        setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
        }, 0);
    });
}

// Chamando a função ao carregar a página, aplicando a máscara no campo de valor
window.onload = function() {
    const valorCampo = document.getElementById('valor');
    if (valorCampo) {
        aplicarMascaraValor(valorCampo);
    }
};