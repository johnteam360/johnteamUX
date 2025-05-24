import supabase from "./supabase";
import { UserProfile } from "./userService";
import { Project } from "./projectService";
import {
  demoUsers,
  demoProjects,
  demoAIStats,
  simulateNetworkDelay,
} from "./demoData";

// Interfaces para tipado
export interface AICompletionRequest {
  prompt: string;
  projectId?: string;
}

export interface AISearchRequest {
  query: string;
}

// Modo demo: cambiar a false cuando Supabase esté funcionando
const DEMO_MODE = false;

// Clase de servicio para funcionalidades de IA
class AIService {
  // Generar texto con IA basado en un prompt
  async generateCompletion(request: AICompletionRequest): Promise<string> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(800);

      // Simulación de respuestas de IA basadas en el prompt
      const responses = [
        "Este proyecto tiene como objetivo crear una solución innovadora que mejore la experiencia del usuario mediante tecnologías modernas y un diseño intuitivo. Se implementarán las mejores prácticas de desarrollo para garantizar escalabilidad, rendimiento y mantenibilidad del código.",
        "Desarrollo completo utilizando frameworks modernos como React, Node.js y bases de datos robustas. El proyecto incluye funcionalidades avanzadas de seguridad, autenticación de usuarios y una interfaz responsiva que se adapta a cualquier dispositivo.",
        "Solución integral que abarca desde la planificación hasta la implementación, incluyendo análisis de requisitos, diseño de arquitectura, desarrollo de funcionalidades y pruebas exhaustivas para asegurar la calidad del producto final.",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }

    try {
      // Usar Edge Function ai-assistant
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: {
          type: "project_description",
          prompt: request.prompt,
          max_tokens: 250,
        },
      });

      if (error) {
        console.error("Error calling AI Edge Function:", error);
        // Fallback a función RPC si está disponible
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            "get_ai_completion",
            {
              prompt_input: request.prompt,
              max_tokens_input: 250,
              temperature_input: 0.7,
            }
          );

          if (rpcError) throw rpcError;
          return rpcData || "No se pudo generar una respuesta.";
        } catch (rpcError) {
          console.error("Fallback RPC also failed:", rpcError);
          throw error;
        }
      }

      return data?.description || "No se pudo generar una respuesta.";
    } catch (error) {
      console.error("AI completion failed:", error);
      throw error;
    }
  }

  // Buscar usuarios utilizando IA
  async searchUsers(request: AISearchRequest): Promise<UserProfile[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(600);

      // Simulación de búsqueda inteligente
      const query = request.query.toLowerCase();
      let results = [...demoUsers];

      if (query.includes("admin")) {
        results = results.filter((user) => user.is_admin);
      }
      if (query.includes("activo")) {
        results = results.filter((user) => user.is_active);
      }
      if (query.includes("inactivo")) {
        results = results.filter((user) => !user.is_active);
      }

      return results;
    }

    try {
      // Usar Edge Function ai-assistant para búsqueda de usuarios
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: {
          type: "search_users",
          query: request.query,
        },
      });

      if (error) {
        console.error("Error searching users with AI Edge Function:", error);
        // Realizar búsqueda básica en la base de datos como fallback
        const { data: dbData, error: dbError } = await supabase
          .from("user_profiles")
          .select("*")
          .ilike("full_name", `%${request.query}%`)
          .limit(10);

        if (dbError) {
          console.error("Database search fallback failed:", dbError);
          throw error;
        }

        // Transformar datos para incluir email estimado
        const users = (dbData || []).map((user: any) => ({
          ...user,
          email:
            `${user.full_name?.toLowerCase().replace(" ", ".")}@johnteam.com` ||
            "",
          is_active: true,
        }));

        return users as UserProfile[];
      }

      // Por ahora retornar array vacío ya que la Edge Function no retorna usuarios completos
      return [];
    } catch (error) {
      console.error("AI user search failed:", error);
      throw error;
    }
  }

  // Búsqueda avanzada de proyectos con IA
  async searchProjects(request: AISearchRequest): Promise<Project[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(600);

      // Simulación de búsqueda inteligente
      const query = request.query.toLowerCase();
      let results = [...demoProjects];

      if (query.includes("web")) {
        results = results.filter((project) => project.type === "web");
      }
      if (query.includes("móvil") || query.includes("mobile")) {
        results = results.filter((project) => project.type === "mobile");
      }
      if (query.includes("activo")) {
        results = results.filter((project) => project.status === "active");
      }
      if (query.includes("pendiente")) {
        results = results.filter((project) => project.status === "pending");
      }
      if (query.includes("completado")) {
        results = results.filter((project) => project.status === "completed");
      }

      return results;
    }

    try {
      // Búsqueda básica por nombre de proyecto en la base de datos
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .ilike("name", `%${request.query}%`)
        .limit(10);

      if (error) {
        console.error("Error searching projects:", error);
        throw error;
      }

      return (data as Project[]) || [];
    } catch (error) {
      console.error("AI project search failed:", error);
      throw error;
    }
  }

  // Obtener estadísticas de uso de AI
  async getUsageStats(): Promise<{
    totalCompletions: number;
    totalSearches: number;
  }> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(400);
      return demoAIStats;
    }

    try {
      // Contar interacciones de IA en la base de datos
      const { count, error } = await supabase
        .from("ai_interactions")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error getting AI usage stats:", error);
        throw error;
      }

      return {
        totalCompletions: count || 0,
        totalSearches: count || 0,
      };
    } catch (error) {
      console.error("Failed to get AI usage stats:", error);
      return { totalCompletions: 0, totalSearches: 0 };
    }
  }
}

export default new AIService();
