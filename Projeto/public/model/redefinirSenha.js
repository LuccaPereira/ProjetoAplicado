// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Adicione SDKs para produtos Firebase que você deseja usar
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuração do Firebase para o seu aplicativo web
// Para Firebase JS SDK v7.20.0 e posteriores, measurementId é opcional
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
const analytics = getAnalytics(app); // Inicializa o Analytics, se necessário
const database = getDatabase(app); // Inicializa o Realtime Database

// Função para redefinir a senha do advogado
function redefinirSenha() {
    var emailRedefinir = document.getElementById('emailDeRedefinir').value; // Obtém o email do campo de entrada
    var redifinirOab = document.getElementById('redefinirOab').value; // Obtém o número da OAB do campo de entrada

    const collectionPath = "Advogado"; // Define o caminho da coleção no banco de dados
    var campoAtualizar = "senha"; // Define o campo que será atualizado

    const url = `${collectionPath}/${redifinirOab}/${campoAtualizar}`; // Constrói a URL do campo a ser atualizado no banco de dados

    // Atualiza o campo de senha no banco de dados
    set(ref(database, url), emailRedefinir)
        .then(() => {
            console.log(`Campo '${campoAtualizar}' atualizado com sucesso para '${emailRedefinir}'.`);
        })
        .catch((error) => {
            console.error(`Erro ao atualizar campo '${campoAtualizar}' no banco de dados:`, error);
        });
}
