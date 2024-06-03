document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.querySelector('.messages');
    let nomeCliente = "";
    let nomeReu = "";
    let causaPedir = "";
    let pedidosAutor = "";
    let outrasInformacoes = "";
    let isFirstMessage = true;

    // Mensagem de boas-vindas
    appendMessage('bot', 'Olá, bem-vindo ao chat gerador de petições! Para começar, por favor, informe o nome do cliente.');

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value;
        appendMessage('user', message);
        processUserInput(message);
        chatInput.value = '';
    }

    function processUserInput(message) {
        if (isFirstMessage) {
            nomeCliente = message;
            appendMessage('bot', `Ótimo! O nome do cliente é ${nomeCliente}. Agora, por favor, informe o nome completo do réu.`);
            isFirstMessage = false;
        } else if (nomeReu === "") {
            nomeReu = message;
            appendMessage('bot', `Perfeito! O réu será ${nomeReu}. Agora, me diga qual é a causa de pedir.`);
        } else if (causaPedir === "") {
            causaPedir = message;
            appendMessage('bot', `Entendi! A causa de pedir é ${causaPedir}. Agora, quais são os pedidos do autor?`);
        } else if (pedidosAutor === "") {
            pedidosAutor = message;
            appendMessage('bot', `Por fim, há alguma informação adicional que deseja incluir na petição inicial?`);
        } else {
            outrasInformacoes = message;
            appendMessage('bot', `Obrigado por fornecer as informações. Estou gerando a petição inicial para você.`);
            generatePetition();
        }
    }

    function generatePetition() {
        const petition = `
            EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE [CIDADE] – [ESTADO]

            ${nomeCliente}, brasileiro(a), estado civil, profissão, portador(a) da Cédula de Identidade RG nº [número], inscrito(a) no CPF/MF sob o nº [número], residente e domiciliado(a) na [endereço completo], por seu advogado que esta subscreve (mandato incluso – doc. 01), com escritório profissional na [endereço do advogado], onde recebe intimações, vem respeitosamente à presença de Vossa Excelência propor a presente

            AÇÃO DE COBRANÇA

            em face de ${nomeReu}, brasileiro(a), estado civil, profissão, portador(a) da Cédula de Identidade RG nº [número], inscrito(a) no CPF/MF sob o nº [número], residente e domiciliado(a) na [endereço completo], pelos fatos e fundamentos a seguir expostos:

            I - DOS FATOS

            1. O Autor celebrou com o Réu um contrato de ${causaPedir}, em [data], cujo objeto era [descrever o objeto do contrato].
            2. O valor pactuado para tal contrato foi de R$ [valor], conforme o documento em anexo (doc. 02).
            3. O Réu, entretanto, deixou de cumprir com sua obrigação de pagamento, estando inadimplente desde [data].
            4. Foram realizadas diversas tentativas amigáveis de cobrança, conforme se comprova pelos documentos em anexo (docs. 03 a 05), mas sem êxito.

            II - DO DIREITO

            5. O artigo 389 do Código Civil Brasileiro dispõe que o devedor que não cumpre a obrigação fica obrigado a pagar perdas e danos, mais juros e correção monetária, além de honorários advocatícios.
            6. A mora do Réu é evidente e o Autor faz jus ao recebimento da quantia inadimplida, acrescida dos encargos legais, conforme preceitua o artigo 394 do Código Civil.

            III - DOS PEDIDOS

            ${pedidosAutor}

            IV - DAS OUTRAS INFORMAÇÕES

            ${outrasInformacoes}

            V - DOS REQUERIMENTOS

            a) A citação do Réu para, querendo, apresentar defesa no prazo legal, sob pena de revelia e confissão quanto à matéria de fato;
            b) A total procedência da ação, condenando o Réu ao pagamento de R$ [valor devido], acrescidos de juros, correção monetária e honorários advocatícios, conforme legislação vigente;
            c) A produção de todos os meios de prova admitidos em direito, em especial a documental, testemunhal e pericial, se necessário;
            d) A condenação do Réu ao pagamento das custas processuais e honorários advocatícios na base de [porcentagem]%.

            Nestes termos, pede deferimento.

            [Cidade], [data].

            _____________________________________
            [Nome do Advogado]
            OAB [número da OAB]
            [Endereço do Advogado]
            [Telefone/Email]
        `;
        appendMessage('bot', petition);
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        messageElement.innerText = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});
