import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  InputGroup,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import projectService from "../../services/projectService";
import { Project, ProjectInput } from "../../services/projectService";
import supabase from "../../services/supabase";
import aiService from "../../services/aiService";
import "./ProjectList.css";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Estados para el modal de nuevo proyecto
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("Nuevo Proyecto");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectInput>({
    name: "",
    description: "",
    type: "web",
    status: "pending",
    user_id: "",
  });
  const [saving, setSaving] = useState<boolean>(false);

  // Estados para búsqueda con IA
  const [aiSearchQuery, setAiSearchQuery] = useState<string>("");
  const [aiSearching, setAiSearching] = useState<boolean>(false);

  // Estados para generación de descripción con IA
  const [generatingDescription, setGeneratingDescription] =
    useState<boolean>(false);

  // Estados para filtros avanzados
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Estados para modal de ver proyecto
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError("Error al cargar los proyectos");
        console.error("Error al cargar los proyectos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filtrar proyectos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);

    if (!query) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(query) ||
        (project.description &&
          project.description.toLowerCase().includes(query))
      );
    });

    setFilteredProjects(filtered);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchText("");
    setFilteredProjects(projects);
  };

  // Función para limpiar búsqueda con IA
  const clearAISearch = () => {
    setAiSearchQuery("");
    setFilteredProjects(projects);
  };

  // Función para limpiar todas las búsquedas
  const clearAllSearches = () => {
    setSearchText("");
    setAiSearchQuery("");
    setFilteredProjects(projects);
  };

  // Búsqueda con IA
  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;

    try {
      setAiSearching(true);
      const results = await aiService.searchProjects({ query: aiSearchQuery });
      setFilteredProjects(results);
    } catch (err) {
      setError("Error en la búsqueda con IA");
      console.error("Error en la búsqueda con IA:", err);
    } finally {
      setAiSearching(false);
    }
  };

  // Generar descripción con IA
  const generateDescription = async () => {
    if (!formData.name.trim()) {
      setError("Ingresa un nombre del proyecto primero");
      return;
    }

    try {
      setGeneratingDescription(true);
      setError("");

      const prompt = `Genera una descripción profesional y concisa para un proyecto llamado "${formData.name}" de tipo "${formData.type}". La descripción debe ser entre 50-150 palabras, enfocada en objetivos, tecnologías y beneficios.`;

      const description = await aiService.generateCompletion({
        prompt: prompt,
        projectId: editingProject?.id,
      });

      setFormData((prev) => ({
        ...prev,
        description: description,
      }));
    } catch (err: any) {
      setError(err.message || "Error al generar descripción");
      console.error("Error al generar descripción:", err);
    } finally {
      setGeneratingDescription(false);
    }
  };

  // Aplicar filtros avanzados
  const applyFilters = (projectList: Project[], filtersToApply = filters) => {
    let filtered = [...projectList];

    // Filtro por estado
    if (filtersToApply.status !== "all") {
      filtered = filtered.filter(
        (project) => project.status === filtersToApply.status
      );
    }

    // Filtro por tipo
    if (filtersToApply.type !== "all") {
      filtered = filtered.filter(
        (project) => project.type === filtersToApply.type
      );
    }

    // Filtro por fecha
    if (filtersToApply.dateRange !== "all") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((project) => {
        const projectDate = new Date(project.created_at);
        switch (filtersToApply.dateRange) {
          case "week":
            return projectDate >= sevenDaysAgo;
          case "month":
            return projectDate >= thirtyDaysAgo;
          case "older":
            return projectDate < thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  // Manejar cambio de filtros
  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    // Aplicar filtros al resultado actual usando los nuevos filtros
    let baseProjects = projects;
    if (searchText) {
      baseProjects = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (project.description &&
            project.description
              .toLowerCase()
              .includes(searchText.toLowerCase()))
      );
    }

    const filtered = applyFilters(baseProjects, newFilters);
    setFilteredProjects(filtered);
  };

  // Limpiar filtros
  const clearFilters = () => {
    const defaultFilters = { status: "all", type: "all", dateRange: "all" };
    setFilters(defaultFilters);
    setFilteredProjects(
      searchText
        ? projects.filter(
            (project) =>
              project.name.toLowerCase().includes(searchText.toLowerCase()) ||
              (project.description &&
                project.description
                  .toLowerCase()
                  .includes(searchText.toLowerCase()))
          )
        : projects
    );
  };

  // Obtener estadísticas de proyectos
  const getProjectStats = () => {
    const stats = {
      total: filteredProjects.length,
      byStatus: {
        pending: filteredProjects.filter((p) => p.status === "pending").length,
        active: filteredProjects.filter((p) => p.status === "active").length,
        completed: filteredProjects.filter((p) => p.status === "completed")
          .length,
        canceled: filteredProjects.filter((p) => p.status === "canceled")
          .length,
      },
    };
    return stats;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funciones para el modal
  const openCreateModal = () => {
    setEditingProject(null);
    setModalTitle("Nuevo Proyecto");
    setFormData({
      name: "",
      description: "",
      type: "web",
      status: "pending",
      user_id: "",
    });
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setModalTitle("Editar Proyecto");
    setFormData({
      name: project.name,
      description: project.description || "",
      type: project.type,
      status: project.status,
      user_id: project.user_id,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      type: "web",
      status: "pending",
      user_id: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("El nombre del proyecto es obligatorio");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingProject) {
        // Actualizar proyecto existente
        const updatedProject = await projectService.update(
          editingProject.id,
          formData
        );
        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingProject.id ? updatedProject : project
          )
        );
        setFilteredProjects((prev) =>
          prev.map((project) =>
            project.id === editingProject.id ? updatedProject : project
          )
        );
      } else {
        // Crear nuevo proyecto
        let userId = "demo-user-123"; // ID ficticio para modo demo

        // Solo intentar obtener sesión si no estamos en modo demo
        try {
          const session = await supabase.auth.getSession();
          if (session?.data?.session?.user?.id) {
            userId = session.data.session.user.id;
          }
        } catch (authError) {
          // En caso de error de autenticación, usar ID ficticio (solo en desarrollo)
          if (import.meta.env.DEV) {
            console.warn("Usando ID de usuario ficticio para modo demo");
          }
        }

        const projectInput: ProjectInput = {
          ...formData,
          user_id: userId,
        };

        const createdProject = await projectService.create(projectInput);
        setProjects((prev) => [createdProject, ...prev]);
        setFilteredProjects((prev) => [createdProject, ...prev]);
      }

      closeModal();
    } catch (err: any) {
      setError(err.message || "Error al guardar el proyecto");
      console.error("Error al guardar el proyecto:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`
      )
    ) {
      return;
    }

    try {
      await projectService.delete(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setFilteredProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar el proyecto");
      console.error("Error al eliminar el proyecto:", err);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Obtener badge de estado
  const getStatusBadge = (status: string) => {
    let variant = "secondary";

    switch (status) {
      case "active":
        variant = "success";
        break;
      case "pending":
        variant = "warning";
        break;
      case "completed":
        variant = "primary";
        break;
      case "canceled":
        variant = "danger";
        break;
    }

    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <Container fluid className="project-list-container">
      <h1 className="page-header">Gestión de Proyectos</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={6}>
          <div className="dashboard-card">
            <div className="card-header">Búsqueda de proyectos</div>
            <div className="card-body">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Buscar por nombre o descripción..."
                  value={searchText}
                  onChange={handleSearch}
                />
                <Button variant="outline-secondary" onClick={clearSearch}>
                  <i className="bi bi-x"></i>
                </Button>
              </InputGroup>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="dashboard-card">
            <div className="card-header">Búsqueda con IA</div>
            <div className="card-body">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Ejemplo: 'proyectos web activos' o 'pendientes de marketing'"
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={clearAISearch}
                  disabled={!aiSearchQuery}
                >
                  <i className="bi bi-x"></i>
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAISearch}
                  disabled={aiSearching || !aiSearchQuery.trim()}
                >
                  {aiSearching ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <i className="bi bi-robot"></i>
                  )}{" "}
                  Buscar con IA
                </Button>
              </InputGroup>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Usa lenguaje natural para buscar proyectos con IA.
                </small>
                {(searchText || aiSearchQuery) && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearAllSearches}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Limpiar Todo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filtros avanzados */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="bi bi-funnel me-1"></i>
              Filtros Avanzados
              <i
                className={`bi bi-chevron-${showFilters ? "up" : "down"} ms-1`}
              ></i>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={clearFilters}
              disabled={
                filters.status === "all" &&
                filters.type === "all" &&
                filters.dateRange === "all"
              }
            >
              <i className="bi bi-x-circle me-1"></i>
              Limpiar Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="mt-3 p-3 border rounded bg-light">
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendiente</option>
                      <option value="active">Activo</option>
                      <option value="completed">Completado</option>
                      <option value="canceled">Cancelado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange("type", e.target.value)
                      }
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="web">Desarrollo web</option>
                      <option value="mobile">Aplicación móvil</option>
                      <option value="design">Diseño</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Fecha de creación</Form.Label>
                    <Form.Select
                      value={filters.dateRange}
                      onChange={(e) =>
                        handleFilterChange("dateRange", e.target.value)
                      }
                    >
                      <option value="all">Todas las fechas</option>
                      <option value="week">Última semana</option>
                      <option value="month">Último mes</option>
                      <option value="older">Más antiguos</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>

      {/* Tarjetas de estadísticas */}
      {!loading && (
        <Row className="mb-4">
          <Col md={3}>
            <div className="dashboard-card text-center">
              <div className="card-body">
                <i
                  className="bi bi-folder2 text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <h4 className="mt-2 mb-1">{getProjectStats().total}</h4>
                <p className="text-muted mb-0">Total Proyectos</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-card text-center">
              <div className="card-body">
                <i
                  className="bi bi-play-circle text-success"
                  style={{ fontSize: "2rem" }}
                ></i>
                <h4 className="mt-2 mb-1">
                  {getProjectStats().byStatus.active}
                </h4>
                <p className="text-muted mb-0">Activos</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-card text-center">
              <div className="card-body">
                <i
                  className="bi bi-check-circle text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
                <h4 className="mt-2 mb-1">
                  {getProjectStats().byStatus.completed}
                </h4>
                <p className="text-muted mb-0">Completados</p>
              </div>
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-card text-center">
              <div className="card-body">
                <i
                  className="bi bi-clock text-warning"
                  style={{ fontSize: "2rem" }}
                ></i>
                <h4 className="mt-2 mb-1">
                  {getProjectStats().byStatus.pending}
                </h4>
                <p className="text-muted mb-0">Pendientes</p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="fw-bold">{filteredProjects.length}</span>{" "}
              proyecto(s) encontrado(s)
            </div>
            <Button variant="success" size="sm" onClick={openCreateModal}>
              <i className="bi bi-plus"></i> Nuevo Proyecto
            </Button>
          </div>

          <Table responsive striped hover className="project-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="fw-bold">{project.name}</td>
                    <td>
                      {project.description ? (
                        project.description.length > 100 ? (
                          `${project.description.substring(0, 100)}...`
                        ) : (
                          project.description
                        )
                      ) : (
                        <span className="text-muted">Sin descripción</span>
                      )}
                    </td>
                    <td>{project.type}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>{formatDate(project.created_at)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Ver detalles"
                          onClick={() => {
                            setViewingProject(project);
                            setShowViewModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Editar proyecto"
                          onClick={() => openEditModal(project)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Eliminar proyecto"
                          onClick={() => handleDeleteProject(project)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No se encontraron proyectos
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}

      {/* Modal para crear nuevo proyecto */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="project-name">
                Nombre del proyecto
              </Form.Label>
              <Form.Control
                id="project-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre del proyecto"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="project-type">Tipo de proyecto</Form.Label>
              <div className="select-wrapper">
                <Form.Select
                  id="project-type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  title="Tipo de proyecto"
                  aria-labelledby="type-label"
                >
                  <option value="web">Desarrollo web</option>
                  <option value="mobile">Aplicación móvil</option>
                  <option value="design">Diseño</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Otro</option>
                </Form.Select>
                <span id="type-label" className="visually-hidden">
                  Tipo de proyecto
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="project-status">Estado</Form.Label>
              <div className="select-wrapper">
                <Form.Select
                  id="project-status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  title="Estado del proyecto"
                  aria-labelledby="status-label"
                >
                  <option value="pending">Pendiente</option>
                  <option value="active">Activo</option>
                  <option value="completed">Completado</option>
                  <option value="canceled">Cancelado</option>
                </Form.Select>
                <span id="status-label" className="visually-hidden">
                  Estado del proyecto
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="project-description">Descripción</Form.Label>
              <Form.Control
                id="project-description"
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Descripción breve del proyecto (opcional)"
              />
              <div className="mt-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={generateDescription}
                  disabled={generatingDescription || !formData.name.trim()}
                >
                  {generatingDescription ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-robot me-1"></i>
                      Generar con IA
                    </>
                  )}
                </Button>
                <small className="text-muted ms-2">
                  Genera una descripción automática basada en el nombre y tipo
                  del proyecto
                </small>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || !formData.name.trim()}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" /> Guardando...
              </>
            ) : editingProject ? (
              "Actualizar Proyecto"
            ) : (
              "Crear Proyecto"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver detalles del proyecto */}
      <Modal
        show={showViewModal}
        onHide={() => {
          setShowViewModal(false);
          setViewingProject(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>
            Detalles del Proyecto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingProject && (
            <div className="project-details">
              <div className="mb-4">
                <h3 className="text-primary mb-3">{viewingProject.name}</h3>
                <div className="mb-3">
                  <strong className="text-muted">Descripción:</strong>
                  <div className="mt-1 p-3 bg-light rounded">
                    {viewingProject.description || "Sin descripción disponible"}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="text-muted">Tipo de Proyecto:</strong>
                    <div className="mt-1">
                      <span className="badge bg-secondary fs-6">
                        {viewingProject.type === "web" && "Desarrollo Web"}
                        {viewingProject.type === "mobile" && "Aplicación Móvil"}
                        {viewingProject.type === "design" && "Diseño"}
                        {viewingProject.type === "marketing" && "Marketing"}
                        {viewingProject.type === "other" && "Otro"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="text-muted">Estado:</strong>
                    <div className="mt-1">
                      {getStatusBadge(viewingProject.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="text-muted">Fecha de Creación:</strong>
                    <div className="mt-1">
                      {formatDate(viewingProject.created_at)}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <strong className="text-muted">ID del Proyecto:</strong>
                    <div className="mt-1">
                      <code className="bg-light p-1 rounded">
                        {viewingProject.id}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              if (viewingProject) {
                openEditModal(viewingProject);
                setShowViewModal(false);
                setViewingProject(null);
              }
            }}
          >
            <i className="bi bi-pencil me-1"></i>
            Editar Proyecto
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowViewModal(false);
              setViewingProject(null);
            }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;
