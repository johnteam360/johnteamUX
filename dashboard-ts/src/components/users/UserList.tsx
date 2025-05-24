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
import userService from "../../services/userService";
import aiService from "../../services/aiService";
import { UserProfile, UserProfileInput } from "../../services/userService";
import "./UserList.css";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [aiSearchQuery, setAiSearchQuery] = useState<string>("");
  const [aiSearching, setAiSearching] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Estados para el modal de usuario
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfileInput>({
    email: "",
    full_name: "",
    is_admin: false,
    is_active: true,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError("Error al cargar los usuarios");
        console.error("Error al cargar los usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filtrar usuarios con búsqueda normal
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);

    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      return (
        user.email.toLowerCase().includes(query) ||
        (user.full_name && user.full_name.toLowerCase().includes(query))
      );
    });

    setFilteredUsers(filtered);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchText("");
    setFilteredUsers(users);
  };

  // Función para limpiar búsqueda con IA
  const clearAISearch = () => {
    setAiSearchQuery("");
    setFilteredUsers(users);
  };

  // Función para limpiar todas las búsquedas
  const clearAllSearches = () => {
    setSearchText("");
    setAiSearchQuery("");
    setFilteredUsers(users);
  };

  // Búsqueda con IA
  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;

    try {
      setAiSearching(true);
      const results = await aiService.searchUsers({ query: aiSearchQuery });
      setFilteredUsers(results);
    } catch (err) {
      setError("Error en la búsqueda con IA");
      console.error("Error en la búsqueda con IA:", err);
    } finally {
      setAiSearching(false);
    }
  };

  // Activar/desactivar usuario
  const toggleUserActive = async (id: string, currentStatus: boolean) => {
    try {
      await userService.toggleActive(id, !currentStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: !currentStatus } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(
        `Error al ${currentStatus ? "desactivar" : "activar"} el usuario`
      );
      console.error("Error al actualizar el usuario:", err);
    }
  };

  // Cambiar rol de usuario
  const toggleUserAdmin = async (id: string, currentStatus: boolean) => {
    try {
      await userService.toggleAdmin(id, !currentStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_admin: !currentStatus } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_admin: !currentStatus } : user
        )
      );
    } catch (err) {
      setError(`Error al cambiar el rol del usuario`);
      console.error("Error al actualizar el usuario:", err);
    }
  };

  // Funciones para el modal
  const openCreateModal = () => {
    setEditingUser(null);
    setModalTitle("Crear Nuevo Usuario");
    setFormData({
      email: "",
      full_name: "",
      is_admin: false,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setModalTitle("Editar Usuario");
    setFormData({
      email: user.email,
      full_name: user.full_name || "",
      is_admin: user.is_admin,
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      email: "",
      full_name: "",
      is_admin: false,
      is_active: true,
    });
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let savedUser: UserProfile;

      if (editingUser) {
        // Actualizar usuario existente
        savedUser = await userService.update(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? savedUser : user))
        );
        setFilteredUsers((prev) =>
          prev.map((user) => (user.id === editingUser.id ? savedUser : user))
        );
      } else {
        // Crear nuevo usuario
        savedUser = await userService.create(formData);
        setUsers((prev) => [...prev, savedUser]);
        setFilteredUsers((prev) => [...prev, savedUser]);
      }

      closeModal();
    } catch (err: any) {
      setError(err.message || "Error al guardar el usuario");
      console.error("Error al guardar el usuario:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario ${user.email}?`
      )
    ) {
      return;
    }

    try {
      await userService.delete(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar el usuario");
      console.error("Error al eliminar el usuario:", err);
    }
  };

  return (
    <Container fluid className="user-list-container">
      <h1 className="page-header">Gestión de Usuarios</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={6}>
          <div className="dashboard-card">
            <div className="card-header">Búsqueda de usuarios</div>
            <div className="card-body">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Buscar por email o nombre..."
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
                  placeholder="Ejemplo: 'usuarios admins activos' o 'registrados hace más de un mes'"
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
                  Usa lenguaje natural para buscar usuarios con IA.
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
              <span className="fw-bold">{filteredUsers.length}</span> usuario(s)
              encontrado(s)
            </div>
            <Button variant="success" size="sm" onClick={openCreateModal}>
              <i className="bi bi-plus"></i> Nuevo Usuario
            </Button>
          </div>

          <div className="dashboard-card">
            <div className="card-body p-0">
              <Table responsive className="table-styled mb-0">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.full_name || "Sin nombre"}</td>
                        <td>
                          <Badge bg={user.is_admin ? "primary" : "secondary"}>
                            {user.is_admin ? "Admin" : "Usuario"}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={user.is_active ? "success" : "danger"}>
                            {user.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                toggleUserAdmin(user.id, user.is_admin)
                              }
                              title={
                                user.is_admin ? "Quitar admin" : "Hacer admin"
                              }
                            >
                              <i
                                className={`bi bi-${
                                  user.is_admin ? "person" : "shield"
                                }`}
                              ></i>
                            </Button>
                            <Button
                              variant={
                                user.is_active
                                  ? "outline-danger"
                                  : "outline-success"
                              }
                              size="sm"
                              onClick={() =>
                                toggleUserActive(user.id, user.is_active)
                              }
                              title={user.is_active ? "Desactivar" : "Activar"}
                            >
                              <i
                                className={`bi bi-${
                                  user.is_active
                                    ? "slash-circle"
                                    : "check-circle"
                                }`}
                              ></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Editar usuario"
                              onClick={() => openEditModal(user)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Eliminar usuario"
                              onClick={() => handleDeleteUser(user)}
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
                        No se encontraron usuarios
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Modal para crear/editar usuarios */}
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="usuario@ejemplo.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="is_admin"
                    name="is_admin"
                    label="Administrador"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    label="Usuario Activo"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : editingUser ? (
              "Actualizar"
            ) : (
              "Crear Usuario"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserList;
