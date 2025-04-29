'use strict';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Debugger para secciones 1 y 2
    console.log('Verificando secciones 1 y 2:');
    const heroSection = document.querySelector('.hero');
    const benefitsSection = document.querySelector('.benefits');
    
    console.log('Sección Hero encontrada:', heroSection);
    console.log('Sección Benefits encontrada:', benefitsSection);
    
    // Asegurar que las secciones sean visibles
    if (heroSection) {
        heroSection.style.display = 'block';
        heroSection.style.visibility = 'visible';
        heroSection.style.opacity = '1';
    }
    
    if (benefitsSection) {
        benefitsSection.style.display = 'block';
        benefitsSection.style.visibility = 'visible';
        benefitsSection.style.opacity = '1';
    }
    
    // Elementos de animación
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroVideo = document.querySelector('.hero-video-container');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    console.log('Elementos de la sección hero:');
    console.log('- Título:', heroTitle);
    console.log('- Subtítulo:', heroSubtitle);
    console.log('- Botones:', heroButtons);
    console.log('- Video:', heroVideo);
    
    // Aplicar clases de animación inicial
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.classList.add('animated');
            console.log('Animación aplicada al título');
        }
        setTimeout(() => {
            if (heroSubtitle) {
                heroSubtitle.classList.add('animated');
                console.log('Animación aplicada al subtítulo');
            }
            setTimeout(() => {
                if (heroButtons) {
                    heroButtons.classList.add('animated');
                    console.log('Animación aplicada a los botones');
                }
                setTimeout(() => {
                    if (heroVideo) {
                        heroVideo.classList.add('animated');
                        console.log('Animación aplicada al video');
                    }
                }, 200);
            }, 200);
        }, 200);
    }, 300);
    
    // Funcionalidad del menú móvil
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            
            // Cambiar ícono del menú
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Solo cerrar si estamos en vista móvil
                if (window.innerWidth < 768) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            event.target instanceof Node &&
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Efectos de scroll
    window.addEventListener('scroll', function() {
        // Header compacto al hacer scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animar elementos cuando son visibles
        animateOnScroll();
    });
    
    // Inicializar animaciones al cargar
    animateOnScroll();
    
    // Función para animar elementos al hacer scroll
    function animateOnScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('animated');
                console.log('Elemento animado:', element);
            }
        });
        
        // Animar tarjetas de beneficios
        const benefitCards = document.querySelectorAll('.benefit-card');
        console.log('Tarjetas de beneficios encontradas:', benefitCards.length);
        
        benefitCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < triggerBottom) {
                setTimeout(() => {
                    card.classList.add('animated');
                    console.log('Tarjeta de beneficio animada:', index);
                }, Math.min(index * 150, 1000));
            }
        });
        
        // Animar tarjetas de recursos
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            
            if (cardTop < triggerBottom) {
                setTimeout(() => {
                    card.classList.add('animated');
                }, Math.min(index * 150, 1000)); // Limitar el tiempo máximo a 1 segundo
            }
        });
    }
    
    // Añadir clase animate-on-scroll a elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .hero-video-container');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.setAttribute('data-delay', Math.min(index * 200, 1000)); // Limitar el retraso máximo
    });
    
    // Añadir efecto de desplazamiento suave a los enlaces de navegación
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (!targetId || targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Cerrar menú móvil si está abierto
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Función para el chatbot
function openZetAI() {
    // Si la función está definida en chat.js, úsala
    if (window.toggleChat) {
        return window.toggleChat();
    }
    
    // Fallback en caso de que chat.js no esté cargado
    console.log('Intento de uso del chatbot ZetAI registrado: ' + new Date().toISOString());
    return false; // Prevenir comportamiento predeterminado
} 