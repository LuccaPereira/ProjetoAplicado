import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

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
const db = getDatabase(app);

export function validarCPF(cpf) {
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

export async function getAdvogadoInfo(uid) {
    const advogadoRef = ref(db, `Advogado/PerfilAdvogado/${uid}`);
    const snapshot = await get(advogadoRef);

    if (snapshot.exists()) {
        const dadosAdvogado = snapshot.val();
        return {
            uid: uid,
            email: auth.currentUser.email,
            nome: dadosAdvogado.nome || '',
            oab: dadosAdvogado.OAB || '',
            senha: dadosAdvogado.senha || '',
            cpf: dadosAdvogado.CPF || ''
        };
    } else {
        console.log('Perfil do advogado não encontrado no banco de dados.');
        return { uid: uid, email: auth.currentUser.email };
    }
}

// Função para buscar as informações completas do advogado no Realtime Database
export async function getClienteInfo(uid) {
    const ClienteRef = ref(db, `Cliente/PerfilDoCliente/${uid}`);
    const snapshot = await get(ClienteRef);
    console.log(snapshot);
    if (snapshot.exists()) {
        const dadoscliente = snapshot.val();
        return {
            uid: uid,
            email: auth.currentUser.email,
            nome: dadoscliente.nome || '',
            cpf: dadoscliente.cpf || '',
            senha: dadoscliente.senha || '',
            uid: dadoscliente.uid || ''
        };
    } else {
        console.log('Perfil do advogado não encontrado no banco de dados.');
        return { uid: uid, email: auth.currentUser.email };
    }
}