const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Redirecionar para 'login.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/View/login.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
