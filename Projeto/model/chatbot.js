document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const messagesDiv = document.querySelector('.messages');

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value;
        if (message.trim() !== '') {
            const userMessage = document.createElement('div');
            userMessage.textContent = message;
            userMessage.className = 'user-message';
            messagesDiv.appendChild(userMessage);

            // Simulating chatbot response
            const botMessage = document.createElement('div');
            botMessage.textContent = 'Resposta do chatbot para: ' + message;
            botMessage.className = 'bot-message';
            messagesDiv.appendChild(botMessage);

            chatInput.value = '';
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }
});
