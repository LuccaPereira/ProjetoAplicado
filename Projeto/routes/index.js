import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importar fileURLToPath

// Obtendo o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/View/login.html')); // Corrigido o caminho
});

export default router;
//git
