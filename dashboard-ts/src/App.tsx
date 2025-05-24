import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

// Importar componentes
import Layout from "./components/common/Layout";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import UserList from "./components/users/UserList";
import ProjectList from "./components/projects/ProjectList";
import AIFeatures from "./components/ai/AIFeatures";
import Settings from "./components/settings/Settings";
import authService from "./services/authService";
import userService from "./services/userService";

// Componente temporal para páginas no implementadas
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="p-5 text-center">
    <h2>{title}</h2>
    <p>Esta sección está en desarrollo</p>
  </div>
);

// Componente de redirección para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificación real con Supabase (sin demo)
        const session = await authService.getSession();
        if (import.meta.env.DEV) {
          console.log(
            "🔐 Estado de autenticación:",
            session ? "Autenticado" : "No autenticado"
          );
        }
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error al comprobar la autenticación:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente de redirección para rutas que requieren ser administrador
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const session = await authService.getSession();

        if (!session) {
          setIsAdmin(false);
          return;
        }

        // Obtener perfil de usuario para verificar si es admin
        const { data: profile, error } =
          await userService.getCurrentUserProfile();

        if (error) {
          console.error("Error al obtener perfil de usuario:", error);
          setIsAdmin(false);
          return;
        }

        if (import.meta.env.DEV) {
          console.log(
            "👑 Estado de administrador:",
            profile?.is_admin ? "Es admin" : "No es admin"
          );
        }

        setIsAdmin(profile?.is_admin || false);
      } catch (error) {
        console.error("Error al verificar permisos de administrador:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando permisos...</span>
        </div>
      </div>
    );
  }

  // Si no es admin, mostrar un mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="alert alert-danger text-center">
          <i className="bi bi-shield-lock fs-1 d-block mb-3"></i>
          <h3>Acceso Denegado</h3>
          <p>
            No tienes permisos de administrador para acceder a esta sección.
          </p>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout>
                <UserList />
              </Layout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout>
                <AIFeatures />
              </Layout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Layout>
                <Settings />
              </Layout>
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
