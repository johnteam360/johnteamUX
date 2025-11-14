"use strict";

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  // Debugger para secciones 1 y 2
  // console.log('Verificando secciones 1 y 2:');
  const heroSection = document.querySelector(".hero");
  const benefitsSection = document.querySelector(".benefits");

  // console.log('Sección Hero encontrada:', heroSection);
  // console.log('Sección Benefits encontrada:', benefitsSection);

  // Asegurar que las secciones sean visibles (REVISAR SI ES NECESARIO)
  /*
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
    */

  // Elementos de animación
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroButtons = document.querySelector(".hero-buttons");
  const heroVideo = document.querySelector(".hero-video-container");
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const benefitCards = document.querySelectorAll(".benefit-card");
  const resourceCards = document.querySelectorAll(".resource-card");

  // console.log('Elementos de la sección hero:');
  // console.log('- Título:', heroTitle);
  // console.log('- Subtítulo:', heroSubtitle);
  // console.log('- Botones:', heroButtons);
  // console.log('- Video:', heroVideo);

  // Aplicar clases de animación inicial
  setTimeout(() => {
    if (heroTitle) {
      heroTitle.classList.add("animated");
      // console.log('Animación aplicada al título');
    }
    setTimeout(() => {
      if (heroSubtitle) {
        heroSubtitle.classList.add("animated");
        // console.log('Animación aplicada al subtítulo');
      }
      setTimeout(() => {
        if (heroButtons) {
          heroButtons.classList.add("animated");
          // console.log('Animación aplicada a los botones');
        }
        setTimeout(() => {
          if (heroVideo) {
            heroVideo.classList.add("animated");
            // console.log('Animación aplicada al video');
          }
        }, 200);
      }, 200);
    }, 200);
  }, 300);

  // Funcionalidad del menú móvil
  function toggleMenuIcon(isActive) {
    if (!menuToggle) return; // Guarda por si menuToggle no existe
    const icon = menuToggle.querySelector("i");
    if (icon) {
      if (isActive) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      navMenu.classList.toggle("active");
      toggleMenuIcon(navMenu.classList.contains("active"));
    });

    // Cerrar menú al hacer clic en un enlace
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth < 768 && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          toggleMenuIcon(false);
        }
      });
    });
  }

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener("click", function (event) {
    if (
      menuToggle &&
      navMenu &&
      navMenu.classList.contains("active") &&
      event.target instanceof Node &&
      !navMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      navMenu.classList.remove("active");
      toggleMenuIcon(false);
    }
  });

  // Efectos de scroll
  window.addEventListener("scroll", function () {
    if (header) {
      // Verificar si header existe
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    animateOnScroll();
  });

  // Inicializar animaciones al cargar
  animateOnScroll();

  // Función para animar elementos al hacer scroll
  function animateOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    animatedElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        element.classList.add("animated");
        // console.log('Elemento animado:', element);
      }
    });

    // Animar tarjetas de beneficios
    // console.log('Tarjetas de beneficios encontradas:', benefitCards.length);
    benefitCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < triggerBottom) {
        setTimeout(() => {
          card.classList.add("animated");
          // console.log('Tarjeta de beneficio animada:', index);
        }, Math.min(index * 150, 1000));
      }
    });

    // Animar tarjetas de recursos
    resourceCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < triggerBottom) {
        setTimeout(() => {
          card.classList.add("animated");
        }, Math.min(index * 150, 1000)); // Limitar el tiempo máximo a 1 segundo
      }
    });
  }

  // Añadir clase animate-on-scroll a elementos que queremos animar
  const elementsToAnimate = document.querySelectorAll(
    ".hero-title, .hero-subtitle, .hero-buttons, .hero-video-container"
  );
  elementsToAnimate.forEach((el, index) => {
    el.classList.add("animate-on-scroll");
    el.setAttribute("data-delay", Math.min(index * 200, 1000)); // Limitar el retraso máximo
  });

  // Añadir efecto de desplazamiento suave a los enlaces de navegación
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        if (
          navMenu &&
          navMenu.classList.contains("active") &&
          window.innerWidth < 768
        ) {
          navMenu.classList.remove("active");
          toggleMenuIcon(false);
        }

        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});

// Ajustar la altura del chat en móviles
function setVhVariable() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", setVhVariable);
window.addEventListener("orientationchange", setVhVariable);
setVhVariable(); // Inicializar al cargar

// Footer Accordion para móvil
document.addEventListener("DOMContentLoaded", function () {
  const footerAccordions = document.querySelectorAll(".footer-accordion");

  footerAccordions.forEach((accordion) => {
    const title = accordion.querySelector(".footer-title");

    if (title) {
      title.addEventListener("click", function () {
        // Solo activar accordion en móvil (menos de 768px)
        if (window.innerWidth < 768) {
          // Cerrar otros accordions si quieres comportamiento de uno a la vez
          // footerAccordions.forEach(acc => {
          //   if (acc !== accordion) {
          //     acc.classList.remove('active');
          //   }
          // });

          // Toggle del accordion actual
          accordion.classList.toggle("active");
        }
      });
    }
  });

  // Mantener todo abierto en desktop
  function checkWindowSize() {
    if (window.innerWidth >= 768) {
      footerAccordions.forEach((accordion) => {
        accordion.classList.add("active");
      });
    } else {
      // En móvil, mantener el primero abierto por defecto
      footerAccordions.forEach((accordion, index) => {
        if (index === 0) {
          accordion.classList.add("active");
        }
      });
    }
  }

  checkWindowSize();
  window.addEventListener("resize", checkWindowSize);
});

// Lógica para las tarjetas de servicio con efecto flip (de servicios.html)
document.addEventListener("DOMContentLoaded", function () {
  const serviceBoxes = document.querySelectorAll(".service-box");

  if (serviceBoxes.length > 0) {
    serviceBoxes.forEach((box, index) => {
      // Asignar una variable CSS para posible uso en animaciones escalonadas (opcional)
      // box.style.setProperty('--i', index);

      box.addEventListener("click", function () {
        // Si la tarjeta ya está volteada, quitar la clase 'flipped'
        if (this.classList.contains("flipped")) {
          this.classList.remove("flipped");
        } else {
          // Opcional: Si quieres que solo una tarjeta esté volteada a la vez
          // serviceBoxes.forEach(sb => sb.classList.remove('flipped'));

          // Voltear esta tarjeta
          this.classList.add("flipped");
        }
      });

      // Añadir manejo para 'Enter' o 'Space' para accesibilidad
      box.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); // Prevenir scroll en caso de 'Space'
          this.click(); // Simular click
        }
      });

      // Es importante que las tarjetas sean enfocables para keydown
      if (!box.hasAttribute("tabindex")) {
        box.setAttribute("tabindex", "0");
      }
    });
  }
});

// Lógica específica para la página de Portafolio (de portafolio.html)
document.addEventListener("DOMContentLoaded", function () {
  // Filtrado de proyectos
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    // Mostrar inicialmente solo los proyectos de la categoría activa por defecto (si existe)
    const initialActiveFilter = document.querySelector(".filter-btn.active");
    let currentFilter = "web"; // Default filter if none is active initially
    if (initialActiveFilter) {
      currentFilter = initialActiveFilter.getAttribute("data-filter");
    }

    projectCards.forEach((card) => {
      const categories = card.getAttribute("data-category").split(" ");
      if (categories.includes(currentFilter)) {
        card.style.display = "block"; // O tu clase para mostrar
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      } else {
        card.style.display = "none"; // O tu clase para ocultar
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
      }
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-selected", "true");

        const filter = this.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const categories = card.getAttribute("data-category").split(" ");
          const matchesFilter = categories.includes(filter);

          // Optimización: no re-animar si ya está visible y coincide, o ya está oculto y no coincide
          const isCurrentlyVisible = card.style.display === "block";

          if (matchesFilter) {
            if (!isCurrentlyVisible) {
              card.style.display = "block";
              // Forzar reflujo para transición CSS si se aplica inmediatamente
              // void card.offsetWidth;
              setTimeout(() => {
                // Pequeño delay para asegurar que display:block se aplique antes de la transición
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, 10); // Un delay muy corto debería ser suficiente
            }
          } else {
            if (isCurrentlyVisible) {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              setTimeout(() => {
                card.style.display = "none";
              }, 300); // Coincidir con duración de transición CSS si hay
            }
          }
        });
      });
    });
  }

  // Slider de testimonios
  const testimonialContainer = document.querySelector(".testimonials-slider");
  if (testimonialContainer) {
    const testimonialCardsAll =
      testimonialContainer.querySelectorAll(".testimonial-card");
    const testimonialDotsContainer =
      document.querySelector(".testimonial-dots");
    let currentTestimonial = 0;

    if (testimonialCardsAll.length > 0) {
      // Crear dots dinámicamente si no existen y hay un contenedor para ellos
      if (
        testimonialDotsContainer &&
        testimonialDotsContainer.children.length === 0
      ) {
        testimonialCardsAll.forEach((_, i) => {
          const dot = document.createElement("button");
          dot.classList.add("dot");
          if (i === 0) dot.classList.add("active");
          dot.setAttribute("aria-label", `Ir al testimonio ${i + 1}`);
          dot.addEventListener("click", () => showTestimonial(i));
          testimonialDotsContainer.appendChild(dot);
        });
      }
      const testimonialDots = testimonialDotsContainer
        ? testimonialDotsContainer.querySelectorAll(".dot")
        : [];

      function showTestimonial(index) {
        testimonialCardsAll.forEach((card, i) => {
          const isActive = i === index;
          card.style.opacity = isActive ? "1" : "0";
          card.style.transform = isActive
            ? "translateX(0)"
            : "translateX(50px)"; // O el efecto deseado
          card.style.position = isActive ? "relative" : "absolute"; // Para evitar que ocupen espacio al estar ocultas
          card.style.zIndex = isActive ? "2" : "1";
          card.setAttribute("aria-hidden", !isActive);
        });

        if (testimonialDots.length > 0) {
          testimonialDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
          });
        }
        currentTestimonial = index;
      }

      showTestimonial(0);

      // Cambio automático cada 5 segundos
      setInterval(() => {
        currentTestimonial =
          (currentTestimonial + 1) % testimonialCardsAll.length;
        showTestimonial(currentTestimonial);
      }, 5000);
    }
  }

  // Animación para las estadísticas (funciona en múltiples páginas)
  const statsSection = document.querySelector(".portfolio-stats, .pain-points, .results-section");
  if (statsSection) {
    const statNumbers = statsSection.querySelectorAll(".stat-number, [data-target]");
    let animationStarted = false;

    function animateCounters() {
      if (animationStarted || statNumbers.length === 0) return;
      animationStarted = true;

      statNumbers.forEach((numberElement) => {
        // Obtener el valor objetivo
        let target;
        let targetText = numberElement.textContent || "0";
        
        // Priorizar data-target si existe
        if (numberElement.hasAttribute('data-target')) {
          target = parseInt(numberElement.getAttribute('data-target'));
        } else {
          // Extraer el número del texto
          target = parseInt(targetText.replace(/\D/g, ""));
        }
        
        // Si no hay número válido, salir
        if (isNaN(target) || target === 0) return;
        
        // Detectar prefijo y sufijo (como $2,500)
        const hasPrefix = targetText.match(/^[^0-9]+/);
        const prefix = hasPrefix ? hasPrefix[0] : '';
        const suffixMatch = targetText.match(/[^0-9]+$/);
        const suffix = suffixMatch ? suffixMatch[0] : '';
        
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const animate = () => {
          count += increment;
          if (count < target) {
            let displayNum = Math.floor(count);
            // Si es un número grande (>999), agregar coma
            if (displayNum > 999) {
              displayNum = displayNum.toLocaleString('en-US');
            }
            numberElement.textContent = prefix + displayNum + suffix;
            requestAnimationFrame(animate);
          } else {
            let displayNum = target;
            if (displayNum > 999) {
              displayNum = displayNum.toLocaleString('en-US');
            }
            numberElement.textContent = prefix + displayNum + suffix;
          }
        };
        
        animate();
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(statsSection);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // FAQs functionality
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => {
        const answer = item.querySelector(".faq-answer");
        const icon = question.querySelector("i");

        answer.classList.toggle("show");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
        item.classList.toggle("open");
      });
    });
  }

  // ... (resto del código existente de DOMContentLoaded si hay más)
  // Flip Cards en servicios.html
  const flipCards = document.querySelectorAll(".flip-card-inner");
  if (flipCards.length > 0) {
    flipCards.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
      });
    });
  }

  // Portfolio filtering logic (from portfolio.html)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to the clicked button
        button.classList.add("active");

        const filter = button.dataset.filter;

        projectCards.forEach((card) => {
          if (filter === "all" || card.dataset.category.includes(filter)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Testimonial slider (from portfolio.html)
  const testimonials = document.querySelectorAll(".testimonial-item");
  const prevButton = document.querySelector(".prev-testimonial");
  const nextButton = document.querySelector(".next-testimonial");
  let currentTestimonialIndex = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.remove("active");
      if (i === index) {
        testimonial.classList.add("active");
      }
    });
  }

  if (testimonials.length > 0) {
    showTestimonial(currentTestimonialIndex);

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentTestimonialIndex =
          (currentTestimonialIndex - 1 + testimonials.length) %
          testimonials.length;
        showTestimonial(currentTestimonialIndex);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        currentTestimonialIndex =
          (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
      });
    }
  }

  // Animated statistics (from portfolio.html)
  const statsCounters = document.querySelectorAll(".stat-number");
  if (statsCounters.length > 0) {
    const observerOptions = {
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const animateCounter = (counter) => {
      const target = +counter.dataset.target;
      const duration = 1500; // 1.5 seconds
      const increment = target / (duration / 16); // Assuming 60fps (1000/16)
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      requestAnimationFrame(updateCounter);
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    statsCounters.forEach((counter) => {
      statObserver.observe(counter);
    });
  }

  // Blog filtering functionality
  const blogFilterButtons = document.querySelectorAll(".blog-filters .filter-btn");
  const blogCards = document.querySelectorAll(".blog-card");

  if (blogFilterButtons.length > 0 && blogCards.length > 0) {
    blogFilterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        blogFilterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        const selectedCategory = this.getAttribute("data-category");

        blogCards.forEach((card) => {
          const cardCategories = card.getAttribute("data-category").split(" ");
          
          if (selectedCategory === "all" || cardCategories.includes(selectedCategory)) {
            // Show card with animation
            card.style.display = "flex";
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            
            // Trigger reflow for smooth transition
            void card.offsetWidth;
            
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            // Hide card with animation
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
});
