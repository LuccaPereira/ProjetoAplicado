// index.js
const express = require('express');
const path = require('path');
const firebase = require('firebase/app');
require('firebase/auth'); 
require('firebase/firestore');
const { firebaseConfig } = require('./model/firebaseConfig'); 

const app = express();
const port = process.env.PORT || 3000; 
// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Configuração do Express
app.use(express.static(path.join(__dirname, 'public')));

// Configuração das rotas
const routes = require('./routes');
app.use('/', routes);

// Rota principal para servir o login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/View/login.html'));
});

// Iniciar o servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

module.exports = app;
