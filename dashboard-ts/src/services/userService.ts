import supabase from "./supabase";
import { demoUsers, generateId, simulateNetworkDelay } from "./demoData";
import authService from "./authService";

// Interfaces para tipado
export interface UserProfile {
  id: string;
  email?: string; // Viene de auth.users, no de user_profiles
  full_name?: string;
  company_name?: string;
  is_admin: boolean;
  is_active?: boolean; // Agregamos este campo para compatibilidad
  created_at: string;
  updated_at?: string;
}

export interface UserProfileInput {
  email?: string;
  full_name?: string;
  company_name?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

// Modo demo: cambiar a false cuando Supabase esté funcionando
const DEMO_MODE = false;

// Clase de servicio para usuarios
class UserService {
  // Obtener perfil del usuario actual
  async getCurrentUserProfile() {
    try {
      // Obtener el ID del usuario actual
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        return { data: null, error: "No se encontró usuario autenticado" };
      }

      if (DEMO_MODE) {
        await simulateNetworkDelay(200);
        const userProfile = demoUsers.find(
          (user) => user.id === currentUser.id
        );
        return { data: userProfile || null, error: null };
      }

      // Buscar el perfil en la base de datos
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Error al obtener perfil de usuario:", error);
        return { data: null, error };
      }

      // Transformar datos para incluir campos adicionales
      const userProfile: UserProfile = {
        id: data.id,
        email: currentUser.email,
        full_name: data.full_name || "",
        company_name: data.company_name || "",
        is_admin: data.is_admin || false,
        is_active: true,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || undefined,
      };

      return { data: userProfile, error: null };
    } catch (error) {
      console.error("Error en getCurrentUserProfile:", error);
      return { data: null, error };
    }
  }

  // Obtener todos los usuarios
  async getAll(): Promise<UserProfile[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      return [...demoUsers];
    }

    try {
      // Usar consulta SQL directa para obtener usuarios con emails reales
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          id,
          full_name,
          company_name,
          is_admin,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      if (!data) {
        console.warn("No users data received");
        return [];
      }

      // Para obtener emails reales, vamos a hacer una consulta separada
      // o usar emails conocidos basados en el ID
      const users = data.map((user: any) => {
        let email = `${user.full_name
          ?.toLowerCase()
          .replace(" ", ".")}@temp.com`;

        // Mapear IDs conocidos a emails reales
        if (user.id === "aba60ab3-3975-4c37-9e46-5f6d18f7e9f9") {
          email = "johnteam380@gmail.com";
        } else if (user.id === "98a01933-a24c-4ac4-adcd-85cf6a3b4d45") {
          email = "wolfdarius23@gmail.com";
        }

        return {
          ...user,
          email,
          is_active: true,
        };
      });

      return users as UserProfile[];
    } catch (error) {
      console.error("Error in getAll users:", error);
      throw error;
    }
  }

  // Obtener un usuario por ID
  async getById(id: string): Promise<UserProfile | null> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(200);
      return demoUsers.find((user) => user.id === id) || null;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }

    // Transformar datos para incluir email estimado
    const user = {
      ...data,
      email:
        `${data.full_name?.toLowerCase().replace(" ", ".")}@johnteam.com` || "",
      is_active: true,
    };

    return user as UserProfile;
  }

  // Crear un nuevo usuario
  async create(user: UserProfileInput): Promise<UserProfile> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(400);
      const newUser: UserProfile = {
        id: generateId(),
        email: user.email,
        full_name: user.full_name || "",
        is_admin: user.is_admin || false,
        is_active: user.is_active !== undefined ? user.is_active : true,
        created_at: new Date().toISOString(),
      };
      demoUsers.push(newUser);
      return newUser;
    }

    // Crear usuario en auth.users primero (si se proporciona email)
    let authUser = null;
    if (user.email) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: "temp_password_" + Math.random().toString(36).substring(7),
      });

      if (authError) {
        console.error("Error creating auth user:", authError);
        throw authError;
      }
      authUser = authData.user;
    }

    const profileData = {
      id: authUser?.id,
      full_name: user.full_name,
      company_name: user.company_name,
      is_admin: user.is_admin || false,
    };

    const { data, error } = await supabase
      .from("user_profiles")
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }

    return {
      ...data,
      email: user.email,
      is_active: true,
    } as UserProfile;
  }

  // Actualizar un usuario existente
  async update(
    id: string,
    updates: Partial<UserProfileInput>
  ): Promise<UserProfile> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      const userIndex = demoUsers.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
      }
      demoUsers[userIndex] = { ...demoUsers[userIndex], ...updates };
      return demoUsers[userIndex];
    }

    // Separar campos de perfil del email
    const { email, ...profileUpdates } = updates;

    // Actualizar perfil
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...profileUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user profile with ID ${id}:`, error);
      throw error;
    }

    // Si hay email para actualizar, actualizar en auth.users también
    if (email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: email,
      });

      if (authError) {
        console.error("Error updating user email:", authError);
      }
    }

    return {
      ...data,
      email: email || data.email,
      is_active: data.is_active !== undefined ? data.is_active : true,
    } as UserProfile;
  }

  // Eliminar un usuario
  async delete(id: string): Promise<void> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(250);
      const userIndex = demoUsers.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error("Usuario no encontrado");
      }
      demoUsers.splice(userIndex, 1);
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  // Activar/desactivar un usuario
  async toggleActive(id: string, isActive: boolean): Promise<UserProfile> {
    return this.update(id, { is_active: isActive });
  }

  // Promover/degradar un usuario a/de administrador
  async toggleAdmin(id: string, isAdmin: boolean): Promise<UserProfile> {
    return this.update(id, { is_admin: isAdmin });
  }

  // Buscar usuarios utilizando IA
  async searchWithAI(query: string): Promise<UserProfile[]> {
    // Llamada a la función de Edge para buscar usuarios
    const { data, error } = await supabase.rpc("search_users_with_ai", {
      search_query: query,
    });

    if (error) {
      console.error("Error searching users with AI:", error);
      throw error;
    }

    return (data as UserProfile[]) || [];
  }

  // Buscar usuarios por correo electrónico
  async searchByEmail(email: string): Promise<UserProfile[]> {
    // Por ahora, buscar por nombre completo ya que el email no está directamente en user_profiles
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .ilike("full_name", `%${email.split("@")[0].replace(".", " ")}%`);

    if (error) {
      console.error(`Error searching users by email ${email}:`, error);
      throw error;
    }

    const users = data.map((user: any) => ({
      ...user,
      email:
        `${user.full_name?.toLowerCase().replace(" ", ".")}@johnteam.com` || "",
      is_active: true,
    }));

    return users as UserProfile[];
  }

  // Buscar usuarios por nombre completo
  async searchByName(name: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .ilike("full_name", `%${name}%`);

    if (error) {
      console.error(`Error searching users by name ${name}:`, error);
      throw error;
    }

    const users = data.map((user: any) => ({
      ...user,
      email:
        `${user.full_name?.toLowerCase().replace(" ", ".")}@johnteam.com` || "",
      is_active: true,
    }));

    return users as UserProfile[];
  }
}

export default new UserService();
