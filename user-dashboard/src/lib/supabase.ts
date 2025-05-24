import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Configuración de Supabase para el dashboard de usuario
// Usando variables de entorno con prefijo VITE_
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaaeixihnhcnxgxbufum.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

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
