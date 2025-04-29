// Función para inicializar el chat
document.addEventListener('DOMContentLoaded', function() {
    const isContactPage = window.location.pathname.includes('contact') || 
                         window.location.hash === '#contact';
    
    // Inicializar la variable CSS --vh
    initializeVH();
    
    // Si estamos en la página de contacto, crear el chat integrado
    if (isContactPage) {
        createContactPageChat();
    } else {
        // Crear el chat flotante normal
        createChatElements();
    }
    
    // Mejorar el manejo del teclado virtual en móviles
    setupKeyboardHandling();
    
    // Añadir evento de clic al botón de chat
    const chatBubble = document.getElementById('chatBubble');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // Manejo de eventos
    if (chatBubble) chatBubble.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', toggleChat);
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
        chatInput.addEventListener('input', function() {
            chatSend.disabled = !chatInput.value.trim();
        });
    }
    
    // Mostrar mensaje de bienvenida después de un breve retraso
    setTimeout(() => {
        addMessage('¡Hola! Soy ZetAI, tu asistente virtual. ¿En qué puedo ayudarte hoy?', 'bot', 'welcome-message');
    }, 500);
});

// Función para inicializar la variable CSS --vh
function initializeVH() {
    // Calcular el valor de 1vh real
    let vh = window.innerHeight * 0.01;
    // Establecer la variable CSS personalizada --vh
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Actualizar la variable cuando el tamaño de la ventana cambie
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    // Si visualViewport está disponible, usarlo para detectar cambios en el teclado
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            let vh = window.visualViewport.height * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            handleKeyboardAppearance();
        });
    }
}

// Función para manejar el teclado virtual en móviles
function setupKeyboardHandling() {
    // Añadir eventos de foco para detectar cuando se selecciona un campo de entrada
    document.addEventListener('focusin', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Marcar que el teclado está abierto
            document.body.classList.add('keyboard-open');
            handleKeyboardAppearance();
        }
    });
    
    document.addEventListener('focusout', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Retrasar un poco para permitir que el teclado se cierre antes de quitar la clase
            setTimeout(() => {
                document.body.classList.remove('keyboard-open');
                handleKeyboardAppearance();
            }, 100);
        }
    });
}

// Función para manejar la apariencia cuando el teclado aparece/desaparece
function handleKeyboardAppearance() {
    const isKeyboardOpen = document.body.classList.contains('keyboard-open');
    const isMobile = window.innerWidth <= 767;
    
    if (!isMobile) return; // Solo aplicar en dispositivos móviles
    
    const chatContainer = document.getElementById('chatContainer');
    const contactChatContainer = document.querySelector('.contact-chat-container');
    
    if (isKeyboardOpen) {
        // Cuando el teclado está abierto
        if (chatContainer) {
            chatContainer.classList.add('keyboard-open');
        }
        if (contactChatContainer) {
            contactChatContainer.classList.add('keyboard-open');
        }
        
        // Hacer scroll al último mensaje
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } else {
        // Cuando el teclado está cerrado
        if (chatContainer) {
            chatContainer.classList.remove('keyboard-open');
        }
        if (contactChatContainer) {
            contactChatContainer.classList.remove('keyboard-open');
        }
        
        // Asegurarse de que la página vuelva al principio (para evitar que quede desplazada)
        window.scrollTo(0, 0);
    }
}

// Función para crear el chat en la página de contacto
function createContactPageChat() {
    const contactSection = document.querySelector('.contact-card');
    if (!contactSection) return;

    // Reemplazar el contenido actual con el chat
    contactSection.innerHTML = `
        <div class="contact-chat-container" id="chatContainer">
            <div class="chat-header">
                <h3>ZetAI Asistente</h3>
            </div>
            <div id="chatMessages" class="chat-messages"></div>
            <form id="chatForm" class="chat-input">
                <input type="text" id="chatInput" placeholder="Escribe tu mensaje aquí..." autocomplete="off">
                <button type="submit" id="chatSend" disabled>Enviar</button>
            </form>
        </div>
    `;

    // Configurar eventos
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    
    chatForm.addEventListener('submit', handleChatSubmit);
    chatInput.addEventListener('input', function() {
        chatSend.disabled = !chatInput.value.trim();
    });

    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        addMessage('¡Hola! Soy ZetAI, tu asistente virtual. ¿En qué puedo ayudarte hoy?', 'bot', 'welcome-message');
    }, 500);
}

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
        
        // Comprobar si data es un array y extraer el mensaje
        let botMessage = null;
        
        if (Array.isArray(data)) {
            // Si es un array, intentamos obtener el primer elemento
            console.log('Respuesta recibida como array:', data);
            if (data.length > 0) {
                const item = data[0];
                // Intentar extraer mensaje del primer elemento del array
                if (typeof item === 'object') {
                    botMessage = item.output || item.message || item.response;
                } else if (typeof item === 'string') {
                    botMessage = item;
                }
            }
        } else {
            // Procesar como antes si no es un array
            botMessage = data ? (data.message || data.output || data.response) : null;
        }
        
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