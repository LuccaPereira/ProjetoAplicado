const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const cors = require('cors');
const http = require('http'); // Para o Socket.IO
const { Server } = require('socket.io'); // Para o Socket.IO

dotenv.config();
const app = express();
const server = http.createServer(app); // Criando servidor HTTP
const io = new Server(server); // Inicializando o Socket.IO com o servidor HTTP
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.static(path.join(__dirname, '../public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/View/PaginaInicial.html'));
});

// Rota para a página de chat
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/View/chat.html'));
});

// Rota para geração de petições
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
        - OAB/SP *Número*

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

// Integração do Socket.IO para chat
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('sendMessage', async (message) => {
        console.log('Mensagem recebida:', message);

        // Função para verificar se a mensagem é jurídica
        const isLegalQuestion = (msg) => {
            const legalKeywords = [
                'jurídico', 'juridico', 'direito', 'lei', 'processo', 
                'petição', 'peticao', 'contrato', 'advogado', 'jurisprudência', 
                'jurisprudencia', 'processual', 'litígio', 'litigio', 'causa', 
                'dano', 'responsabilidade', 'contratual', 'tutela', 'nulo', 
                'nulidade', 'recurso', 'apelação', 'apelacao', 'justiça', 
                'justica', 'ação', 'acao', 'sentença', 'sentenca', 
                'cível', 'civil', 'penal', 'família', 'familia', 
                'herança', 'heranca', 'testamento', 'patente', 
                'propriedade', 'títulos', 'titulos', 'mandato', 
                'cláusula', 'clausula', 'obrigação', 'obrigacao', 
                'direitos', 'deveres', 'advocacia', 'disputa', 
                'transação', 'transacao', 'conciliação', 'conciliacao', 
                'mediação', 'mediacao', 'jurisdição', 'jurisdicao', 
                'decisão', 'decisao', 'código', 'codigo', 
                'fundo', 'convenção', 'convecao', 'inquérito', 
                'inquerito', 'investigação', 'investigacao', 
                'contraparte', 'defesa', 'acusação', 'acusacao', 
                'obrigacional', 'exceção', 'excecao', 'prescrição', 
                'prescricao', 'dolo', 'validade', 'capacidade', 
                'incapacidade', 'dever', 'garantia', 'patrimônio', 
                'patrimonio', 'serviço', 'servico', 'público', 
                'publico', 'tutela', 'direito civil', 'direito penal', 
                'direito tributário', 'direito tributario', 
                'direito ambiental', 'código civil', 'codigo civil', 
                'código penal', 'codigo penal', 'jurisprudência', 
                'jurisprudencia', 'cláusulas', 'clausulas', 
                'princípios', 'principios', 'compromisso', 
                'execução', 'execucao', 'demandante', 'demanda', 
                'norma', 'regulamento', 'solicitação', 'solicitacao', 
                'protocolo', 'transação', 'transacao', 'fórum', 
                'forum', 'ato', 'jurídica', 'juridica', 
                'responsável', 'responsavel', 'cláusula', 
                'clausula', 'obrigatória', 'obrigatoria', 
                'direitos humanos', 'constituição', 'constitucao', 
                'decreto', 'lei complementar', 'regimento', 
                'sentença', 'sentenca', 'contrato social', 
                'fundo de garantia', 'divida', 'dívida', 
                'execução fiscal', 'cobranca', 'cobrança', 
                'ação civil', 'acao civil', 'ação popular', 
                'acao popular', 'ação direta', 'acao direta', 
                'execução de sentença', 'execucao de sentenca'
            ];

            // Normalizar a mensagem para remover acentos e ç
            const normalizedMsg = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ç/g, 'c');

            return legalKeywords.some(keyword => normalizedMsg.includes(keyword));
        };

        if (!isLegalQuestion(message)) {
            // Se a mensagem não for jurídica, responda com a mensagem padrão
            socket.emit('receiveMessage', 'Esta mensagem não contém nenhuma pergunta jurídica, portanto não posso respondê-la.');
            return;
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(message);
            const responseText = await result.response.text();

            // Enviar a resposta de volta ao cliente
            socket.emit('receiveMessage', responseText);
        } catch (error) {
            console.error('Erro ao gerar resposta:', error);
            socket.emit('receiveMessage', 'Desculpe, houve um erro ao processar sua mensagem.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('API Key:', process.env.API_KEY);
});