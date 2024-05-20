// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

function redefinirSenha() {
    var emailRedefinir = document.getElementById('emailDeRedefinir').value;
    var redifinirOab = document.getElementById('redefinirOab').value;

    const collectionPath = "Advogado";
    var campoAtualizar = "senha";

    const url = `${collectionPath}/${redifinirOab}/${campoAtualizar}`;

    set(ref(database, url), emailRedefinir)
        .then(() => {
            console.log(`Campo '${campoAtualizar}' atualizado com sucesso para '${emailRedefinir}'.`);
        })
        .catch((error) => {
            console.error(`Erro ao atualizar campo '${campoAtualizar}' no banco de dados:`, error);
        });
}
