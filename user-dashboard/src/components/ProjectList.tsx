import React from "react";
import type { ProjectWithDetails } from "../services/projectService";

interface ProjectListProps {
  projects: ProjectWithDetails[];
  onSelectProject: (project: ProjectWithDetails) => void;
  onReload: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onReload,
}) => {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "En Progreso":
        return "badge bg-warning text-dark";
      case "Completado":
        return "badge bg-success";
      case "Pendiente":
        return "badge bg-secondary";
      case "Cancelado":
        return "badge bg-danger";
      default:
        return "badge bg-light text-dark";
    }
  };

  const getProjectTypeIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "web":
      case "desarrollo web":
        return "🌐";
      case "mobile":
      case "móvil":
      case "desarrollo móvil":
        return "📱";
      case "design":
      case "diseño":
        return "🎨";
      default:
        return "📁";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📁 Mis Proyectos ({projects.length})</h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={onReload}
          title="Recargar proyectos"
        >
          🔄 Actualizar
        </button>
      </div>

      <div className="card-body p-0">
        {projects.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 text-muted mb-3">📭</div>
            <h5 className="text-muted">No tienes proyectos asignados</h5>
            <p className="text-muted">
              Contacta con nuestro equipo para obtener más información
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Proyecto</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Fecha Inicio</th>
                  <th>Actualizaciones</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div>
                        <div className="fw-semibold">
                          {getProjectTypeIcon(project.type)} {project.name}
                        </div>
                        {project.description && (
                          <small className="text-muted">
                            {project.description.substring(0, 100)}
                            {project.description.length > 100 ? "..." : ""}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadge(project.status)}>
                        {project.status || "Sin estado"}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {project.type || "General"}
                      </span>
                    </td>
                    <td>
                      <small>{formatDate(project.start_date)}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-info me-2">
                          {project.updates?.length || 0}
                        </span>
                        <small className="text-muted">updates</small>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onSelectProject(project)}
                        title="Ver detalles del proyecto"
                      >
                        👁️ Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <div className="card-footer text-muted">
          <small>
            💡 Haz clic en "Ver Detalles" para conocer el progreso completo de
            cada proyecto
          </small>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
