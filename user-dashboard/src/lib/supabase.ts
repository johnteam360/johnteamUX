import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Configuración de Supabase para el dashboard de usuario
// Usando variables de entorno con prefijo VITE_
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaaeixihnhcnxgxbufum.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYWVpeGlobmhjbnhneGJ1ZnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzY4MjEsImV4cCI6MjA2MzQxMjgyMX0.fiDvf1TJ_C87ZCMU8yEVNRFckOenp8eq2eAWbotPfBs";

// Verificar que las variables estén definidas
if (!supabaseAnonKey) {
  console.error(
    "❌ Error: VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno"
  );
}

// Solo mostrar logs en desarrollo
if (import.meta.env.DEV) {
  console.log("🔗 Dashboard Usuario - Conectando a Supabase...");
  console.log("📍 URL:", supabaseUrl);
  console.log(
    "🔑 Key (primeros 50):",
    supabaseAnonKey.substring(0, 50) + "..."
  );
}

// Obtener la URL base para cookies
const getBaseUrl = () => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'localhost';
  }

  // En producción, obtener el dominio base
  try {
    const url = new URL(window.location.href);
    return url.hostname;
  } catch (error) {
    console.error("Error al obtener el dominio base:", error);
    return window.location.hostname;
  }
};

// Configuración avanzada para el cliente
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'johnteam-auth-storage',
    storage: {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error al acceder a localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error al escribir en localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error al eliminar de localStorage:', error);
        }
      },
    },
    cookieOptions: {
      domain: getBaseUrl(),
      path: '/',
      sameSite: 'Lax',
      secure: !import.meta.env.DEV,
    },
  },
};

// Crear cliente Supabase con opciones mejoradas
const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseOptions
);

// Verificar conexión y establecer manejador de eventos de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  console.log("📊 Estado de autenticación:", event, session ? "Activa" : "Inactiva");

  // Log adicional para depuración
  if (event === 'SIGNED_IN') {
    console.log("✅ Usuario ha iniciado sesión:", session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log("⚠️ Usuario ha cerrado sesión");
  } else if (event === 'TOKEN_REFRESHED') {
    console.log("🔄 Token de sesión actualizado");
  } else if (event === 'USER_UPDATED') {
    console.log("👤 Datos de usuario actualizados");
  }
});

// Verificar sesión al cargar
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("❌ Error al verificar sesión:", error.message);
    } else if (data?.session) {
      console.log("✅ Sesión encontrada:", data.session.user.email);
    } else {
      console.log("ℹ️ No hay sesión activa");
    }
  } catch (err) {
    console.error("❌ Error al verificar sesión:", err);
  }
})();

export default supabase;
