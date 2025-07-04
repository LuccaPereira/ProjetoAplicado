import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';

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
const storage = getStorage(app);

const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

export function fetchClientes() {
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}.json`;

    return axios.get(url);
}

export async function archiveClient(clienteKey) {
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    const logCliente = JSON.parse(loggedInClienteString);

    if (!logCliente || !logCliente.uid) {
        throw new Error('Usuário não está autenticado.');
    }

    const collectionPath = `Advogado/PerfilAdvogado/${logCliente.uid}/${clienteKey}.json`;
    const archivePath = `Arquivados/${logCliente.uid}/${clienteKey}.json`;

    try {

        const response = await axios.get(`${databaseURL}/${collectionPath}`);
        const clienteData = response.data;

        if (!clienteData) {
            throw new Error('Dados do cliente não encontrados.');
        }

        console.log('Dados do cliente obtidos:', clienteData);
        clienteData.situacao = "Arquivado";

        await axios.put(`${databaseURL}/${archivePath}`, clienteData);
        console.log(`Dados arquivados com sucesso em: ${archivePath}`);

        await axios.delete(`${databaseURL}/${collectionPath}`);
        console.log(`Dados excluídos do caminho original: ${collectionPath}`);
    } catch (error) {
        console.error('Erro ao arquivar cliente:', error.message);
        throw error; 
    }
}


export function updateSituacaoInDatabase(clienteKeyAtt, selectedValue) {
    const loggedInClienteString = localStorage.getItem('loggedInUser');
    const logAdv = JSON.parse(loggedInClienteString);
    const urlAtt = `${databaseURL}/Advogado/PerfilAdvogado/${logAdv.uid}/${clienteKeyAtt}.json`;
    const urlHistorico = `${databaseURL}/Advogado/PerfilAdvogado/${logAdv.uid}/${clienteKeyAtt}/HistoricoSituacao.json`;


    const timestamp = new Date();
    const formattedTimestamp = timestamp.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    let updatedDetails = {}; 

    if (!selectedValue) {
        selectedValue = "Informações da petição atualizadas"
        updatedDetails = { 
            descricao: selectedValue,
            UltimaAlt: formattedTimestamp
        };
    } else {
        updatedDetails = { 
            situacao: selectedValue,
            UltimaAlt: formattedTimestamp
        };
    }

    return axios.patch(urlAtt, updatedDetails)
        .then(() => {
            const historicoData = {
                situacao: selectedValue,
                data: formattedTimestamp 
            };
            return axios.post(urlHistorico, historicoData);
        })
        .then(() => {
            console.log("Situação atualizada e histórico salvo com sucesso.");
        })
        .catch(error => {
            console.error("Erro ao atualizar situação ou salvar histórico:", error);
        });
}
export function saveClientDetails(urlAtt, updatedClientData, pdfFile) {
    const chave = updatedClientData.nomeFormatado;
    if (pdfFile) {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFile.name}`;
        const storageRef = ref(storage, `pdfs/${fileName}`);

        return uploadBytes(storageRef, pdfFile)
            .then(snapshot => {
                return getDownloadURL(snapshot.ref);
            })
            .then(downloadURL => {
                updatedClientData.pdfURL = downloadURL;
                updateSituacaoInDatabase(chave);
                return axios.patch(urlAtt, updatedClientData);
            });
    } else {

        updateSituacaoInDatabase(chave);
        return axios.patch(urlAtt, updatedClientData);
    }
}

