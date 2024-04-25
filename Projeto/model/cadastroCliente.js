import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";

function submitClientes(event){
    event.preventDefault();

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

    var form = document.getElementById("clienteForm");

    if (form.checkValidity()) {
        const cliente = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
        };

        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);
        const pdfFile = document.getElementById("pdfFile").files[0];
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${pdfFile.name}`;
        const storageRef = ref(storage, `pdfs/${fileName}`);

        uploadBytes(storageRef, pdfFile)
            .then((snapshot) => getDownloadURL(snapshot.ref))
            .then((downloadURL) => {
                cliente.pdfURL = downloadURL;

                const databaseURL = "https://projetoaplicado-1-default-rtdb.firebaseio.com/";
                const collectionPath = "Cliente";
                const url = `${databaseURL}/${collectionPath}.json`;

                return axios.post(url, cliente);
            })
            .then((response) => {
                alert("Novo cliente foi adicionado com sucesso!", response.data.nome);
                //form.reset();
            })
            .catch((error) => {
                alert("Erro ao adicionar novo cliente: " + error.message);
            });
    }
}
