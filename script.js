// Funcionalidad simplificada para la burbuja de chat
document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('avatarChatBubble');
    const heroImage = document.querySelector('.hero-image img');
    const profileImage = document.querySelector('.profile-image');
    
    // Generar o recuperar el ID único de usuario
    function getOrCreateUserID() {
        // Verificar si ya existe un ID en localStorage
        let userID = localStorage.getItem('zet_user_id');
        
        // Si no existe, crear uno nuevo (implementación simple de UUID v4)
        if (!userID) {
            userID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            // Guardar el nuevo ID en localStorage
            localStorage.setItem('zet_user_id', userID);
        }
        
        return userID;
    }
    
    // Obtener ID de usuario al cargar la página
    const userID = getOrCreateUserID();
    console.log('ID de usuario:', userID);
    
    if (chatBubble) {
        // Mensaje permanente para la burbuja
        const mensajePermanente = "Automatiza tu embudo de venta.\nHabla con ZetAI 👇";
        
        // Mostrar burbuja de chat después de 1.5 segundos con el mensaje fijo
        setTimeout(function() {
            // Establecer el mensaje permanente
            chatBubble.querySelector('p').textContent = mensajePermanente;
            chatBubble.style.display = 'block';
            
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
        
        // Hacer que el avatar sea clickeable para animar pero sin abrir el chat
        if (heroImage) {
            heroImage.addEventListener('click', function() {
                // Añadir animación al avatar al hacer clic
                heroImage.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                heroImage.style.transform = "scale(1.05)";
                setTimeout(() => {
                    heroImage.style.transform = "scale(1)";
                }, 300);
            });
            heroImage.style.cursor = 'pointer';
        }
        
        if (profileImage) {
            profileImage.addEventListener('click', function() {
                // Añadir animación al avatar al hacer clic
                profileImage.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                profileImage.style.transform = "scale(1.05)";
                setTimeout(() => {
                    profileImage.style.transform = "scale(1)";
                }, 300);
            });
            profileImage.style.cursor = 'pointer';
        }
        
        // Permitir hacer clic en la burbuja para animar pero sin abrir el chat
        chatBubble.addEventListener('click', function() {
            // Animar burbuja al hacer clic
            chatBubble.style.opacity = "0.7";
            setTimeout(function() {
                chatBubble.style.opacity = "1";
            }, 300);
        });
        chatBubble.style.cursor = 'pointer';
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
    
    // Obtener o crear el ID de usuario
    function getOrCreateUserID() {
        let userID = localStorage.getItem('zet_user_id');
        if (!userID) {
            userID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('zet_user_id', userID);
        }
        return userID;
    }
    
    // ID de usuario para esta sesión
    const userID = getOrCreateUserID();
    
    // Configuración del webhook
    const webhookUrl = 'https://classic-alike-sandal.glitch.me/proxy-n8n';
    
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
        
        // Show typing indicator immediately
        addTypingIndicator();
        
        // Send message to webhook
        sendToWebhook(message, 'user_message')
            .then(data => {
                // Remove typing indicator
                removeTypingIndicator();
                
                console.log('Tipo de datos recibidos:', typeof data, Array.isArray(data) ? 'es un array' : 'no es un array');
                
                // Process the response - handle both object and array formats
                let responseMessage = '';
                
                if (Array.isArray(data) && data.length > 0) {
                    // Si es un array, tomamos el primer elemento
                    console.log('Procesando respuesta como array:', data);
                    const firstItem = data[0];
                    
                    if (typeof firstItem === 'object' && firstItem !== null) {
                        // Si el primer elemento es un objeto, buscamos una propiedad que pueda contener el mensaje
                        if (firstItem.message) {
                            responseMessage = firstItem.message;
                        } else if (firstItem.text) {
                            responseMessage = firstItem.text;
                        } else if (firstItem.response) {
                            responseMessage = firstItem.response;
                        } else if (firstItem.output) {
                            responseMessage = firstItem.output;
                        } else if (firstItem.data) {
                            responseMessage = typeof firstItem.data === 'string' ? 
                                firstItem.data : 
                                JSON.stringify(firstItem.data);
                        } else {
                            // Si no hay propiedades conocidas, convertimos todo el objeto a string
                            responseMessage = JSON.stringify(firstItem);
                        }
                    } else if (typeof firstItem === 'string') {
                        // Si el primer elemento es directamente un string
                        responseMessage = firstItem;
                    } else {
                        // Para otros tipos
                        responseMessage = String(firstItem);
                    }
                } else if (data && data.output) {
                    // Nuevo formato con propiedad output
                    responseMessage = data.output;
                } else if (data && data.message) {
                    // Formato original esperado: objeto con propiedad message
                    responseMessage = data.message;
                } else if (typeof data === 'string') {
                    // Si es directamente un string
                    responseMessage = data;
                } else {
                    // Si no hay un formato reconocible
                    responseMessage = 'Lo siento, no pude procesar tu mensaje en este momento.';
                }
                
                // Add bot message
                addMessage(responseMessage, 'received');
                
                // Scroll to bottom
                scrollToBottom();
            })
            .catch(error => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add error message
                addMessage('Ha ocurrido un error al procesar tu mensaje.', 'received');
                
                // Scroll to bottom
                scrollToBottom();
                
                console.error('Error:', error);
            });
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
const webhookUrl = 'https://classic-alike-sandal.glitch.me/proxy-n8n';

// Function to send message to webhook
function sendToWebhook(message, interactionType = 'chat_message') {
    // Obtener ID de usuario existente o crear uno nuevo
    function getOrCreateUserID() {
        let userID = localStorage.getItem('zet_user_id');
        if (!userID) {
            userID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('zet_user_id', userID);
        }
        return userID;
    }
    
    const userID = getOrCreateUserID();
    
    // Preparar los datos para el webhook, incluyendo el ID único de usuario
    const data = {
        message: message,
        interaction: interactionType,
        timestamp: new Date().toISOString(),
        source: 'chat_widget',
        url: window.location.href,
        userAgent: navigator.userAgent,
        userID: userID // Añadimos el ID de usuario a cada solicitud
    };
    
    console.log('Enviando datos a webhook (userID: ' + userID + '):', data);
    
    return new Promise((resolve, reject) => {
        // Configurar timeout por si el servidor no responde
        const timeoutId = setTimeout(() => {
            console.error('Timeout esperando respuesta del servidor');
            reject(new Error('Timeout esperando respuesta del servidor'));
        }, 15000); // 15 segundos de timeout
        
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Estado de respuesta:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            return response.json().catch(e => {
                console.error('Error parseando respuesta JSON:', e);
                throw new Error('Formato de respuesta inválido');
            });
        })
        .then(data => {
            clearTimeout(timeoutId); // Limpiar timeout cuando hay respuesta
            console.log('Datos recibidos del webhook:', data);
            resolve(data);
        })
        .catch(error => {
            clearTimeout(timeoutId); // Limpiar timeout en caso de error
            console.error('Error en la comunicación:', error);
            reject(error);
        });
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
            
            // Enviar mensaje al webhook
            sendToWebhook(message, 'user_message')
                .then(function(response) {
                    // Calcular tiempo transcurrido
                    const endTime = new Date().getTime();
                    const responseTime = (endTime - startTime) / 1000;
                    console.log('Respuesta recibida después de ' + responseTime + ' segundos:', response);
                    console.log('RESPUESTA COMPLETA:', JSON.stringify(response, null, 2));
                    
                    // Eliminar indicador de escritura
                    const typingIndicator = document.getElementById('typingIndicator');
                    if (typingIndicator) {
                        chatMessages.removeChild(typingIndicator);
                    }
                    
                    // Procesar la respuesta según su formato
                    procesarRespuesta(response);
                })
                .catch(function(error) {
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
    
    // Función para procesar las respuestas según su formato
    function procesarRespuesta(response) {
        if (response && response.message) {
            console.log('Mensaje de respuesta de Zetai:', response.message);
            
            // Mostrar la respuesta
            addMessage(response.message, 'bot');
            
            // Desplazarse al fondo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } 
        else if (Array.isArray(response) && response.length > 0) {
            // Manejar respuesta en formato array
            console.log('Respuesta en formato array:', response);
            
            let botResponse = '';
            const firstItem = response[0];
            
            if (typeof firstItem === 'object' && firstItem !== null) {
                // Buscar en propiedades comunes
                if (firstItem.message) {
                    botResponse = firstItem.message;
                } else if (firstItem.text) {
                    botResponse = firstItem.text;
                } else if (firstItem.response) {
                    botResponse = firstItem.response;
                } else if (firstItem.output) {
                    botResponse = firstItem.output;
                } else if (firstItem.data) {
                    botResponse = typeof firstItem.data === 'string' ? 
                        firstItem.data : 
                        JSON.stringify(firstItem.data);
                } else {
                    botResponse = JSON.stringify(firstItem);
                }
            } else if (typeof firstItem === 'string') {
                botResponse = firstItem;
            } else {
                botResponse = String(firstItem);
            }
            
            addMessage(botResponse, 'bot');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } 
        else {
            console.warn('No se recibió respuesta válida del webhook:', response);
            // Mostrar mensaje por defecto cuando no hay respuesta válida
            addMessage('Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo.', 'bot');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
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

// Añadir animación para la sección de video y su contenedor
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animación para la sección de video
        gsap.from('#video-presentacion', {
            scrollTrigger: {
                trigger: '#video-presentacion',
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 1.2,
            opacity: 0,
            y: 50,
            ease: "power2.out"
        });
        
        // Animación para el contenedor del video
        gsap.from('.video-container', {
            scrollTrigger: {
                trigger: '.video-container',
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            delay: 0.3,
            ease: "back.out(1.7)"
        });
        
        // Animación para los elementos decorativos
        gsap.utils.toArray(['.video-corner', '.video-stars-bg', '.video-holographic-overlay']).forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: '.video-container',
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                duration: 0.8,
                opacity: 0,
                scale: 0.5,
                delay: 0.8 + (i * 0.15),
                ease: "power3.out"
            });
        });
        
        // Implementar interacción 3D con el movimiento del ratón
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            document.addEventListener('mousemove', function(e) {
                if (window.innerWidth > 768) { // Solo en pantallas más grandes
                    const mouseX = e.clientX / window.innerWidth - 0.5;
                    const mouseY = e.clientY / window.innerHeight - 0.5;
                    
                    gsap.to(videoContainer, {
                        duration: 0.5,
                        rotationY: mouseX * 10,
                        rotationX: -mouseY * 10,
                        transformPerspective: 1000,
                        ease: "power1.out"
                    });
                }
            });
            
            // Restablecer cuando el ratón sale del viewport
            document.addEventListener('mouseleave', function() {
                gsap.to(videoContainer, {
                    duration: 1.2,
                    rotationY: 0,
                    rotationX: 0,
                    ease: "elastic.out(1, 0.5)"
                });
            });
        }
        
        // Manejar el botón de reproducción personalizado
        const videoPlayButton = document.querySelector('.video-play-button');
        const videoIframe = document.querySelector('.video-container iframe');
        
        if (videoPlayButton && videoIframe) {
            // YouTube API para control del video
            let player;
            let youtubeReady = false;
            
            // Cargar YouTube API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Cuando la API está lista
            window.onYouTubeIframeAPIReady = function() {
                youtubeReady = true;
                player = new YT.Player(videoIframe, {
                    events: {
                        'onStateChange': onPlayerStateChange
                    }
                });
            };
            
            // Controlar estados del reproductor
            function onPlayerStateChange(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    videoPlayButton.style.opacity = '0';
                } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                    videoPlayButton.style.opacity = '1';
                }
            }
            
            // Click en el botón de reproducción
            videoPlayButton.addEventListener('click', function() {
                if (youtubeReady && player) {
                    const playerState = player.getPlayerState();
                    if (playerState === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                    } else {
                        player.playVideo();
                    }
                }
            });
        }
    }
}); 