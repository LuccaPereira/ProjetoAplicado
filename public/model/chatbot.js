/*
import bodyParser from '../../node_modules/@types/body-parser/index';
import { GoogleGenerativeAI } from '../../node_modules/@google/generative-ai/dist/generative-ai';
import dotenv from '../../node_modules/dotenv/lib/main';
*/
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Rota para gerar a petição com base nos dados do usuário
app.post('/generate-petition', async (req, res) => {
    const {
        nomeCliente, cpfCnpjCliente, enderecoCliente, profissaoCliente, estadoCivil,
        dataOcorrido, cidadePeticao, justiçaGratuita,
        nomeReu, cpfCnpjReu, enderecoReu, tipoAcao, motivoAcao,
        pedidosAutor, outrasInformacoes
    } = req.body;

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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('API Key:', process.env.API_KEY);
});