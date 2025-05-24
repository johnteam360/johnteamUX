import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

interface SidebarProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, isCollapsed = false }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleExpanded = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3 className={`brand ${isCollapsed ? "d-none" : ""}`}>Admin</h3>
        <button
          className="toggle-btn"
          onClick={onToggle}
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          <i
            className={`bi ${
              isCollapsed ? "bi-arrow-right-square" : "bi-arrow-left-square"
            }`}
          ></i>
        </button>
      </div>

      <div className="sidebar-body">
        <Nav className="flex-column">
          <Nav.Item>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              <i className="bi bi-house-door"></i>
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/projects"
              className={`nav-link ${isActive("/projects") ? "active" : ""}`}
            >
              <i className="bi bi-kanban"></i>
              {!isCollapsed && <span>Proyectos</span>}
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/users"
              className={`nav-link ${isActive("/users") ? "active" : ""}`}
            >
              <i className="bi bi-people"></i>
              {!isCollapsed && <span>Usuarios</span>}
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/ai"
              className={`nav-link ${isActive("/ai") ? "active" : ""}`}
            >
              <i className="bi bi-robot"></i>
              {!isCollapsed && <span>Funciones IA</span>}
            </Link>
          </Nav.Item>
        </Nav>
      </div>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <img
              src="/assets/images/avatar-placeholder.png"
              alt="User"
              className="avatar"
            />
            <div className="user-details">
              <span className="username">Admin</span>
              <small className="text-muted">Administrador</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
