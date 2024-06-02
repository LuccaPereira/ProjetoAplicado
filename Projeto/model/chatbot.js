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

    function isExampleCase() {
        return (
            nomeCliente.toLowerCase() === "joão da Silva" &&
            nomeReu.toLowerCase() === "Empresa XYZ" &&
            causaPedir.toLowerCase() === "rescisão indireta do contrato de trabalho" &&
            pedidosAutor.toLowerCase() === "reintegração no emprego e pagamento de todas as verbas rescisórias devidas" &&
            outrasInformacoes.toLowerCase() === "nenhuma"
        );
    }

    function generatePetition() {
        const petition = `
            --- 
            **Petição Inicial**

            Eu, advogado de ${nomeCliente}, brasileiro, ..., vêm, respeitosamente, perante Vossa Excelência, propor a presente

            **AÇÃO DE REINTEGRAÇÃO DE EMPREGO**

            em face de ${nomeReu}, pessoa jurídica de direito privado, ..., pelas razões de fato e de direito que passa a expor:

            **I – Dos Fatos**

            ...

            **II – Do Direito**

            ...

            **III – Dos Pedidos**

            ...

            **IV – Das Outras Informações**

            ${outrasInformacoes}

            **V – Dos Requerimentos**

            ...

            Nestes termos, pede deferimento.

            Local, data.

            Advogado

            **OAB nº XXXXX**

            --- 
        `;
        appendMessage('bot', petition);
    }

    function generateCustomPetition() {
        // Implemente a lógica para gerar a petição personalizada aqui
        appendMessage('bot', 'A petição personalizada está sendo gerada...');
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        messageElement.innerText = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});