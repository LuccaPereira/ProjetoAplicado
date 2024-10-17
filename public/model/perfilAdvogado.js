//import axios from 'axios';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, update } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
// Configuração do Firebase (certifique-se de que está definido)
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

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Inicializa o banco de dados

const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

export function getLoggedInLawyer() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    return loggedInLawyerString ? JSON.parse(loggedInLawyerString) : null;
}

export function updateProfileInDatabase(uid, profileData) {
    const db = getDatabase();
    const lawyerRef = ref(db, 'Advogado/' + uid + '/PerfilAdvogado'); // Atualizando dentro de Advogado > uid > PerfilAdvogado

    return update(lawyerRef, profileData);
}
export function updateLocalStorage(profileData) {
    localStorage.setItem('loggedInLawyer', JSON.stringify(profileData));
}

export function getLoggedInLawyerEmail() {
    const loggedInLawyer = getLoggedInLawyer(); // Obtenha os dados do advogado logado

    if (loggedInLawyer && loggedInLawyer.email) {
        return loggedInLawyer.email; // Retorne o e-mail
    }
    return null; // Retorne null se não encontrar
}
