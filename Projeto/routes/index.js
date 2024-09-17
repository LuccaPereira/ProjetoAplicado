const express = require('express');
const router = express.Router();
const path = require('path');

// Rota para a página inicial
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/View/login.html')); // Corrigido o caminho
});

module.exports = router;