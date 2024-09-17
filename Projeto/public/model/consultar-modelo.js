const axios = require('axios');

function fetchClientes(loggedInLawyer) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = `Advogado/${loggedInLawyer.OAB}.json`;
    const url = `${databaseURL}/${collectionPath}`;

    return axios.get(url);
}

function updateSituacaoInDatabase(clienteKey, situacao, cliente) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const url = `${databaseURL}/Advogado/${cliente.NomeAdvogado}/${clienteKey}/situacao.json`;

    return axios.put(url, situacao);
}

const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

function getClientData(logAdv, clienteKey) {
    const collectionPath = `Advogado/${logAdv.OAB}/${clienteKey}.json`;
    return axios.get(`${databaseURL}/${collectionPath}`);
}

function archiveClientData(logAdv, clienteKey, clienteData) {
    const archivePath = `Arquivados/${clienteKey}.json`;
    const collectionPath = `Advogado/${logAdv.OAB}/${clienteKey}.json`;
    
    return axios.put(`${databaseURL}/${archivePath}`, clienteData)
        .then(() => axios.delete(`${databaseURL}/${collectionPath}`));
}

function updateClientDetails(logAdv, clienteKey, updatedDetails) {
    const collectionPath = `Advogado/${logAdv.OAB}/${clienteKey}.json`;
    return axios.patch(`${databaseURL}/${collectionPath}`, updatedDetails);
}

function getAllClients(logAdv) {
    const collectionPath = `Advogado/${logAdv.OAB}.json`;
    return axios.get(`${databaseURL}/${collectionPath}`);
}

function uploadPDF(pdfFile) {
    const storage = firebase.storage();
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${pdfFile.name}`;
    const storageRef = storage.ref(`pdfs/${fileName}`);

    return storageRef.put(pdfFile)
        .then(snapshot => snapshot.ref.getDownloadURL());
}


module.exports = { fetchClientes, updateSituacaoInDatabase, getClientData, archiveClientData, updateClientDetails, getAllClients, uploadPDF};