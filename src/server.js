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
Escreva uma petição inicial com as seguintes seções e informações:
Siga o exemplo desse site: https://juridico.ai/juridico/modelo-peticao-inicial/
Por favor no tópico qualificacao das partes relacione o que o autor está propondo de açao contra o Réu.
Por favor preencha com no minimo 7 linhas cada seçao.

**1. Qualificação das Partes**
Por favor faça a qualificação das partes relacionando o Autor e o Réu.
- Nome do cliente: ${nomeCliente}, CPF/CNPJ: ${cpfCnpjCliente}, Endereço: ${enderecoCliente}, Profissão: ${profissaoCliente}, Estado Civil: ${estadoCivil}.
- Nome do réu: ${nomeReu}, CPF/CNPJ: ${cpfCnpjReu}, Endereço: ${enderecoReu}.
- Cite qual a Açao

**2. Dos Fatos**
Descreva o ocorrido com base nas seguintes informações:
- Data do fato: ${dataOcorrido}.
- Motivo da ação: ${motivoAcao}.
- Deixe claro o motivo da açao

**3. Do Direito**
Baseie a argumentação legal nos artigos aplicáveis conforme o tipo de ação:
- Para ação de cobrança: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm).
- Para ação de danos morais: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm).
- Para ação de rescisão contratual: [Código Civil](https://www.planalto.gov.br/ccivil_03/Leis/2002/L10406compilada.htm) e [Código de Processo Civil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/L13105compilada.htm).

**4. Dos Pedidos**
Por favor aqui elenque em a), b) e assim por diante
Especifique os pedidos do autor:
- Pedidos: ${pedidosAutor}.
- Solicitação de justiça gratuita: ${justiçaGratuita}.
- Outras informações adicionais: ${outrasInformacoes}.

**5. Finalização**
Termos em que,
Pede Deferimento.

_____________________.
ADV. - OAB/SP Número
CAMPINAS, SÃO PAULO, [Data].




Não inclua fatos além dos mencionados e mantenha a estrutura conforme solicitado.
Não inclua **EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA **[VARA]** **DA COMARCA DE CAMPINAS/SP** na peticao por favor.
`;

        // Gerar o conteúdo com a API da IA
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        // Dividir o texto nas seções, removendo os títulos
        const [qualificacaoPartes, dosFatos, doDireito, dosPedidos, finalizacao] = responseText.split(/(?=\*\*[1-5]\.\s)/);

        // Remover os títulos de cada seção, mantendo apenas o conteúdo
        const cleanQualificacaoPartes = qualificacaoPartes.replace(/\*\*[1-5]\.\s.*/, '').trim();
        const cleanDosFatos = dosFatos.replace(/\*\*[1-5]\.\s.*/, '').trim();
        const cleanDoDireito = doDireito.replace(/\*\*[1-5]\.\s.*/, '').trim();
        const cleanDosPedidos = dosPedidos.replace(/\*\*[1-5]\.\s.*/, '').trim();
        const cleanFinalizacao = finalizacao.replace(/\*\*[1-5]\.\s.*/, '').trim();

        // Configuração do documento DOCX com formatação para cada parágrafo
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [new TextRun({ 
                                text: `Excelentíssimo Senhor Doutor Juiz de Direito da __ª Vara Cível da Comarca de ${cidadePeticao}.`, 
                                font: 'Arial', 
                                size: 28, 
                                bold: true  // Tornar o texto em negrito
                            })],
                            alignment: 'both',  // Justificar o texto
                            spacing: { before: 0, after: 0, line: 276 },  // Espaçamento zero antes e depois, e espaçamento múltiplo de 1,1
                            indent: { firstLine: 0 },  // Sem avanço na primeira linha
                        }),

                        // Espaço de 6 linhas antes do próximo parágrafo
                        new Paragraph({
                            children: [],  // Parágrafo vazio para criar o espaçamento
                            spacing: { before: 1500 },  // Aproximadamente 6 linhas de espaçamento (ajuste conforme necessário)
                        }),

                        // Seção Qualificação das Partes
                        new Paragraph({
                            children: [new TextRun({ text: '', font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 }, // Avanço de 4,25 cm
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cleanQualificacaoPartes, font: 'Arial', size: 28 })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),

                        // Seção Dos Fatos
                        new Paragraph({
                            children: [new TextRun({ text: 'Dos Fatos', font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cleanDosFatos, font: 'Arial', size: 28 })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),

                        // Seção Do Direito
                        new Paragraph({
                            children: [new TextRun({ text: 'Do Direito', font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cleanDoDireito, font: 'Arial', size: 28 })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),

                        // Seção Dos Pedidos
                        new Paragraph({
                            children: [new TextRun({ text: 'Dos Pedidos', font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cleanDosPedidos, font: 'Arial', size: 28 })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),

                        // Seção de Finalização (Assinatura do Advogado)
                        new Paragraph({
                            children: [new TextRun({ text: '', font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),
                        new Paragraph({
                            children: [new TextRun({ text: cleanFinalizacao, font: 'Arial', size: 28, bold: true })],
                            alignment: 'both',
                            spacing: { before: 120, after: 0, line: 276 }, // Ajuste para espaçamento múltiplo 1,1
                            indent: { firstLine: 2409 },
                        }),
                    ],
                },
            ],
        });

        // Gerar e enviar o arquivo DOCX como resposta
        const buffer = await Packer.toBuffer(doc);
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