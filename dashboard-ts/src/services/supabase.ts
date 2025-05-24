import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Interfaces para tipado
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  headers: Record<string, string>;
}

// Usar variables de entorno para la configuración
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaaeixihnhcnxgxbufum.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYWVpeGlobmhjbnhneGJ1ZnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzY4MjEsImV4cCI6MjA2MzQxMjgyMX0.fiDvf1TJ_C87ZCMU8yEVNRFckOenp8eq2eAWbotPfBs";

// Validar que las variables estén definidas
if (!supabaseUrl) {
  throw new Error(
    "❌ VITE_SUPABASE_URL no está definida en las variables de entorno"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "❌ VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno"
  );
}

let supabase: SupabaseClient<Database>;

try {
  // Creación del cliente Supabase con tipos
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  // Solo log en desarrollo
  if (import.meta.env.DEV) {
    console.log("✅ Cliente Supabase inicializado correctamente");
  }

  // Verificar la conexión
  supabase.auth.onAuthStateChange((event, session) => {
    if (import.meta.env.DEV) {
      console.log(
        "🔄 Evento de autenticación:",
        event,
        session ? "Usuario autenticado" : "Usuario no autenticado"
      );
    }
  });
} catch (error) {
  console.error("❌ Error al crear cliente Supabase:", error);
  throw error;
}

export default supabase;
