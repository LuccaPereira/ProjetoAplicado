document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.querySelector('.messages');

    let nomeCliente = "";
    let cpfCnpjCliente = "";
    let enderecoCliente = "";
    let profissaoCliente = "";
    let estadoCivil = "";
    let dataOcorrido = "";
    let cidadePeticao = "";
    let justiçaGratuita = "";
    let nomeReu = "";
    let cpfCnpjReu = "";
    let enderecoReu = "";
    let tipoAcao = "";
    let motivoAcao = "";
    let pedidosAutor = "";
    let outrasInformacoes = "";
    let etapa = 0;

    appendMessage('bot', 'Olá! Vamos começar a gerar sua petição. Por favor, informe o nome do cliente.');

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            appendMessage('user', message);
            processUserInput(message);
            chatInput.value = '';
        }
    }

    function normalizeString(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    
    function processUserInput(message) {
        const normalizedMessage = normalizeString(message);
        switch (etapa) {
            case 0:
                nomeCliente = message;
                appendMessage('bot', `Ótimo, o nome do cliente é ${nomeCliente}. Agora, por favor, informe o CPF ou CNPJ do cliente.`);
                etapa++;
                break;
            case 1:
                cpfCnpjCliente = message;
                appendMessage('bot', `Entendido. O CPF/CNPJ do cliente é ${cpfCnpjCliente}. Qual é o endereço completo do cliente?`);
                etapa++;
                break;
            case 2:
                enderecoCliente = message;
                appendMessage('bot', `Ótimo, o endereço do cliente é ${enderecoCliente}. Qual é a profissão do cliente?`);
                etapa++;
                break;
            case 3:
                profissaoCliente = message;
                appendMessage('bot', `Entendido. A profissão do cliente é ${profissaoCliente}. Qual é o estado civil do cliente?`);
                etapa++;
                break;
            case 4:
                estadoCivil = message;
                appendMessage('bot', `Obrigado. O estado civil do cliente é ${estadoCivil}. Agora, qual é a data em que ocorreu o evento que gerou a petição? (Formato: DD/MM/AAAA)`);
                etapa++;
                break;
            case 5:
                dataOcorrido = message;
                appendMessage('bot', `Entendido. A data do ocorrido é ${dataOcorrido}. Em qual cidade a petição será ajuizada?`);
                etapa++;
                break;
            case 6:
                cidadePeticao = message;
                appendMessage('bot', `Ótimo, a cidade onde a petição será ajuizada é ${cidadePeticao}. Você deseja solicitar justiça gratuita? (sim/não)`);
                etapa++;
                break;
            case 7:
                justiçaGratuita = message.toLowerCase();
                appendMessage('bot', `Entendido, solicitação de justiça gratuita: ${justiçaGratuita}. Agora, informe o nome do réu.`);
                etapa++;
                break;
            case 8:
                nomeReu = message;
                appendMessage('bot', `Obrigado. O nome do réu é ${nomeReu}. Qual é o CPF ou CNPJ do réu?`);
                etapa++;
                break;
            case 9:
                cpfCnpjReu = message;
                appendMessage('bot', `Entendido. O CPF/CNPJ do réu é ${cpfCnpjReu}. Qual é o endereço completo do réu?`);
                etapa++;
                break;
            case 10:
                enderecoReu = message;
                appendMessage('bot', `Ótimo, o endereço do réu é ${enderecoReu}. Qual é o tipo de ação? Exemplo: Cobrança, Danos Morais, Rescisão Contratual, etc.`);
                etapa++;
                break;
            case 11:
                tipoAcao = normalizedMessage;
                switch (tipoAcao) {
                    case 'cobranca':
                        appendMessage('bot', 'Entendido, será uma ação de cobrança. Por favor, descreva a causa da cobrança (Ex.: não pagamento de dívida).');
                        break;
                    case 'danos morais':
                        appendMessage('bot', 'Entendido, será uma ação de danos morais. Por favor, descreva o ocorrido que gerou o dano moral (Ex.: difamação, constrangimento).');
                        break;
                    case 'rescisao contratual':
                        appendMessage('bot', 'Entendido, será uma ação de rescisão contratual. Por favor, descreva a razão para a rescisão do contrato (Ex.: quebra de cláusula, inadimplência).');
                        break;
                    default:
                        appendMessage('bot', 'Por favor, descreva o motivo para essa ação.');
                }
                etapa++;
                break;
            case 12:
                motivoAcao = message;
                switch (tipoAcao) {
                    case 'cobranca':
                        appendMessage('bot', 'Agora, indique o valor que o autor deseja cobrar do réu e outros pedidos, se houver.');
                        break;
                    case 'danos morais':
                        appendMessage('bot', 'Agora, especifique a indenização por danos morais que o autor deseja solicitar.');
                        break;
                    case 'rescisao contratual':
                        appendMessage('bot', 'Agora, indique quais são os pedidos em relação à rescisão (Ex.: devolução de valores pagos, cancelamento de obrigações contratuais).');
                        break;
                    default:
                        appendMessage('bot', 'Agora, descreva os pedidos do autor.');
                }
                etapa++;
                break;
            case 13:
                pedidosAutor = message;
                appendMessage('bot', 'Por fim, há mais alguma informação adicional que deseja incluir na petição?');
                etapa++;
                break;
            case 14:
                outrasInformacoes = message;
                appendMessage('bot', 'Obrigado! Estou gerando a petição inicial com as informações fornecidas.');
                generatePetition();
                break;
        }
    }

    async function generatePetition() {
        try {
            const response = await fetch('http://localhost:3000/generate-petition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nomeCliente, cpfCnpjCliente, enderecoCliente, profissaoCliente, estadoCivil,
        dataOcorrido, cidadePeticao, justiçaGratuita,
        nomeReu, cpfCnpjReu, enderecoReu, tipoAcao, motivoAcao,
        pedidosAutor, outrasInformacoes
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate petition');
            }

            const data = await response.json();
            appendMessage('bot', data.petition);
        } catch (error) {
            console.error('Error generating petition:', error);
            appendMessage('bot', 'Houve um erro ao gerar a petição. Por favor, tente novamente.');
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        messageElement.innerText = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});
