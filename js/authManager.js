console.log("[authManager.js] Comenzando carga del script");

import { supabase } from "./supabaseClient.js";
// Importamos loadUserProjects desde dashboardHandler.js
import { loadUserProjects } from "./dashboardHandler.js";

try {
  console.log(
    "[authManager.js] Script cargado e importando Supabase:",
    supabase ? "Éxito" : "Fallo"
  );

  // AÑADIMOS UN LOG PARA VERIFICAR LA IMPORTACIÓN DE loadUserProjects
  console.log(
    "[authManager.js] loadUserProjects importado:",
    typeof loadUserProjects === "function" ? "Éxito" : "Fallo"
  );

  // --- Elementos del DOM ---
  const authSection = document.getElementById("auth-section");
  const dashboardContentWrapper = document.getElementById(
    "dashboard-content-wrapper"
  );

  const loginFormContainer = document.getElementById("login-form-container");
  const signupFormContainer = document.getElementById("signup-form-container");

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  const showSignupButton = document.getElementById("show-signup");
  const showLoginButton = document.getElementById("show-login");

  const authMessage = document.getElementById("auth-message");

  const logoutButtonSidebar = document.getElementById("logout-button-sidebar");
  const logoutButtonNavbar = document.getElementById("logout-button-navbar");
  const userNamePlaceholder = document.getElementById("user-name-placeholder");

  // --- Comprobación inicial de elementos DOM ---
  if (
    !authSection ||
    !dashboardContentWrapper ||
    !loginForm ||
    !signupForm ||
    !showSignupButton ||
    !showLoginButton ||
    !authMessage ||
    !logoutButtonSidebar ||
    !logoutButtonNavbar ||
    !userNamePlaceholder ||
    !loginFormContainer ||
    !signupFormContainer
  ) {
    console.error(
      "[authManager.js] Error crítico: Uno o más elementos del DOM no se encontraron. Verifica los IDs en dashboard-cliente.html."
    );
  }

  // --- Funciones de UI ---
  function displayAuthMessage(message, isError = false) {
    if (authMessage) {
      authMessage.textContent = message;
      authMessage.className = isError
        ? "text-danger text-center mt-3"
        : "text-success text-center mt-3";
    }
  }

  function updateUI(session) {
    console.log("[authManager.js] updateUI llamado con sesión:", session);
    if (!authSection || !dashboardContentWrapper) {
      console.error(
        "[authManager.js] updateUI: authSection o dashboardContentWrapper no encontrados."
      );
      return;
    }

    if (session && session.user) {
      console.log("[authManager.js] Usuario autenticado:", session.user.email);
      authSection.style.display = "none";
      dashboardContentWrapper.style.display = "block";
      if (userNamePlaceholder) {
        userNamePlaceholder.textContent = `Hola, ${session.user.email}`; // O user.user_metadata.full_name si se configura
      }

      // Aquí llamaremos a loadUserProjects cuando esté listo
      // if (typeof loadUserProjects === 'function') {
      //     console.log("[authManager.js] Llamando a loadUserProjects.");
      //     loadUserProjects(session.user.id); // Pasamos el supabase client implicitamente si dashboardHandler lo importa
      // } else {
      //     console.warn("[authManager.js] loadUserProjects no está disponible todavía.");
      // }
    } else {
      console.log("[authManager.js] Usuario NO autenticado o sesión expirada.");
      authSection.style.display = "block";
      dashboardContentWrapper.style.display = "none";
      if (loginFormContainer) loginFormContainer.style.display = "block";
      if (signupFormContainer) signupFormContainer.style.display = "none";
    }
  }

  // --- Manejadores de Eventos de Autenticación ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = loginForm.elements["login-email"].value;
      const password = loginForm.elements["login-password"].value;
      console.log(`[authManager.js] Intento de login con email: ${email}`);
      displayAuthMessage("Iniciando sesión...", false);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error(
            "[authManager.js] Error en signInWithPassword:",
            error.message
          );
          displayAuthMessage(`Error: ${error.message}`, true);
        } else {
          console.log(
            "[authManager.js] signInWithPassword exitoso. Data:",
            data
          );
          displayAuthMessage("Inicio de sesión exitoso.", false);
          // onAuthStateChange se encargará de llamar a updateUI
        }
      } catch (e) {
        console.error("[authManager.js] Excepción en submit de login:", e);
        displayAuthMessage("Error crítico al iniciar sesión.", true);
      }
      loginForm.reset();
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fullName = signupForm.elements["signup-fullname"]
        ? signupForm.elements["signup-fullname"].value
        : "";
      const email = signupForm.elements["signup-email"].value;
      const password = signupForm.elements["signup-password"].value;
      console.log(`[authManager.js] Intento de signup con email: ${email}`);
      displayAuthMessage("Creando cuenta...", false);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) {
          console.error("[authManager.js] Error en signUp:", error.message);
          displayAuthMessage(`Error al registrar: ${error.message}`, true);
        } else if (
          data.user &&
          data.user.identities &&
          data.user.identities.length === 0
        ) {
          displayAuthMessage(
            "Este usuario ya existe. Por favor, inicia sesión o revisa tu correo para confirmación.",
            true
          );
        } else if (data.session === null && data.user) {
          // Caso de email no confirmado
          displayAuthMessage(
            "¡Registro exitoso! Revisa tu correo para confirmar la cuenta.",
            false
          );
        } else if (data.user) {
          // Caso de auto-confirmación o ya confirmado
          displayAuthMessage("¡Registro exitoso! Serás redirigido.", false);
          // onAuthStateChange se encargará de llamar a updateUI
        } else {
          displayAuthMessage(
            "Respuesta inesperada del registro. Intenta de nuevo.",
            true
          );
        }
      } catch (e) {
        console.error("[authManager.js] Excepción en submit de signup:", e);
        displayAuthMessage("Error crítico durante el registro.", true);
      }
      signupForm.reset();
    });
  }

  if (logoutButtonSidebar) {
    logoutButtonSidebar.addEventListener("click", async () => {
      console.log("[authManager.js] Click en logout (sidebar)");
      displayAuthMessage("Cerrando sesión...", false);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[authManager.js] Error en signOut:", error.message);
        displayAuthMessage(`Error al cerrar sesión: ${error.message}`, true);
      } else {
        console.log("[authManager.js] signOut exitoso.");
        // onAuthStateChange se encargará de llamar a updateUI
      }
    });
  }
  if (logoutButtonNavbar) {
    logoutButtonNavbar.addEventListener("click", async () => {
      console.log("[authManager.js] Click en logout (navbar)");
      displayAuthMessage("Cerrando sesión...", false);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[authManager.js] Error en signOut:", error.message);
        displayAuthMessage(`Error al cerrar sesión: ${error.message}`, true);
      } else {
        console.log("[authManager.js] signOut exitoso.");
        // onAuthStateChange se encargará de llamar a updateUI
      }
    });
  }

  // --- Intercambio de formularios Login/Signup ---
  if (showSignupButton) {
    showSignupButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginFormContainer) loginFormContainer.style.display = "none";
      if (signupFormContainer) signupFormContainer.style.display = "block";
      if (authMessage) authMessage.textContent = ""; // Limpiar mensajes previos
    });
  }

  if (showLoginButton) {
    showLoginButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (signupFormContainer) signupFormContainer.style.display = "none";
      if (loginFormContainer) loginFormContainer.style.display = "block";
      if (authMessage) authMessage.textContent = ""; // Limpiar mensajes previos
    });
  }

  // --- Listener Principal de Estado de Autenticación ---
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(
      "[authManager.js] onAuthStateChange EVENTO:",
      event,
      "SESIÓN:",
      session
    );
    updateUI(session); // Actualiza la UI basada en la sesión (o su ausencia)

    // LLAMAR A loadUserProjects SI HAY UNA SESIÓN ACTIVA
    if (session && session.user) {
      if (typeof loadUserProjects === "function") {
        console.log(
          "[authManager.js] onAuthStateChange: Llamando a loadUserProjects para el usuario:",
          session.user.id
        );
        await loadUserProjects(session.user.id);
      } else {
        console.error(
          "[authManager.js] onAuthStateChange: loadUserProjects no es una función. Revisa la importación desde dashboardHandler.js"
        );
      }
    }
  });

  // --- Comprobación de Sesión Inicial ---
  // Llamamos a getSession para establecer el estado inicial de la UI
  // onAuthStateChange también se disparará con 'INITIAL_SESSION'
  async function checkInitialSession() {
    console.log(
      "[authManager.js] Verificando sesión inicial (checkInitialSession)..."
    );
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log("[authManager.js] Respuesta de getSession:", { data, error });
      if (error) {
        console.error(
          "[authManager.js] Error al obtener sesión inicial:",
          error.message
        );
        updateUI(null); // Asegura que la UI esté en estado 'no autenticado'
      } else {
        // updateUI ya habrá sido llamada por onAuthStateChange con INITIAL_SESSION.
        // Si data.session existe aquí, es porque onAuthStateChange ya lo procesó.
        // No es estrictamente necesario llamar a updateUI(data.session) aquí de nuevo,
        // pero lo hacemos para ser explícitos si INITIAL_SESSION no fuera suficiente o fallara.
        if (!sessionStorage.getItem("initial_session_processed")) {
          console.log(
            "[authManager.js] getSession data.session (si existe, será procesada por onAuthStateChange):",
            data.session
          );
          updateUI(data.session); // Asegura que la UI refleje la sesión si onAuthStateChange no lo hizo (poco probable)
          sessionStorage.setItem("initial_session_processed", "true"); // Para evitar doble procesamiento si es necesario
        }
      }
    } catch (e) {
      console.error("[authManager.js] Excepción en checkInitialSession:", e);
      updateUI(null);
    }
  }

  // Ejecutar la comprobación de sesión cuando el DOM esté listo y este script se cargue.
  // No es necesario 'DOMContentLoaded' si el script se carga al final del body con type="module"
  // ya que el DOM estará disponible.
  checkInitialSession();

  // Limpiar la bandera de sesión inicial al descargar la página (opcional, para pruebas)
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("initial_session_processed");
  });

  console.log(
    "[authManager.js] Script completamente evaluado y listeners configurados."
  );
} catch (globalError) {
  console.error(
    "[authManager.js] Error global en la carga del script:",
    globalError
  );
}
