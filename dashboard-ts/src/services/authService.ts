import supabase from "./supabase";
import { User, Session, AuthResponse } from "@supabase/supabase-js";

// Interfaces para tipado
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  full_name: string;
}

// Clase de servicio para autenticación
class AuthService {
  // Iniciar sesión con email y contraseña
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
  }

  // Registrar un nuevo usuario
  async register(userData: RegisterData): Promise<AuthResponse> {
    // Crear el usuario en autenticación
    const authResponse = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    // Si el registro es exitoso, añadir el usuario a la tabla profiles
    if (authResponse.data.user) {
      await supabase.from("profiles").insert({
        id: authResponse.data.user.id,
        email: userData.email,
        full_name: userData.full_name,
        is_admin: false,
        is_active: true,
      });
    }

    return authResponse;
  }

  // Cerrar sesión
  async logout(): Promise<{ error: Error | null }> {
    return await supabase.auth.signOut();
  }

  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  // Obtener la sesión actual
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
}

export default new AuthService();
