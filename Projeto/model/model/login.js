export function getLawyerByOAB(OAB) {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}/${OAB}.json`;

    return axios.get(url);
}