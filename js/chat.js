// Función para inicializar el chat
document.addEventListener('DOMContentLoaded', function() {
    // Crear elementos del chat
    createChatElements();
    
    // Añadir evento de clic al botón de chat
    const chatBubble = document.getElementById('chatBubble');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // Manejo de eventos
    chatBubble.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatForm.addEventListener('submit', handleChatSubmit);
    chatInput.addEventListener('input', function() {
        chatSend.disabled = !chatInput.value.trim();
    });
    
    // Mostrar mensaje de bienvenida después de un breve retraso
    setTimeout(() => {
        addMessage('¡Hola! Soy ZetAI, tu asistente virtual. ¿En qué puedo ayudarte hoy?', 'bot', 'welcome-message');
    }, 500);
});

// Función para crear los elementos del chat
function createChatElements() {
    // Crear la burbuja de chat
    const chatBubble = document.createElement('div');
    chatBubble.id = 'chatBubble';
    chatBubble.className = 'chat-bubble';
    chatBubble.innerHTML = '<i class="fas fa-comment-alt"></i>';
    document.body.appendChild(chatBubble);
    
    // Crear el contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatContainer';
    chatContainer.className = 'chat-container';
    
    // Añadir contenido HTML al contenedor
    chatContainer.innerHTML = `
        <div class="chat-header">
            <h3>ZetAI Asistente</h3>
            <span id="chatClose" class="chat-close"><i class="fas fa-times"></i></span>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
        <form id="chatForm" class="chat-input">
            <input type="text" id="chatInput" placeholder="Escribe tu mensaje aquí..." autocomplete="off">
            <button type="submit" id="chatSend" disabled>Enviar</button>
        </form>
    `;
    
    document.body.appendChild(chatContainer);
}

// Función para mostrar/ocultar el chat
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.classList.toggle('visible');
    
    // Si se está abriendo el chat, enfocar el input
    if (chatContainer.classList.contains('visible')) {
        document.getElementById('chatInput').focus();
    }
}

// Función para manejar el envío de mensajes
function handleChatSubmit(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input y deshabilitar botón
    chatInput.value = '';
    document.getElementById('chatSend').disabled = true;
    
    // Mostrar indicador de "escribiendo..."
    showTypingIndicator();
    
    // Enviar mensaje al servidor y recibir respuesta
    sendMessageToServer(message);
}

// Función para agregar un mensaje al chat
function addMessage(text, sender, className = '') {
    const chatMessages = document.getElementById('chatMessages');
    const message = document.createElement('div');
    message.className = `message ${sender} ${className}`;
    message.textContent = text;
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para mostrar el indicador de "escribiendo..."
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Crear el indicador
    const typing = document.createElement('div');
    typing.className = 'message bot typing';
    typing.id = 'typingIndicator';
    
    // Añadir los puntos
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typing.appendChild(dot);
    }
    
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para ocultar el indicador de "escribiendo..."
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Función para enviar mensaje al servidor
function sendMessageToServer(message) {
    // Preparar datos para enviar
    const data = {
        message: message,
        interaction: 'user_message',
        timestamp: new Date().toISOString(),
        source: 'chat_widget',
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    console.log('Enviando mensaje a Glitch:', data);
    
    // Enviar solicitud al servidor
    fetch('https://classic-alike-sandal.glitch.me/tu-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    })
    .then(response => {
        console.log('Respuesta del servidor:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`Error en la conexión: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        console.log('Datos recibidos del servidor:', data);
        
        // Mostrar respuesta del bot (revisar message o output)
        const botMessage = data ? (data.message || data.output || data.response) : null;
        if (botMessage) {
            addMessage(botMessage, 'bot');
        } else {
            console.error('Respuesta inesperada del servidor:', data); // Log para depuración
            addMessage('Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.', 'bot');
        }
    })
    .catch(error => {
        console.error('Error completo:', error);
        
        // Ocultar indicador de escritura
        hideTypingIndicator();
        
        // Mostrar mensaje de error
        addMessage('Lo siento, no pude conectarme con el servidor. Por favor, intenta de nuevo más tarde.', 'bot');
    });
}

// Actualizar la función openZetAI para que abra el chat en lugar de mostrar una alerta
window.openZetAI = function() {
    const chatContainer = document.getElementById('chatContainer');
    
    if (chatContainer && !chatContainer.classList.contains('visible')) {
        toggleChat();
    }
    
    return false; // Prevenir comportamiento predeterminado
}; 