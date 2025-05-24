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

  // Animación para las estadísticas
  const statsSection = document.querySelector(".portfolio-stats");
  if (statsSection) {
    const statNumbers = statsSection.querySelectorAll(".stat-number");
    let animationStarted = false;

    function animateCounters() {
      if (animationStarted || statNumbers.length === 0) return;
      animationStarted = true;

      statNumbers.forEach((numberElement) => {
        const targetText = numberElement.textContent || "0";
        const isPercentage = targetText.includes("%");
        const isPlus = targetText.includes("+");
        const target = parseInt(targetText.replace(/\D/g, "")); // Extraer solo números

        if (isNaN(target)) return;

        let count = 0;
        const duration = 2000;
        let stepTime = Math.abs(Math.floor(duration / target));
        if (target === 0) stepTime = duration; // Evitar división por cero
        if (stepTime < 20) stepTime = 20; // Mínimo tiempo de paso para que sea visible

        const timer = setInterval(() => {
          count++;
          if (count > target) count = target; // Asegurar que no exceda

          let displayText = count.toString();
          if (isPlus) displayText = "+" + displayText;
          if (isPercentage) displayText += "%";
          // Si el original era 24/7, mantenerlo
          if (targetText === "24/7") displayText = "24/7";

          numberElement.textContent = displayText;

          if (count >= target && targetText !== "24/7") {
            clearInterval(timer);
            numberElement.textContent = targetText; // Restaurar original para mantener + o %
          }
          if (count >= target && targetText === "24/7") {
            // Caso especial para 24/7
            clearInterval(timer);
          }
        }, stepTime);
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

// Importar Supabase client (asegúrate de que este archivo exista y esté configurado)
// La importación dinámica puede ser necesaria si script.js no es un módulo
let supabaseClient = null;
try {
  const supabaseModule = await import("./js/supabaseClient.js");
  supabaseClient = supabaseModule.supabase;
} catch (e) {
  console.error("Error al cargar supabaseClient.js:", e);
  // Podrías mostrar un mensaje al usuario aquí si la carga falla
}

document.addEventListener("DOMContentLoaded", () => {
  // ... (código existente de DOMContentLoaded)
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

  // Lógica de autenticación y dashboard
  if (supabaseClient) {
    handleAuth();
    if (document.body.classList.contains("page-dashboard")) {
      setupDashboardNavigation();
      checkAuthStatusAndProtectDashboard(); // Nueva función
    }
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
});

// --- Funciones de Autenticación y Dashboard ---

async function handleAuth() {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const logoutButton = document.getElementById("logout-button");
  const authErrorElement = document.getElementById("auth-error");
  const authSuccessElement = document.getElementById("auth-success");

  // Elementos de navegación para control de visibilidad
  const loginNavLink = document.getElementById("login-nav-link");
  const registroNavLink = document.getElementById("registro-nav-link");
  const dashboardNavLink = document.getElementById("dashboard-nav-link");
  const logoutNavLink = document.getElementById("logout-nav-link");
  const logoutButtonNav = document.getElementById("logout-button-nav"); // Botón de cerrar sesión en el nav

  // Función para actualizar la visibilidad de los enlaces del menú
  function updateNavLinksVisibility(session) {
    if (loginNavLink)
      loginNavLink.style.display = session ? "none" : "list-item";
    if (registroNavLink)
      registroNavLink.style.display = session ? "none" : "list-item";
    if (dashboardNavLink)
      dashboardNavLink.style.display = session ? "list-item" : "none";
    if (logoutNavLink)
      logoutNavLink.style.display = session ? "list-item" : "none";
  }

  const displayAuthError = (message) => {
    if (authErrorElement) {
      authErrorElement.textContent = message;
      authErrorElement.style.display = "block";
    }
    if (authSuccessElement) authSuccessElement.style.display = "none";
  };

  const displayAuthSuccess = (message) => {
    if (authSuccessElement) {
      authSuccessElement.textContent = message;
      authSuccessElement.style.display = "block";
    }
    if (authErrorElement) authErrorElement.style.display = "none";
  };

  // Registro
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = registerForm.email.value;
      const password = registerForm.password.value;
      const confirmPassword = registerForm["confirm-password"].value;

      if (password !== confirmPassword) {
        displayAuthError("Las contraseñas no coinciden.");
        return;
      }
      if (password.length < 6) {
        displayAuthError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        // Se podría redirigir a login o mostrar mensaje de verificar email
        // Por ahora, un mensaje de éxito y se queda en la página.
        displayAuthSuccess(
          "¡Registro exitoso! Revisa tu correo para confirmar tu cuenta. Luego puedes iniciar sesión."
        );
        registerForm.reset();
        // Opcionalmente, redirigir a login después de un delay:
        // setTimeout(() => { window.location.href = 'login.html'; }, 3000);
      } catch (error) {
        console.error("Error en el registro:", error);
        displayAuthError(error.message || "Error durante el registro.");
      }
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        // Redirigir al dashboard al iniciar sesión
        window.location.href = "dashboard-cliente.html";
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        displayAuthError(
          error.message || "Error al iniciar sesión. Verifica tus credenciales."
        );
      }
    });
  }

  // Logout
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        // Redirigir a la página de inicio o login al cerrar sesión
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión."); // O un mensaje más amigable
      }
    });
  }

  // Añadir listener al nuevo botón de logout en el nav
  if (logoutButtonNav) {
    logoutButtonNav.addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = "login.html"; // Redirigir después de cerrar sesión
      } catch (error) {
        console.error("Error al cerrar sesión desde el nav:", error);
        alert("Error al cerrar sesión.");
      }
    });
  }

  // Llamada inicial para establecer la visibilidad de los enlaces al cargar la página
  supabaseClient.auth
    .getSession()
    .then(({ data: { session } }) => {
      updateNavLinksVisibility(session);
    })
    .catch((err) => console.error("Error al obtener sesión inicial:", err));

  // Listener para cambios de estado de autenticación (opcional pero útil)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event, session);
    // Podrías usar esto para actualizar la UI dinámicamente
    // Por ejemplo, si el token expira y el usuario es deslogueado.
    if (
      event === "SIGNED_OUT" &&
      document.body.classList.contains("page-dashboard")
    ) {
      window.location.href = "login.html";
    }
    if (
      event === "SIGNED_IN" &&
      (window.location.pathname.includes("login.html") ||
        window.location.pathname.includes("registro.html"))
    ) {
      window.location.href = "dashboard-cliente.html";
    }
  });
}

async function checkAuthStatusAndProtectDashboard() {
  if (!document.body.classList.contains("page-dashboard")) return;

  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Error obteniendo sesión:", error);
    // Considerar redirigir a login o mostrar un error genérico.
    // window.location.href = 'login.html';
    return;
  }

  if (!session) {
    console.log("No hay sesión activa, redirigiendo a login.");
    window.location.href = "login.html";
  } else {
    console.log("Sesión activa, usuario:", session.user.email);
    const userNamePlaceholder = document.getElementById(
      "user-name-placeholder"
    );
    if (userNamePlaceholder && session.user && session.user.email) {
      userNamePlaceholder.textContent = session.user.email.split("@")[0]; // Muestra parte del email como nombre
    }
    // Podrías cargar datos específicos del usuario aquí
  }
}

function setupDashboardNavigation() {
  const navLinks = document.querySelectorAll(".dashboard-nav a");
  const pages = document.querySelectorAll(".dashboard-page");

  if (!navLinks.length || !pages.length) return;

  // Función para mostrar la página seleccionada
  function showPage(targetId) {
    pages.forEach((page) => {
      page.classList.remove("active");
      if (page.id === targetId) {
        page.classList.add("active");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${targetId}`) {
        link.classList.add("active");
      }
    });
  }

  // Mostrar la página por defecto (o la del hash en la URL)
  const initialPageId = window.location.hash
    ? window.location.hash.substring(1)
    : "perfil";
  const pageExists = Array.from(pages).some((p) => p.id === initialPageId);
  showPage(pageExists ? initialPageId : "perfil");

  // Event listeners para los enlaces de navegación
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1); // Quita el '#'
      if (targetId) {
        // Asegura que no sea un enlace externo o vacío
        e.preventDefault();
        showPage(targetId);
        window.location.hash = targetId; // Actualizar hash para deep linking y refresco
      }
    });
  });

  // Escuchar cambios en el hash para navegación con botones de atrás/adelante del navegador
  window.addEventListener("hashchange", () => {
    const hashPageId = window.location.hash.substring(1);
    const hashPageExists = Array.from(pages).some((p) => p.id === hashPageId);
    showPage(hashPageExists ? hashPageId : "perfil");
  });
}

// Es importante añadir una clase al body de dashboard-cliente.html para que la lógica específica se active
// Por ejemplo: <body class="page-dashboard">
// En login.html y registro.html también podría ser útil tener clases como <body class="page-auth page-login">

// ... (código existente de scroll, chat, etc.)
// Scroll suave para anclas (ya existe, asegurarse que no entre en conflicto)
// Código del chat (ya existe)
