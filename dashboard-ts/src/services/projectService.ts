import supabase from "./supabase";
import { demoProjects, generateId, simulateNetworkDelay } from "./demoData";

// Interfaces para tipado
export interface Project {
  id: string;
  name: string;
  type?: string;
  status?: string;
  description?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
  document_url?: string; // URL del documento PDF
}

export interface ProjectInput {
  name: string;
  type?: string;
  status?: string;
  description?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  document_url?: string; // URL del documento PDF
}

// Modo demo: cambiar a false cuando Supabase esté funcionando
const DEMO_MODE = false;

// Clase de servicio para proyectos
class ProjectService {
  // Obtener todos los proyectos
  async getAll(): Promise<Project[]> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      return [...demoProjects];
    }

    const { data, error } = await supabase.from("projects").select("*");

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    return data as Project[];
  }

  // Obtener un proyecto por ID
  async getById(id: string): Promise<Project | null> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(200);
      return demoProjects.find((project) => project.id === id) || null;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }

    return data as Project;
  }

  // Crear un nuevo proyecto
  async create(project: ProjectInput): Promise<Project> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(400);
      const newProject: Project = {
        id: generateId(),
        name: project.name,
        type: project.type,
        status: project.status,
        description: project.description || "",
        user_id: project.user_id,
        created_at: new Date().toISOString(),
      };
      demoProjects.push(newProject);
      return newProject;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    return data as Project;
  }

  // Actualizar un proyecto existente
  async update(id: string, updates: Partial<ProjectInput>): Promise<Project> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      const projectIndex = demoProjects.findIndex(
        (project) => project.id === id
      );
      if (projectIndex === -1) {
        throw new Error("Proyecto no encontrado");
      }
      demoProjects[projectIndex] = {
        ...demoProjects[projectIndex],
        ...updates,
      };
      return demoProjects[projectIndex];
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }

    return data as Project;
  }

  // Eliminar un proyecto
  async delete(id: string): Promise<void> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(250);
      const projectIndex = demoProjects.findIndex(
        (project) => project.id === id
      );
      if (projectIndex === -1) {
        throw new Error("Proyecto no encontrado");
      }
      demoProjects.splice(projectIndex, 1);
      return;
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }

  // Obtener proyectos por usuario
  async getByUserId(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error fetching projects for user ${userId}:`, error);
      throw error;
    }

    return data as Project[];
  }

  // Generar descripción de proyecto con IA
  async generateDescription(
    projectId: string,
    prompt: string
  ): Promise<string> {
    // Llamada a la función de Edge para generar la descripción
    const { data, error } = await supabase.rpc("get_ai_completion", {
      prompt_input: prompt,
      max_tokens_input: 250,
      temperature_input: 0.7
    });

    if (error) {
      console.error("Error generating project description:", error);
      throw error;
    }

    return data || "";
  }

  // Subir un documento para un proyecto
  async uploadDocument(projectId: string, file: File): Promise<string> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(500);
      return `https://demo-storage.com/projects/${projectId}/${file.name}`;
    }

    // Crear path único para el archivo en el bucket 'project-documents'
    const filePath = `${projectId}/${file.name}`;

    // Subir el archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Error uploading document:", error);
      throw error;
    }

    // Obtener la URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('project-documents')
      .getPublicUrl(filePath);

    // Actualizar el proyecto con la URL del documento
    await this.update(projectId, { document_url: urlData.publicUrl });

    return urlData.publicUrl;
  }

  // Eliminar un documento de un proyecto
  async deleteDocument(projectId: string, filePath: string): Promise<void> {
    if (DEMO_MODE) {
      await simulateNetworkDelay(300);
      return;
    }

    // Eliminar el archivo de Storage
    const { error } = await supabase.storage
      .from('project-documents')
      .remove([filePath]);

    if (error) {
      console.error("Error deleting document:", error);
      throw error;
    }

    // Actualizar el proyecto para eliminar la referencia al documento
    await this.update(projectId, { document_url: null });
  }
}

export default new ProjectService();
