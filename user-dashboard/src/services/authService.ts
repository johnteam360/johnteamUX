import supabase from "../lib/supabase";
import type { Tables } from "../types/supabase";
import type { User } from "@supabase/supabase-js";

export type UserProfile = Tables<"user_profiles">;

export class AuthService {
  // Obtener el usuario actual
  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("❌ Error al obtener usuario:", error);
        return null;
      }

      return user;
    } catch (error) {
      console.error("❌ Error en getCurrentUser:", error);
      return null;
    }
  }

  // Obtener el perfil del usuario actual
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = await this.getCurrentUser();

      if (!user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("❌ Error al obtener perfil:", error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error("❌ Error en getCurrentUserProfile:", error);
      return null;
    }
  }

  // Iniciar sesión
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Error al iniciar sesión:", error);
        throw error;
      }

      if (import.meta.env.DEV) {
        console.log("✅ Sesión iniciada exitosamente");
      }
      return data;
    } catch (error) {
      console.error("❌ Error en signIn:", error);
      throw error;
    }
  }

  // Cerrar sesión
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ Error al cerrar sesión:", error);
        throw error;
      }

      if (import.meta.env.DEV) {
        console.log("✅ Sesión cerrada exitosamente");
      }
    } catch (error) {
      console.error("❌ Error en signOut:", error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error("❌ Error en isAuthenticated:", error);
      return false;
    }
  }

  // Escuchar cambios en el estado de autenticación
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (import.meta.env.DEV) {
        console.log(
          "🔄 Cambio en autenticación:",
          event,
          session?.user ? "Usuario autenticado" : "Usuario no autenticado"
        );
      }
      callback(session?.user || null);
    });
  }
}
