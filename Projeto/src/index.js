import express from 'express';
import path from 'path';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from '../public/model/firebaseConfig'; // Ajuste o caminho se necessário

const app = express();
const port = process.env.PORT || 3000;

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Configuração do Express
app.use(express.static(path.join(__dirname, '../public')));

// Configuração das rotas
import routes from '../routes';
app.use('/', routes);

// Rota principal para servir o login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/view/login.html'));
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

export default app;
