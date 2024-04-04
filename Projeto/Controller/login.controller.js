function getLawyers() {
    const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
    const collectionPath = "Advogado";
    const url = `${databaseURL}/${collectionPath}.json`;

    axios.get(url)
        .then(response => {
            const lawyers = response.data;
            console.log("Advogados:", lawyers);
        })
        .catch(error => {
            console.error("Erro ao obter advogados:", error);
        });
}

getLawyers();
