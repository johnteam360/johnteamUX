import React, { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "../services/authService";
import type { ProjectWithDetails } from "../services/projectService";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

interface DashboardProps {
  user: User;
  userProfile: UserProfile | null;
  projects: ProjectWithDetails[];
  loading: boolean;
  error: string;
  onLogout: () => void;
  onReloadProjects: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  userProfile,
  projects,
  loading,
  error,
  onLogout,
  onReloadProjects,
}) => {
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithDetails | null>(null);

  // Estadísticas básicas
  const stats = {
    total: projects.length,
    activos: projects.filter((p) => p.status === "En Progreso").length,
    completados: projects.filter((p) => p.status === "Completado").length,
    pendientes: projects.filter((p) => p.status === "Pendiente").length,
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <div className="navbar-brand">
            <h4 className="mb-0">Portal del Cliente - JohnTeam</h4>
          </div>

          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userProfile?.full_name || user.email}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">{user.email}</small>
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={onLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="container py-4">
        {/* Bienvenida */}
        <div className="row mb-4">
          <div className="col">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title mb-2">
                  ¡Bienvenido, {userProfile?.full_name || "Cliente"}!
                </h5>
                <p className="card-text mb-0">
                  Aquí puedes ver el estado de todos tus proyectos en tiempo
                  real
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="display-6 text-primary">{stats.total}</div>
                <div className="small text-muted">Total Proyectos</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="display-6 text-warning">{stats.activos}</div>
                <div className="small text-muted">En Progreso</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="display-6 text-success">
                  {stats.completados}
                </div>
                <div className="small text-muted">Completados</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="display-6 text-secondary">
                  {stats.pendientes}
                </div>
                <div className="small text-muted">Pendientes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={onReloadProjects}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando proyectos...</span>
            </div>
            <p className="mt-2 text-muted">Cargando proyectos...</p>
          </div>
        )}

        {/* Contenido Principal - Lista de Proyectos o Detalle */}
        {!loading && !error && (
          <div className="row">
            {selectedProject ? (
              <div className="col">
                <ProjectDetail
                  project={selectedProject}
                  onBack={() => setSelectedProject(null)}
                />
              </div>
            ) : (
              <div className="col">
                <ProjectList
                  projects={projects}
                  onSelectProject={setSelectedProject}
                  onReload={onReloadProjects}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
