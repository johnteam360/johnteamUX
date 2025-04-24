// Animaciones generales y efectos de la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las animaciones y funcionalidades
    initNavigation();
    initScrollAnimations();
    initParallaxEffects();
    initChatbot();
});

// Función para manejar la navegación y el menú móvil
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Función para inicializar animaciones basadas en scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Función para efectos de parallax
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });
}

// Función para inicializar y gestionar el chatbot
function initChatbot() {
    const chatbotIcon = document.querySelector('.chat-bot-icon');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotCloseBtn = document.querySelector('.chatbot-header button');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSendBtn = document.querySelector('.chatbot-input button');
    
    // Mensajes predefinidos del bot
    const botResponses = {
        greeting: [
            "¡Hola! Soy el asistente virtual de TechSolutions. ¿En qué puedo ayudarte?",
            "¡Bienvenido/a! Estoy aquí para resolver tus dudas sobre nuestros servicios."
        ],
        services: [
            "Ofrecemos servicios de desarrollo web, aplicaciones móviles, consultoría tecnológica y soluciones de IA. ¿Sobre cuál necesitas más información?"
        ],
        contact: [
            "Puedes contactarnos a través del formulario en nuestra página, por correo a info@techsolutions.com o llamando al +123 456 7890."
        ],
        pricing: [
            "Nuestros precios varían según el proyecto. ¿Te gustaría que te contactemos para una cotización personalizada?"
        ],
        default: [
            "No estoy seguro de entender tu consulta. ¿Podrías reformularla o preguntar sobre nuestros servicios, contacto o proyectos?",
            "Interesante pregunta. ¿Te gustaría que un miembro de nuestro equipo te contacte para discutirlo en detalle?"
        ]
    };
    
    // Mensaje inicial del bot
    setTimeout(() => {
        addBotMessage(getRandomResponse(botResponses.greeting));
    }, 1000);
    
    // Mostrar/ocultar el chatbot
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', function() {
            chatbotContainer.classList.add('active');
        });
    }
    
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Enviar mensaje
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message !== '') {
            // Añadir mensaje del usuario
            addUserMessage(message);
            chatbotInput.value = '';
            
            // Simular "escribiendo..."
            setTimeout(() => {
                // Procesar respuesta
                const response = processUserMessage(message);
                addBotMessage(response);
                
                // Auto scroll al último mensaje
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    }
    
    // Evento para enviar con el botón
    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', sendMessage);
    }
    
    // Evento para enviar con Enter
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Añadir mensaje del bot
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bot-message';
        messageElement.innerHTML = `
            <div class="bot-avatar">
                <img src="images/chatbot-avatar.png" alt="Bot Avatar">
            </div>
            <div class="message-content">${message}</div>
        `;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Añadir mensaje del usuario
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        chatbotMessages.appendChild(messageElement);
    }
    
    // Procesar mensaje del usuario y determinar respuesta
    function processUserMessage(message) {
        message = message.toLowerCase();
        
        if (message.includes('hola') || message.includes('buenos') || message.includes('saludos')) {
            return getRandomResponse(botResponses.greeting);
        } else if (message.includes('servicio') || message.includes('ofrecen') || message.includes('hacer')) {
            return getRandomResponse(botResponses.services);
        } else if (message.includes('contacto') || message.includes('comunicar') || message.includes('llamar') || message.includes('teléfono') || message.includes('email')) {
            return getRandomResponse(botResponses.contact);
        } else if (message.includes('precio') || message.includes('costo') || message.includes('tarifa') || message.includes('presupuesto')) {
            return getRandomResponse(botResponses.pricing);
        } else {
            return getRandomResponse(botResponses.default);
        }
    }
    
    // Obtener respuesta aleatoria de un array
    function getRandomResponse(responses) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
} 