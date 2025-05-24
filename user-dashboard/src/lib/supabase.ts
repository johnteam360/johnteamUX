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

// Crear cliente Supabase
const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export default supabase;
