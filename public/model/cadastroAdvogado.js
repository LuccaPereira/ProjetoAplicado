
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

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function registrarUsuario(email, senha) {
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

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
        return userCredential.user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
}

async function verificarOABExistente(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    try {
        const response = await axios.get(url);
        return response.data !== null;
    } catch (error) {
        console.error("Erro ao verificar OAB:", error);
        throw error;
    }
}

module.exports = {
    validarCPF,
    validarEmail,
    registrarUsuario,
    verificarOABExistente
};
