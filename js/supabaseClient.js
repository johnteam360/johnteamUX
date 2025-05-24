import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

// Usamos las variables de entorno con el prefijo VITE_
// siguiendo las convenciones de Vite
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gaaeixihnhcnxgxbufum.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Si no hay clave, mostramos un error para alertar al desarrollador
if (!SUPABASE_ANON_KEY) {
  console.error(
    "[supabaseClient.js] ERROR: No se ha configurado VITE_SUPABASE_ANON_KEY"
  );
  console.error(
    "[supabaseClient.js] Por favor, configura las variables de entorno necesarias"
  );
}

console.log("[supabaseClient.js] Intentando crear cliente Supabase...");
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log(
  "[supabaseClient.js] Cliente Supabase inicializado y exportado:",
  supabase ? "OK" : "Error"
);

// Añadimos un evento de carga para confirmar que el script se carga completamente
window.addEventListener("load", () => {
  console.log(
    "[supabaseClient.js] Evento window.load: Script completamente cargado"
  );
});
