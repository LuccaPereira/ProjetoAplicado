import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js';
// import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.esm.min.js';

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
    const collectionPath = "Arquivados";
    const url = `${databaseURL}/${collectionPath}.json`;

    return axios.get(url);
}