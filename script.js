// Funcionalidad mejorada para la burbuja de chat
document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('avatarChatBubble');
    const heroImage = document.querySelector('.hero-image img');
    const profileImage = document.querySelector('.profile-image');
    
    // Configuración del webhook para la burbuja de chat principal
    const webhookUrl = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';
    
    // Función para enviar interacciones al webhook
    function sendToWebhook(message, interactionType) {
        // Preparar los datos para el webhook
        const data = {
            message: message,
            interaction: interactionType,
            timestamp: new Date().toISOString(),
            source: 'avatar_bubble',
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Enviar los datos al webhook
        return fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Respuesta recibida:', response.status, response.statusText);
            if (!response.ok) {
                console.error('Error enviando mensaje al webhook');
            }
            // Intentar convertir a JSON incluso si hay error, para manejar respuestas de error
            return response.json().catch(e => {
                console.log('Respuesta no es JSON. Texto:', response.statusText);
                return { status: response.status, message: 'No JSON response' };
            });
        })
        .then(data => {
            console.log('Interacción enviada exitosamente', data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            return { error: true, message: error.message };
        });
    }
    
    if (chatBubble) {
        // Mensajes predefinidos para el chat con emojis para mayor expresividad
        const chatMessages = [
            "👋 ¡Hola! ¿En qué puedo ayudarte hoy?",
            "💻 ¿Necesitas ayuda con diseño UX/UI o desarrollo web?",
            "🚀 Puedo ayudarte a mejorar la experiencia de usuario de tu sitio",
            "💡 ¿Tienes algún proyecto en mente? ¡Cuéntame!",
            "📈 ¿Quieres optimizar la conversión de tu sitio?",
            "🤖 Puedo desarrollar soluciones de IA para tu negocio",
            "🔍 ¿Buscas una consultoría estratégica para tu startup?"
        ];
        
        // Función para cambiar el mensaje con animación
        function changeMessage() {
            // Obtener un mensaje aleatorio diferente al actual
            let currentMessage = chatBubble.querySelector('p').textContent;
            let newMessage;
            
            do {
                newMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)];
            } while (newMessage === currentMessage);
            
            // Animación de cambio de mensaje
            chatBubble.style.opacity = "0";
            chatBubble.style.transform = "translateX(-50%) translateY(20px)";
            
            setTimeout(function() {
                chatBubble.querySelector('p').textContent = newMessage;
                chatBubble.style.opacity = "1";
                chatBubble.style.transform = "translateX(-50%) translateY(0)";
                
                // Añadir una pequeña animación de rebote al avatar cuando cambia el mensaje
                if (profileImage) {
                    profileImage.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    profileImage.style.transform = "scale(1.05)";
                    setTimeout(() => {
                        profileImage.style.transform = "scale(1)";
                    }, 300);
                }
                
                if (heroImage) {
                    heroImage.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    heroImage.style.transform = "scale(1.05)";
                    setTimeout(() => {
                        heroImage.style.transform = "scale(1)";
                    }, 300);
                }
                
                // Enviar al webhook el nuevo mensaje mostrado
                sendToWebhook(newMessage, 'avatar_bubble_change');
            }, 300);
        }
        
        // Cambiar mensaje al hacer clic en el avatar
        if (heroImage) {
            heroImage.addEventListener('click', function() {
                changeMessage();
                // También podemos enviar al webhook que hubo un clic en el avatar
                sendToWebhook('Clic en avatar principal', 'avatar_hero_click');
            });
            heroImage.style.cursor = 'pointer';
        }
        
        if (profileImage) {
            profileImage.addEventListener('click', function() {
                changeMessage();
                // También podemos enviar al webhook que hubo un clic en el perfil
                sendToWebhook('Clic en avatar de perfil', 'avatar_profile_click');
            });
            profileImage.style.cursor = 'pointer';
        }
        
        // También permite hacer clic en la burbuja
        chatBubble.addEventListener('click', function() {
            changeMessage();
            // Enviar al webhook que hubo un clic en la burbuja
            sendToWebhook('Clic en burbuja de chat', 'chat_bubble_click');
            
            // También podemos activar el chat completo
            const chatWidget = document.getElementById('chatToggle');
            if (chatWidget) {
                setTimeout(() => {
                    chatWidget.click();
                }, 500);
            }
        });
        
        // Mostrar burbuja de chat después de 1.5 segundos
        setTimeout(function() {
            chatBubble.style.display = 'block';
            
            // Enviar al webhook que se mostró la burbuja inicial
            const initialMessage = chatBubble.querySelector('p').textContent;
            sendToWebhook(initialMessage, 'initial_bubble_display');
            
            // Añadir un pequeño rebote al avatar después de que aparezca la burbuja
            if (profileImage) {
                setTimeout(() => {
                    profileImage.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    profileImage.style.transform = "scale(1.1)";
                    setTimeout(() => {
                        profileImage.style.transform = "scale(1)";
                    }, 300);
                }, 500);
            }
            
            if (heroImage) {
                setTimeout(() => {
                    heroImage.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                    heroImage.style.transform = "scale(1.1)";
                    setTimeout(() => {
                        heroImage.style.transform = "scale(1)";
                    }, 300);
                }, 500);
            }
        }, 1500);
        
        // Cambiar el mensaje automáticamente cada 20 segundos
        let messageInterval = setInterval(function() {
            if (Math.random() > 0.3 && document.visibilityState === 'visible') { // 70% de probabilidad de cambiar
                changeMessage();
            }
        }, 20000);
        
        // Detener el intervalo cuando la página no está visible
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                clearInterval(messageInterval);
            } else {
                messageInterval = setInterval(function() {
                    if (Math.random() > 0.3) {
                        changeMessage();
                    }
                }, 20000);
            }
        });
    }
});

// Chat Widget Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatNotification = document.getElementById('chatNotification');
    
    // Configuración del webhook
    const webhookUrl = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';
    
    // Responses for the chatbot
    const botResponses = [
        // Eliminados todos los mensajes predefinidos
    ];
    
    // Toggle chat open/close
    chatToggle.addEventListener('click', function() {
        if (chatContainer.style.display === 'flex') {
            closeChat();
        } else {
            openChat();
        }
        
        // Hide notification when chat is opened
        chatNotification.style.display = 'none';
        
        // Add bounce animation to chat button
        chatToggle.classList.add('bounce');
        setTimeout(() => {
            chatToggle.classList.remove('bounce');
        }, 1000);
    });
    
    // Close chat when clicking X
    chatClose.addEventListener('click', closeChat);
    
    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to open chat
    function openChat() {
        chatContainer.style.display = 'flex';
        chatInput.focus();
    }
    
    // Function to close chat
    function closeChat() {
        chatContainer.style.display = 'none';
    }
    
    // Function to send message
    function sendMessage() {
        const message = chatInput.value.trim();
        
        // Don't send empty messages
        if (message === '') return;
        
        // Add user message
        addMessage(message, 'sent');
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        scrollToBottom();
        
        // Send message to webhook
        sendToWebhook(message, 'user_message');
        
        // Simulate typing indicator
        setTimeout(() => {
            addTypingIndicator();
            
            // Ahora SOLO esperamos la respuesta del webhook, sin mensajes automatizados
            setTimeout(() => {
                removeTypingIndicator();
                // Eliminada la generación aleatoria de respuestas
                // Aquí ya no generamos un mensaje local, solo los que vienen del webhook
            }, 1000);
        }, 500);
    }
    
    // Function to add message
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-${type}`;
        
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        
        messageDiv.appendChild(paragraph);
        chatMessages.appendChild(messageDiv);
    }
    
    // Function to add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-received typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dots.appendChild(dot);
        }
        
        typingDiv.appendChild(dots);
        chatMessages.appendChild(typingDiv);
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add typing indicator styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator {
            padding: 12px 16px;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #888;
            opacity: 0.6;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Ahora también conectamos la burbuja de chat sobre el avatar con el chat widget
    const avatarChatBubble = document.getElementById('avatarChatBubble');
    if (avatarChatBubble) {
        avatarChatBubble.addEventListener('click', function() {
            openChat(); // Abrir el chat al hacer clic en la burbuja
        });
    }
});

// Widget de chat
const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// Configuración del webhook para el widget de chat
const webhookUrl = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';

// Function to send message to webhook
function sendToWebhook(message, interactionType = 'chat_message') {
    // Preparar los datos para el webhook
    const data = {
        message: message,
        interaction: interactionType,
        timestamp: new Date().toISOString(),
        source: 'chat_widget',
        url: window.location.href,
        userAgent: navigator.userAgent
    };
    
    console.log('Enviando datos al webhook:', data);
    
    // Crear una promesa con tiempo de espera extendido (20 segundos)
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo de espera agotado después de 20 segundos')), 20000);
    });
    
    // Promesa de fetch normal
    const fetchPromise = fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify(data)
    });
    
    // Competir entre fetch y timeout
    return Promise.race([fetchPromise, timeoutPromise])
        .then(response => {
            console.log('Respuesta del webhook recibida:', response.status, response.statusText);
            
            if (!response.ok) {
                console.error('Error enviando mensaje al webhook:', response.status);
                return response.json().catch(e => {
                    throw new Error(`Error en la respuesta del webhook: ${response.status}`);
                });
            }
            
            // Intentar parsear la respuesta como JSON
            return response.json().catch(e => {
                console.warn('La respuesta no es JSON, pero el status es OK:', e);
                return { status: response.status, message: 'Respuesta recibida correctamente' };
            });
        })
        .then(data => {
            console.log('Datos recibidos del webhook:', data);
            return data;
        })
        .catch(error => {
            console.error('Error en comunicación con webhook:', error.message);
            return { error: true, message: error.message };
        });
}

if (chatToggle && chatWidget && chatClose) {
    // Mostrar/ocultar el widget de chat
    chatToggle.addEventListener('click', function() {
        chatWidget.classList.toggle('active');
        
        // Si el widget se está abriendo, enviamos esta interacción al webhook
        if (chatWidget.classList.contains('active')) {
            sendToWebhook('Widget de chat abierto', 'chat_widget_open');
        } else {
            sendToWebhook('Widget de chat cerrado', 'chat_widget_close');
        }
    });
    
    chatClose.addEventListener('click', function() {
        chatWidget.classList.remove('active');
        sendToWebhook('Widget de chat cerrado', 'chat_widget_close');
    });
    
    // Manejar el envío de mensajes
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        
        if (message !== '') {
            // Añadir mensaje del usuario
            addMessage(message, 'user');
            
            // Limpiar el input
            chatInput.value = '';
            
            // Mostrar indicador de escritura inmediatamente
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot typing';
            typingIndicator.id = 'typingIndicator';
            typingIndicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            chatMessages.appendChild(typingIndicator);
            
            // Desplazarse al fondo
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            console.log('Enviando mensaje a Zetai:', message);
            
            // Tiempo de inicio para medir cuánto tarda la respuesta
            const startTime = new Date().getTime();
            
            // Send message to webhook con tiempo de espera aumentado
            sendToWebhook(message, 'user_message')
                .then(response => {
                    // Calcular tiempo transcurrido
                    const endTime = new Date().getTime();
                    const responseTime = (endTime - startTime) / 1000;
                    console.log(`Respuesta recibida después de ${responseTime} segundos:`, response);
                    console.log('RESPUESTA COMPLETA:', JSON.stringify(response, null, 2));
                    
                    // Eliminar indicador de escritura
                    const typingIndicator = document.getElementById('typingIndicator');
                    if (typingIndicator) {
                        chatMessages.removeChild(typingIndicator);
                    }
                    
                    // Procesar la respuesta solo si tenemos datos válidos
                    if (response && response.message) {
                        console.log('Mensaje de respuesta de Zetai:', response.message);
                        
                        // Mostrar la respuesta del LLM
                        const botResponse = response.message;
                        addMessage(botResponse, 'bot');
                        
                        // Desplazarse al fondo
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    } else {
                        console.warn('No se recibió respuesta válida del webhook:', response);
                        // Mostrar mensaje por defecto cuando no hay respuesta válida
                        addMessage('Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo.', 'bot');
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                })
                .catch(error => {
                    console.error('Error procesando respuesta:', error);
                    
                    // Eliminar indicador de escritura si existe
                    const typingIndicator = document.getElementById('typingIndicator');
                    if (typingIndicator) {
                        chatMessages.removeChild(typingIndicator);
                    }
                    
                    // Mostrar mensaje de error al usuario
                    addMessage('Ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.', 'bot');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                });
        }
    });
}

// Function to add message
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageElement);
    
    // Desplazarse al fondo
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Funcionalidad para la flecha de regreso al inicio
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Función para mostrar u ocultar el botón según la posición del scroll
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Comprobar el scroll al cargar la página
    toggleBackToTopButton();
    
    // Evento de scroll para mostrar/ocultar el botón
    window.addEventListener('scroll', toggleBackToTopButton);
    
    // Acción al hacer clic en el botón
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Animación de scroll suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 