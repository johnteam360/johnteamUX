import React from "react";
import type { ProjectWithDetails } from "../services/projectService";

interface ProjectDetailProps {
  project: ProjectWithDetails;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
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
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "No especificada";
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPhaseStatusIcon = (status: string | null) => {
    switch (status) {
      case "Completado":
        return "✅";
      case "En Progreso":
        return "🔄";
      case "Pendiente":
        return "⏳";
      default:
        return "📋";
    }
  };

  const calculateProjectProgress = () => {
    if (!project.phases || project.phases.length === 0) return 0;

    const totalProgress = project.phases.reduce((sum, phase) => {
      return sum + (phase.progress || 0);
    }, 0);

    return Math.round(totalProgress / project.phases.length);
  };

  const projectProgress = calculateProjectProgress();

  return (
    <div className="container-fluid px-0">
      {/* Header con botón de regreso */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light me-3"
              onClick={onBack}
              title="Volver a la lista de proyectos"
            >
              ← Volver
            </button>
            <div className="flex-grow-1">
              <h4 className="mb-0">
                {getProjectTypeIcon(project.type)} {project.name}
              </h4>
              <small className="opacity-75">
                Detalles completos del proyecto
              </small>
            </div>
            <span className={getStatusBadge(project.status)}>
              {project.status || "Sin estado"}
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Columna Principal - Información del Proyecto */}
        <div className="col-lg-8">
          {/* Información General */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">📋 Información General</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Nombre del Proyecto:</strong>
                    </label>
                    <p className="mb-0">{project.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Tipo:</strong>
                    </label>
                    <p className="mb-0">
                      <span className="badge bg-light text-dark">
                        {project.type || "General"}
                      </span>
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Estado:</strong>
                    </label>
                    <p className="mb-0">
                      <span className={getStatusBadge(project.status)}>
                        {project.status || "Sin estado"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Fecha de Inicio:</strong>
                    </label>
                    <p className="mb-0">{formatDate(project.start_date)}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Fecha de Finalización:</strong>
                    </label>
                    <p className="mb-0">{formatDate(project.end_date)}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <strong>Progreso General:</strong>
                    </label>
                    <div className="progress mb-2" style={{ height: "20px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${projectProgress}%` }}
                        aria-valuenow={projectProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {projectProgress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {project.description && (
                <div className="mt-3">
                  <label className="form-label text-muted">
                    <strong>Descripción:</strong>
                  </label>
                  <p className="mb-0">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fases del Proyecto */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">🎯 Fases del Proyecto</h5>
            </div>
            <div className="card-body">
              {!project.phases || project.phases.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-muted mb-2">📝</div>
                  <p className="text-muted mb-0">
                    No hay fases definidas para este proyecto
                  </p>
                </div>
              ) : (
                <div className="row">
                  {project.phases.map((phase, index) => (
                    <div key={phase.id} className="col-md-6 mb-3">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex align-items-start mb-2">
                            <span className="me-2">
                              {getPhaseStatusIcon(phase.status)}
                            </span>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{phase.name}</h6>
                              <small className="text-muted">
                                Fase {index + 1}
                              </small>
                            </div>
                            <span
                              className={`badge ${
                                phase.status === "Completado"
                                  ? "bg-success"
                                  : phase.status === "En Progreso"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {phase.status || "Pendiente"}
                            </span>
                          </div>

                          {phase.description && (
                            <p className="small text-muted mb-2">
                              {phase.description}
                            </p>
                          )}

                          <div
                            className="progress mb-2"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar"
                              style={{ width: `${phase.progress || 0}%` }}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">
                              Progreso: {phase.progress || 0}%
                            </small>
                            {phase.responsible_name && (
                              <small className="text-muted">
                                👤 {phase.responsible_name}
                              </small>
                            )}
                          </div>

                          {(phase.start_date || phase.end_date) && (
                            <div className="mt-2 pt-2 border-top">
                              <small className="text-muted">
                                📅 {formatDate(phase.start_date)} -{" "}
                                {formatDate(phase.end_date)}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Lateral - Actualizaciones */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                📢 Actualizaciones Recientes
                <span className="badge bg-primary ms-2">
                  {project.updates?.length || 0}
                </span>
              </h5>
            </div>
            <div className="card-body p-0">
              {!project.updates || project.updates.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-muted mb-2">📭</div>
                  <p className="text-muted mb-0">
                    No hay actualizaciones disponibles
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {project.updates.slice(0, 10).map((update) => (
                    <div key={update.id} className="list-group-item">
                      <div className="d-flex align-items-start">
                        <div className="me-2 mt-1">
                          {update.created_by_admin ? "👨‍💼" : "👤"}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small">{update.update_text}</p>
                          <small className="text-muted">
                            {formatDateTime(update.created_at)}
                            {update.created_by_admin && (
                              <span className="badge bg-light text-dark ms-2">
                                Admin
                              </span>
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {project.updates && project.updates.length > 10 && (
              <div className="card-footer text-center">
                <small className="text-muted">
                  Mostrando las 10 actualizaciones más recientes
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
