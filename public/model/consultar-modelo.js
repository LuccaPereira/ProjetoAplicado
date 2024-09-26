import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';
//import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.esm.min.js';

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

export function archiveClient(clienteKey) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const collectionPath = `Advogado/${logAdv.OAB}/${clienteKey}.json`;
    const archivePath = `Arquivados/${clienteKey}.json`;

    return axios.get(`${databaseURL}/${collectionPath}`)
        .then(response => {
            const clienteData = response.data;

            return axios.put(`${databaseURL}/${archivePath}`, clienteData)
                .then(() => axios.delete(`${databaseURL}/${collectionPath}`));
        });
}

export function updateSituacaoInDatabase(clienteKeyAtt, selectedValue) {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    const logAdv = JSON.parse(loggedInLawyerString);
    const urlAtt = `${databaseURL}/Advogado/${logAdv.OAB}/${clienteKeyAtt}.json`;

    const updatedDetails = { situacao: selectedValue };

    return axios.patch(urlAtt, updatedDetails);
}

export function saveClientDetails(urlAtt, updatedClientData, pdfFile) {
    if (pdfFile) {
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFile.name}`;
        const storageRef = storage.ref(`pdfs/${fileName}`);

        return storageRef.put(pdfFile)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(downloadURL => {
                updatedClientData.pdfURL = downloadURL;
                return axios.patch(urlAtt, updatedClientData); 
            });
    } else {
        return axios.patch(urlAtt, updatedClientData); 
    }
}
