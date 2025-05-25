import React, { useState, useEffect } from "react";
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "profile" | "projects" | "ai"
  >("projects");

  // Estadísticas básicas
  const stats = {
    total: projects.length,
    activos: projects.filter((p) => p.status === "En Progreso").length,
    completados: projects.filter((p) => p.status === "Completado").length,
    pendientes: projects.filter((p) => p.status === "Pendiente").length,
  };

  // Alternar vista de perfil
  const toggleProfile = () => {
    setCurrentSection("profile");
    setSelectedProject(null);
    setShowSidebar(false);
  };

  // Alternar vista de proyectos
  const toggleProjects = () => {
    setCurrentSection("projects");
    setSelectedProject(null);
    setShowSidebar(false);
  };

  // Alternar vista de IA
  const toggleAI = () => {
    setCurrentSection("ai");
    setSelectedProject(null);
    setShowSidebar(false);
  };

  // Obtener email del usuario
  const getUserEmail = () => {
    return userProfile?.email || user.email || "Sin email";
  };

  // Mostrar/ocultar menú lateral
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Obtener primera letra del nombre o email para el avatar
  const getInitial = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top">
        <div className="container-fluid px-3">
          <a href="#" className="navbar-brand d-flex align-items-center">
            <img
              src="/logo-small.svg"
              alt="JohnTeam Logo"
              width="30"
              className="me-2"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h4 className="mb-0 text-truncate">Portal del Cliente</h4>
          </a>

          {/* Menú de navegación horizontal para modo notebook */}
          <div className="d-none d-lg-flex align-items-center">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    currentSection === "projects" ? "active" : ""
                  }`}
                  onClick={toggleProjects}
                >
                  <i className="bi bi-briefcase me-1"></i> Proyectos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    currentSection === "profile" ? "active" : ""
                  }`}
                  onClick={toggleProfile}
                >
                  <i className="bi bi-person-circle me-1"></i> Mi Perfil
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    currentSection === "ai" ? "active" : ""
                  }`}
                  onClick={toggleAI}
                >
                  <i className="bi bi-robot me-1"></i> Consultar IA
                  <span className="badge bg-primary ms-1">Próximamente</span>
                </button>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <div className="user-avatar me-2 d-none d-xl-flex">
                {getInitial()}
              </div>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Salir
              </button>
            </div>
          </div>

          {/* Botón de hamburguesa para móvil */}
          <button
            className="navbar-toggler border-0 shadow-none d-lg-none"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      {/* Contenido Principal con menú lateral */}
      <div className="d-flex flex-grow-1" style={{ marginTop: "56px" }}>
        {/* Menú lateral (sidebar) */}
        <aside
          className={`sidebar bg-dark text-white ${showSidebar ? "show" : ""}`}
        >
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center mb-3">
              <div className="user-avatar me-2">{getInitial()}</div>
              <div className="overflow-hidden">
                <div className="fw-bold text-truncate">
                  {userProfile?.full_name || user.email}
                </div>
                <small className="text-light-50 text-truncate d-block">
                  {getUserEmail()}
                </small>
              </div>
              <button
                className="btn btn-sm btn-dark ms-auto"
                onClick={toggleSidebar}
                aria-label="Cerrar menú"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div className="list-group list-group-flush border-0 mt-2">
            <button
              className={`list-group-item list-group-item-action ${
                currentSection === "profile" ? "active" : ""
              }`}
              onClick={toggleProfile}
            >
              <i className="bi bi-person-circle me-2"></i> Mi Perfil
            </button>

            <button
              className={`list-group-item list-group-item-action ${
                currentSection === "projects" ? "active" : ""
              }`}
              onClick={toggleProjects}
            >
              <i className="bi bi-briefcase me-2"></i> Proyectos
            </button>

            <button
              className={`list-group-item list-group-item-action ${
                currentSection === "ai" ? "active" : ""
              }`}
              onClick={toggleAI}
            >
              <i className="bi bi-robot me-2"></i> Consultar IA
              <span className="badge bg-primary ms-2">Próximamente</span>
            </button>

            <button
              className="list-group-item list-group-item-action mt-auto text-danger"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Overlay para cerrar el sidebar */}
        {showSidebar && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}

        {/* Contenido principal */}
        <main className="main-content flex-grow-1 p-3 p-lg-4">
          {/* Bienvenida */}
          <div className="card bg-gradient-primary text-white mb-4 fade-in border-0 shadow">
            <div className="card-body py-3 py-md-4">
              <h5 className="card-title mb-2 fw-bold">
                <i className="bi bi-person-check me-2"></i>
                ¡Bienvenido, {userProfile?.full_name || "Cliente"}!
              </h5>
              <p className="card-text mb-0">
                Aquí puedes ver el estado de todos tus proyectos en tiempo real
              </p>
            </div>
          </div>

          {/* Estadísticas - Solo mostrar en vista de proyectos */}
          {currentSection === "projects" && !selectedProject && (
            <div className="row g-2 g-md-3 mb-4 fade-in">
              <div className="col-6 col-md-3 mb-2 mb-md-0">
                <div className="card text-center h-100">
                  <div className="card-body p-2 p-md-3">
                    <h6 className="text-muted mb-1">Proyectos</h6>
                    <h3 className="mb-0">{stats.total}</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-2 mb-md-0">
                <div className="card text-center h-100 border-primary">
                  <div className="card-body p-2 p-md-3">
                    <h6 className="text-primary mb-1">En Progreso</h6>
                    <h3 className="mb-0 text-primary">{stats.activos}</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card text-center h-100 border-success">
                  <div className="card-body p-2 p-md-3">
                    <h6 className="text-success mb-1">Completados</h6>
                    <h3 className="mb-0 text-success">{stats.completados}</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card text-center h-100 border-warning">
                  <div className="card-body p-2 p-md-3">
                    <h6 className="text-warning mb-1">Pendientes</h6>
                    <h3 className="mb-0 text-warning">{stats.pendientes}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger fade-in" role="alert">
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
            <div className="text-center py-4 fade-in">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando proyectos...</span>
              </div>
              <p className="mt-2 text-muted">Cargando proyectos...</p>
            </div>
          )}

          {/* Contenido Principal - Perfil, Lista de Proyectos o Detalle */}
          {!loading && !error && (
            <div className="fade-in">
              {currentSection === "profile" ? (
                <div className="card shadow">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-person-circle me-2"></i>Mi Perfil
                    </h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setCurrentSection("projects")}
                    >
                      <i className="bi bi-arrow-left me-1"></i>Volver a
                      Proyectos
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">
                              <i className="bi bi-person me-2"></i>Información
                              Personal
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Nombre completo
                              </label>
                              <div className="form-control-plaintext">
                                {userProfile?.full_name || "No especificado"}
                                {!userProfile?.full_name && (
                                  <small className="text-danger d-block">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Datos no encontrados. Por favor, contacta
                                    con soporte.
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Correo electrónico
                              </label>
                              <div className="form-control-plaintext text-break">
                                {getUserEmail()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">
                              <i className="bi bi-building me-2"></i>Información
                              de la Empresa
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Nombre de la empresa
                              </label>
                              <div className="form-control-plaintext">
                                {userProfile?.company_name || "No especificado"}
                                {!userProfile?.company_name && (
                                  <small className="text-danger d-block">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Datos no encontrados. Por favor, contacta
                                    con soporte.
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted">
                                Industria/Sector
                              </label>
                              <div className="form-control-plaintext">
                                {userProfile?.industry || "No especificado"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="bi bi-clipboard-data me-2"></i>
                          Información del Proyecto
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label text-muted">
                            Objetivo del proyecto
                          </label>
                          <div className="form-control-plaintext">
                            {userProfile?.project_objective ||
                              "No especificado"}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label text-muted">
                            Tiempo estimado
                          </label>
                          <div className="form-control-plaintext">
                            {userProfile?.expected_timeline ||
                              "No especificado"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información de Depuración - Solo en desarrollo */}
                    {import.meta.env.DEV && (
                      <div className="card mt-4">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">
                            <i className="bi bi-bug me-2"></i>
                            Información de Depuración
                          </h6>
                          <small className="badge bg-warning">
                            Solo en Desarrollo
                          </small>
                        </div>
                        <div className="card-body">
                          <div className="accordion" id="debugAccordion">
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseUserData"
                                >
                                  Datos del Usuario
                                </button>
                              </h2>
                              <div
                                id="collapseUserData"
                                className="accordion-collapse collapse"
                                data-bs-parent="#debugAccordion"
                              >
                                <div className="accordion-body bg-light">
                                  <div className="table-responsive">
                                    <table className="table table-sm table-hover">
                                      <tbody>
                                        <tr>
                                          <th style={{ width: "30%" }}>
                                            ID Usuario
                                          </th>
                                          <td>{user.id}</td>
                                        </tr>
                                        <tr>
                                          <th>Email</th>
                                          <td>{user.email}</td>
                                        </tr>
                                        <tr>
                                          <th>Proveedor Auth</th>
                                          <td>
                                            {user.app_metadata?.provider ||
                                              "email"}
                                          </td>
                                        </tr>
                                        {Object.entries(
                                          user.user_metadata || {}
                                        ).map(([key, value]) => (
                                          <tr key={key}>
                                            <th>{key.replace(/_/g, " ")}</th>
                                            <td>{String(value)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseProfileData"
                                >
                                  Datos del Perfil
                                </button>
                              </h2>
                              <div
                                id="collapseProfileData"
                                className="accordion-collapse collapse"
                                data-bs-parent="#debugAccordion"
                              >
                                <div className="accordion-body bg-light">
                                  {userProfile ? (
                                    <div className="table-responsive">
                                      <table className="table table-sm table-hover">
                                        <tbody>
                                          {Object.entries(userProfile).map(
                                            ([key, value]) => (
                                              <tr key={key}>
                                                <th style={{ width: "30%" }}>
                                                  {key.replace(/_/g, " ")}
                                                </th>
                                                <td>{String(value)}</td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="alert alert-warning">
                                      No se encontró perfil de usuario
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentSection === "ai" ? (
                <div className="card shadow">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-robot me-2"></i>Consulta IA
                    </h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setCurrentSection("projects")}
                    >
                      <i className="bi bi-arrow-left me-1"></i>Volver a
                      Proyectos
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="alert alert-info mb-4">
                      <h5 className="alert-heading">
                        <i className="bi bi-info-circle me-2"></i>Próximamente
                      </h5>
                      <p className="mb-0">
                        El módulo de consulta de Inteligencia Artificial estará
                        disponible en breve. Te notificaremos cuando esté listo
                        para su uso.
                      </p>
                    </div>

                    <div className="card bg-light border-0">
                      <div className="card-body text-center py-4 py-md-5">
                        <i className="bi bi-robot display-4 text-primary mb-3"></i>
                        <h4 className="text-dark mb-3">Asistente de IA</h4>
                        <p className="text-muted mb-4">
                          Nuestro asistente de IA te permitirá consultar
                          información sobre tus proyectos, hacer preguntas
                          técnicas y recibir recomendaciones personalizadas.
                        </p>
                        <button className="btn btn-primary disabled">
                          <i className="bi bi-chat-text me-2"></i>Iniciar
                          consulta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedProject ? (
                <div className="card shadow">
                  <ProjectDetail
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                  />
                </div>
              ) : (
                <div className="card shadow">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <i className="bi bi-briefcase me-2"></i>Mis Proyectos
                    </h5>
                  </div>
                  <div className="card-body">
                    <ProjectList
                      projects={projects}
                      onSelectProject={setSelectedProject}
                      onReload={onReloadProjects}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
