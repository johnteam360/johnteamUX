import supabase from "../lib/supabase";
import type { Tables } from "../types/supabase";
import type { User } from "@supabase/supabase-js";

// Extender el tipo UserProfile para incluir los nuevos campos
export type UserProfile = Tables<"user_profiles"> & {
  email?: string | null;
  project_objective?: string | null;
  industry?: string | null;
  expected_timeline?: string | null;
};

// Interfaz para el perfil de usuario con los nuevos campos
export interface UserProfileInput {
  id: string;
  full_name?: string | null;
  company_name?: string | null;
  is_admin?: boolean | null;
  project_objective?: string | null;
  industry?: string | null;
  expected_timeline?: string | null;
  email?: string | null;
}

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

        // Si el perfil no existe, intentamos crearlo con los datos de user_metadata
        if (error.code === 'PGRST116') { // No data found
          console.log("Perfil no encontrado, creando uno nuevo");
          const userData = user.user_metadata || {};

          // Crear un perfil básico si no existe
          const profileData: UserProfileInput = {
            id: user.id,
            full_name: userData.full_name,
            company_name: userData.company_name,
            email: user.email,
            is_admin: false
          };

          return await this.createUserProfile(profileData);
        }

        return null;
      }

      // Añadir email del usuario al perfil si no existe
      if (!profile.email && user.email) {
        // Actualizar el perfil con el email
        await supabase
          .from("user_profiles")
          .update({ email: user.email })
          .eq("id", user.id);

        profile.email = user.email;
      }

      return {
        ...profile,
        email: profile.email || user.email
      };
    } catch (error) {
      console.error("❌ Error en getCurrentUserProfile:", error);
      return null;
    }
  }

  // Crear o actualizar perfil de usuario
  static async createUserProfile(profileData: UserProfileInput): Promise<UserProfile | null> {
    try {
      console.log("Creando/actualizando perfil para usuario:", profileData.id);
      console.log("Datos del perfil:", JSON.stringify(profileData, null, 2));

      // Asegurarse de que el email esté incluido
      if (!profileData.email) {
        const user = await this.getCurrentUser();
        if (user && user.email) {
          profileData.email = user.email;
          console.log("Añadido email del usuario actual:", user.email);
        }
      }

      // Intentar actualizar primero (más probable que funcione con RLS)
      let updateResult;
      try {
        const { data: existingProfile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", profileData.id)
          .single();

        if (existingProfile) {
          console.log("Perfil existente encontrado, actualizando...");
          updateResult = await supabase
            .from("user_profiles")
            .update(profileData)
            .eq("id", profileData.id)
            .select()
            .single();

          if (updateResult.error) {
            console.error("Error al actualizar perfil:", updateResult.error);
          } else if (updateResult.data) {
            console.log("Perfil actualizado correctamente:", updateResult.data);
            return updateResult.data;
          }
        }
      } catch (updateError) {
        console.log("No se encontró perfil existente o error al actualizar:", updateError);
      }

      // Si la actualización no funcionó o no hay perfil, intentar upsert
      console.log("Intentando upsert del perfil...");
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(profileData, {
          onConflict: "id",
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Error al crear/actualizar perfil:", error);

        // En caso de errores RLS, intentamos un enfoque alternativo
        if (error.code === 'PGRST301') {
          console.warn("Advertencia: Problemas con permisos RLS, intentando insert directo");

          // Último intento - inserción directa
          const insertResult = await supabase
            .from("user_profiles")
            .insert(profileData)
            .select()
            .single();

          if (insertResult.error) {
            console.error("Falló el último intento de inserción:", insertResult.error);
            // Devolvemos los datos que intentamos insertar como fallback
            return profileData as UserProfile;
          } else if (insertResult.data) {
            console.log("Perfil creado mediante inserción directa:", insertResult.data);
            return insertResult.data;
          }

          // Si llegamos aquí, devolvemos el perfil como fallback
          return profileData as UserProfile;
        }

        throw error;
      }

      if (import.meta.env.DEV) {
        console.log("✅ Perfil creado/actualizado exitosamente:", data);
      }

      return data;
    } catch (error) {
      console.error("❌ Error en createUserProfile:", error);
      throw error;
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

      // Verificar el perfil de usuario después de iniciar sesión
      if (data.user) {
        const profile = await this.getCurrentUserProfile();

        // Si no existe un perfil, intentar crearlo con los datos básicos
        if (!profile) {
          await this.createUserProfile({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name,
            company_name: data.user.user_metadata?.company_name,
            email: data.user.email,
            is_admin: false
          });
        } else if (!profile.email && data.user.email) {
          // Actualizar el email en el perfil si no existe
          await this.createUserProfile({
            ...profile,
            id: data.user.id,
            email: data.user.email
          });
        }
      }

      return data;
    } catch (error) {
      console.error("❌ Error en signIn:", error);
      throw error;
    }
  }

  // Registrar usuario
  static async signUp(email: string, password: string, userData?: Partial<UserProfileInput>) {
    try {
      console.log("Iniciando registro de usuario con email:", email);

      // 1. Registrar usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            email: email,
          },
        },
      });

      if (error) {
        console.error("❌ Error al registrar usuario:", error);
        throw error;
      }

      if (!data.user) {
        console.error("❌ No se pudo crear el usuario");
        throw new Error("No se pudo crear el usuario");
      }

      // Verificar si el usuario ya existía (identities vacío es una señal)
      if (data.user.identities && data.user.identities.length === 0) {
        console.warn("⚠️ Intento de registro con email ya existente:", email);
        throw new Error("User already registered");
      }

      console.log("✅ Usuario registrado en Auth:", data.user.id);

      // 2. Intentar crear perfil inmediatamente (puede que no funcione por confirmación de email)
      try {
        console.log("Intentando crear perfil para usuario:", data.user.id);

        const profileData: UserProfileInput = {
          id: data.user.id,
          ...userData,
          email: email,
          is_admin: false,
        };

        // Intentar crear el perfil
        await this.createUserProfile(profileData);
        console.log("✅ Perfil de usuario creado o actualizado");
      } catch (profileError) {
        // No lanzar error, ya que el usuario podría completar su perfil después
        console.warn("⚠️ No se pudo crear el perfil de usuario automáticamente:", profileError);
        console.log("El usuario deberá completar su perfil después de confirmar su email");
      }

      return data;
    } catch (error) {
      console.error("❌ Error en signUp:", error);
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
