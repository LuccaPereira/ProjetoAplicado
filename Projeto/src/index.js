import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importar fileURLToPath
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './model/firebaseConfig.js';
import routes from '../routes/index.js';

// Obtendo o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Inicialize o Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Configuração do Express
app.use(express.static(path.join(__dirname, '../public')));

// Configuração das rotas
app.use('/', routes);

// Rota principal para servir o login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/View/login.html'));
});

// Exporte a instância do app
export default app;

// O código para iniciar o servidor não deve estar aqui para testes
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}
