import React, { useState } from "react";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./Header.css";

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("supabase.auth.token");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="header-navbar">
      <Container fluid>
        <div className="d-block d-lg-none">
          <button
            className="mobile-sidebar-toggle"
            onClick={toggleSidebar}
            title="Mostrar/Ocultar menú"
            aria-label="Mostrar/Ocultar menú"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className="search-box d-none d-md-flex">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Buscar..." className="search-input" />
        </div>

        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="notification-dropdown"
              className="nav-icon"
            >
              <i className="bi bi-bell"></i>
              <span className="notification-badge">3</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-end notification-dropdown">
              <Dropdown.Header>Notificaciones</Dropdown.Header>
              <Dropdown.Item href="#">
                <div className="notification-item">
                  <div className="notification-icon bg-primary">
                    <i className="bi bi-person-add"></i>
                  </div>
                  <div className="notification-details">
                    <p>Nuevo usuario registrado</p>
                    <small>Hace 5 minutos</small>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item href="#">
                <div className="notification-item">
                  <div className="notification-icon bg-success">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="notification-details">
                    <p>Proyecto completado</p>
                    <small>Hace 1 hora</small>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item href="#">Ver todas</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="user-dropdown"
              className="nav-icon user-dropdown"
            >
              <img
                src="/assets/images/avatar-placeholder.png"
                alt="User"
                className="avatar-sm"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Header>Admin</Dropdown.Header>
              <Dropdown.Item href="#/profile">
                <i className="bi bi-person me-2"></i>
                Perfil
              </Dropdown.Item>
              <Dropdown.Item href="#/settings">
                <i className="bi bi-gear me-2"></i>
                Configuración
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
