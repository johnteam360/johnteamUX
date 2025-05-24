import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import authService from "../../services/authService";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const getUserData = async () => {
      const session = await authService.getSession();
      if (session?.user?.email) {
        setUsername(session.user.email.split("@")[0]);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-brand">{collapsed ? "DS" : "DashSync"}</h3>
          <Button
            variant="link"
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <i className={`bi bi-chevron-${collapsed ? "right" : "left"}`}></i>
          </Button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!collapsed && (
            <div className="user-info">
              <h6>{username || "Usuario"}</h6>
              <span className="badge bg-primary">Admin</span>
            </div>
          )}
        </div>

        <Nav className="sidebar-nav flex-column">
          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/"
              className={`sidebar-link ${isActive("/")}`}
              title="Dashboard"
            >
              <i className="bi bi-speedometer2"></i>
              {!collapsed && <span>Dashboard</span>}
            </Nav.Link>
          </Nav.Item>

          <div className="sidebar-heading">{!collapsed && "Gestión"}</div>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/users"
              className={`sidebar-link ${isActive("/users")}`}
              title="Usuarios"
            >
              <i className="bi bi-people"></i>
              {!collapsed && <span>Usuarios</span>}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/projects"
              className={`sidebar-link ${isActive("/projects")}`}
              title="Proyectos"
            >
              <i className="bi bi-kanban"></i>
              {!collapsed && <span>Proyectos</span>}
            </Nav.Link>
          </Nav.Item>

          <div className="sidebar-heading">{!collapsed && "Herramientas"}</div>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/ai"
              className={`sidebar-link ${isActive("/ai")}`}
              title="Funciones IA"
            >
              <i className="bi bi-robot"></i>
              {!collapsed && <span>Funciones IA</span>}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/settings"
              className={`sidebar-link ${isActive("/settings")}`}
              title="Ajustes"
            >
              <i className="bi bi-gear"></i>
              {!collapsed && <span>Ajustes</span>}
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="sidebar-footer">
          <Button
            variant="link"
            className="sidebar-link"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right"></i>
            {!collapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* Header */}
        <Navbar bg="white" className="main-header" expand>
          <Container fluid>
            <div className="page-title">
              {location.pathname === "/" && "Dashboard"}
              {location.pathname === "/users" && "Gestión de Usuarios"}
              {location.pathname === "/projects" && "Gestión de Proyectos"}
              {location.pathname === "/ai" && "Funcionalidades de IA"}
              {location.pathname === "/settings" && "Configuración"}
            </div>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-end">
              <Nav>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <i className="bi bi-bell"></i>
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-question-circle"></i>
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="page-content fade-in">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
