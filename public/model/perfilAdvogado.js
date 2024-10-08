//import axios from 'axios';

const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";

export function getLoggedInLawyer() {
    const loggedInLawyerString = localStorage.getItem('loggedInLawyer');
    return loggedInLawyerString ? JSON.parse(loggedInLawyerString) : null;
}

export function updateProfileInDatabase(oab, profileData) {
    const collectionPath = `Advogado`;
    const url = `${databaseURL}/${collectionPath}/${oab}/PerfilAdvogado.json`;

    return axios.patch(url, profileData);
}

export function updateLocalStorage(profileData) {
    localStorage.setItem('loggedInLawyer', JSON.stringify(profileData));
}
