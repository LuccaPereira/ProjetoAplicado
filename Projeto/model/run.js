const express = require('express');
const path = require('path');
const app = express();

// Define o diretório onde estão os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'Projeto')));

// Rota para servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Projeto', 'login.html'));
});

// Define a porta onde o servidor vai escutar
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});