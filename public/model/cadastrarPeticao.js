import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get, set, push, update } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

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

export function clienteLogado() {
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    console.log("Advogado logado (localStorage):", loggedInClienteString);
    return loggedInClienteString ? JSON.parse(loggedInClienteString) : null;
}

async function naosuportomais(uid, oData) {
    await update(ref(database, `Advogado/PerfilAdvogado/${uid}`), oData);
}

async function verificarClienteExistente(cpf, email) {
    const clienteRef = ref(database, 'Cliente/PerfilDoCliente');
    const clienteSnapshot = await get(clienteRef);

    let clienteExistente = null;

    clienteSnapshot.forEach(childSnapshot => {
        const clienteData = childSnapshot.val();
        if (clienteData.cpf === cpf || clienteData.email === email) {
            clienteExistente = {
                uid: childSnapshot.key,
                ...clienteData
            };
        }
    });

    return clienteExistente || false;
}

function verificarNome(nomeOriginal) {
    return nomeOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
}

export async function montarOData() {
    const loggedInCliente = clienteLogado();

    if (!loggedInCliente) {
        throw new Error('Nenhum advogado logado encontrado.');
    }

    const logCliente = loggedInCliente;

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
    const situacao = "Ainda sem Status";
    const nomeOriginal = nomePeticionante;

    const nomeFormatado = verificarNome(nomeOriginal);

    const clienteVerificacao = await verificarClienteExistente(cpfAtivo, email);

    if (clienteVerificacao) {
        console.log('Cliente já existe:', clienteVerificacao);
    } else {
        console.log('Cliente não existe, criando novo cliente');
    }

    const oData = {
        [nomeFormatado]: {
            CNPJ: cnpjPassivo,
            NomePeticionante: nomeOriginal,
            nomeFormatado: nomeFormatado,
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
            UltimaAlt: new Date().toLocaleDateString(),
            situacao: situacao
        }
    };

    const uid = logCliente.uid;
    await naosuportomais(uid, oData);

    const pdfFileElement = document.getElementById("pdfFile");
    if (pdfFileElement && pdfFileElement.files.length > 0) {
        const timestamp = new Date().getTime();
        const file = pdfFileElement.files[0];
        const fileRef = storageRef(storage, `pdf/${timestamp}_${file.name}`);

        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        await update(ref(database, `Advogado/PerfilAdvogado/${uid}`), {
            ...oData,
            pdfFileURL: downloadURL
        });

        console.log("Arquivo PDF carregado com sucesso.");
    }
}
