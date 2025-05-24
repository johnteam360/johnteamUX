import supabase from "../lib/supabase";
import type { Tables } from "../types/supabase";

// Tipos para el dashboard de usuario
export type Project = Tables<"projects">;
export type ProjectUpdate = Tables<"project_updates">;
export type ProjectPhase = Tables<"project_phases">;

export interface ProjectWithDetails extends Project {
  updates?: ProjectUpdate[];
  phases?: ProjectPhase[];
}

export class ProjectService {
  // Obtener proyectos del usuario actual
  static async getUserProjects(): Promise<ProjectWithDetails[]> {
    try {
      console.log("📁 Obteniendo proyectos del usuario...");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Obtener proyectos del usuario
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("❌ Error al obtener proyectos:", projectsError);
        throw projectsError;
      }

      const projectsWithDetails: ProjectWithDetails[] = [];

      // Para cada proyecto, obtener sus updates y fases
      for (const project of projects || []) {
        // Obtener updates del proyecto
        const { data: updates } = await supabase
          .from("project_updates")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false });

        // Obtener fases del proyecto
        const { data: phases } = await supabase
          .from("project_phases")
          .select("*")
          .eq("project_id", project.id)
          .order("position", { ascending: true });

        projectsWithDetails.push({
          ...project,
          updates: updates || [],
          phases: phases || [],
        });
      }

      console.log(`✅ ${projectsWithDetails.length} proyectos encontrados`);
      return projectsWithDetails;
    } catch (error) {
      console.error("❌ Error en getUserProjects:", error);
      throw error;
    }
  }

  // Obtener un proyecto específico con todos sus detalles
  static async getProjectById(
    projectId: string
  ): Promise<ProjectWithDetails | null> {
    try {
      console.log(`📁 Obteniendo proyecto ${projectId}...`);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Obtener el proyecto
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id) // Solo proyectos del usuario
        .single();

      if (projectError) {
        console.error("❌ Error al obtener proyecto:", projectError);
        return null;
      }

      if (!project) {
        return null;
      }

      // Obtener updates del proyecto
      const { data: updates } = await supabase
        .from("project_updates")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });

      // Obtener fases del proyecto
      const { data: phases } = await supabase
        .from("project_phases")
        .select("*")
        .eq("project_id", project.id)
        .order("position", { ascending: true });

      const projectWithDetails: ProjectWithDetails = {
        ...project,
        updates: updates || [],
        phases: phases || [],
      };

      console.log(`✅ Proyecto ${projectId} obtenido exitosamente`);
      return projectWithDetails;
    } catch (error) {
      console.error("❌ Error en getProjectById:", error);
      throw error;
    }
  }

  // Obtener estadísticas del usuario
  static async getUserStats() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const { data: projects } = await supabase
        .from("projects")
        .select("status")
        .eq("user_id", user.id);

      const stats = {
        total: projects?.length || 0,
        activos:
          projects?.filter((p) => p.status === "En Progreso").length || 0,
        completados:
          projects?.filter((p) => p.status === "Completado").length || 0,
        pendientes:
          projects?.filter((p) => p.status === "Pendiente").length || 0,
      };

      return stats;
    } catch (error) {
      console.error("❌ Error en getUserStats:", error);
      return {
        total: 0,
        activos: 0,
        completados: 0,
        pendientes: 0,
      };
    }
  }
}
