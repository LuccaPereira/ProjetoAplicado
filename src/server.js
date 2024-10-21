const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
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

    console.log('Received request:', { nomeCliente, cpfCnpjCliente, enderecoCliente, profissaoCliente, estadoCivil,
        dataOcorrido, cidadePeticao, justiçaGratuita,
        nomeReu, cpfCnpjReu, enderecoReu, tipoAcao, motivoAcao,
        pedidosAutor, outrasInformacoes });

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
        Escreva uma petição inicial com as seguintes informações:

        - Nome do cliente: ${nomeCliente}, CPF/CNPJ: ${cpfCnpjCliente}, Endereço: ${enderecoCliente}, Profissão: ${profissaoCliente}, Estado Civil: ${estadoCivil}
        - Nome do réu: ${nomeReu}, CPF/CNPJ: ${cpfCnpjReu}, Endereço: ${enderecoReu}
        - Tipo de ação: ${tipoAcao}
        - Motivo da ação: ${motivoAcao}, se for ação de cobrança aplique: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
        se for ação de danos morais aplique: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
        se for ação de rescisão contratual, aplique: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm)
        - Pedidos do autor: ${pedidosAutor}
        - Data do fato: ${dataOcorrido}
        - Cidade onde a petição será ajuizada: ${cidadePeticao}
        - Solicitação de justiça gratuita: ${justiçaGratuita}
        - Informações adicionais: ${outrasInformacoes}

        Ao final da petição, inclua:
        - **CAMPINAS, SÃO PAULO, **[Data]**.
        - **ASSINATURA DO ADVOGADO**
        -   OAB/SP *Número*

        Não inclua fatos além dos mencionados.
        `;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        

        // Criar um novo documento
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: responseText,
                                    font: 'Arial', // Definindo a fonte como Arial
                                    size: 28, // 14pt
                                }),
                            ],
                            alignment: 'both', // Justificado
                            spacing: {
                                before: 240, // 6 pontos antes (6*12)
                                after: 0,
                                line: 360, // 1.5 linhas (1.5*240)
                            },
                            indent: {
                                firstLine: 425, // 4.25 cm (4.25*20)
                            },
                        }),
                    ],
                },
            ],
        });

        // Gerar o arquivo DOCX
        const buffer = await Packer.toBuffer(doc);

        // Definir cabeçalho e enviar o arquivo para download
        res.setHeader('Content-Disposition', 'attachment; filename=peticao.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating petition:', error);
        res.status(500).send('Error generating petition');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('API Key:', process.env.API_KEY);
});