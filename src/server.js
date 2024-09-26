const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(bodyParser.json());

// Instanciar a API do Google Generative AI com a chave da API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/View/login.html'));
});

app.post('/generate-petition', async (req, res) => {
  const {
      nomeCliente, cpfCnpjCliente, enderecoCliente, profissaoCliente, estadoCivil,
      dataOcorrido, cidadePeticao, justiçaGratuita,
      nomeReu, cpfCnpjReu, enderecoReu, tipoAcao, motivoAcao,
      pedidosAutor, outrasInformacoes
  } = req.body;

  // Validação dos dados recebidos
  if (!nomeCliente || !cpfCnpjCliente || !nomeReu || !motivoAcao) {
      return res.status(400).send('Dados insuficientes para gerar a petição.');
  }

  console.log('Received request:', { nomeCliente, nomeReu, motivoAcao, pedidosAutor, outrasInformacoes });

  try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `
      Escreva uma petição inicial com as seguintes informações:
      - Nome do cliente: ${nomeCliente}, CPF/CNPJ: ${cpfCnpjCliente}, Endereço: ${enderecoCliente}, Profissão: ${profissaoCliente}, Estado Civil: ${estadoCivil}
      - Nome do réu: ${nomeReu}, CPF/CNPJ: ${cpfCnpjReu}, Endereço: ${enderecoReu}
      - Tipo de ação: ${tipoAcao}
      - Motivo da ação: ${motivoAcao}
      - Pedidos do autor: ${pedidosAutor}
      - Data do fato: ${dataOcorrido}
      - Cidade onde a petição será ajuizada: ${cidadePeticao}
      - Solicitação de justiça gratuita: ${justiçaGratuita}
      - Informações adicionais: ${outrasInformacoes}
      `;

      console.log('Prompt:', prompt);

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      console.log('Response text:', responseText);

      res.json({ petition: responseText });
  } catch (error) {
      console.error('Error generating petition:', error);
      res.status(500).send('Error generating petition');
  }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('API Key:', process.env.API_KEY);
});
