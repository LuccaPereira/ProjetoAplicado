const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
const port = 3000;


app.use(bodyParser.json());


const genAI = new GoogleGenerativeAI(process.env.API_KEY);


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/View/PaginaInicial.html'));
});

app.post('/generate-petition', async (req, res) => {
  const {
      nomeCliente, cpfCnpjCliente, enderecoCliente, profissaoCliente, estadoCivil,
      dataOcorrido, cidadePeticao, justiçaGratuita,
      nomeReu, cpfCnpjReu, enderecoReu, tipoAcao, motivoAcao,
      pedidosAutor, outrasInformacoes
  } = req.body;

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
    - Motivo da ação: ${motivoAcao}, se for açao de cobrança aplique:[Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
    se for açao de danos morais aplique: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
    se for açao de rescisáo contratual, aplique: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
    - Pedidos do autor: ${pedidosAutor}
    - Data do fato: ${dataOcorrido}
    - Cidade onde a petição será ajuizada: ${cidadePeticao}
    - Solicitação de justiça gratuita: ${justiçaGratuita}
    - Informações adicionais: ${outrasInformacoes}

    Ao final da petiçao, inclua:
    - **CAMPINAS, SÃO PAULO, **[Data]**.
    - **ASSINATURA DO ADVOGADO**
    -   OAB/SP *Número*
    
    Nao inclua fatos além dos mencionados.
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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('API Key:', process.env.API_KEY);
});
