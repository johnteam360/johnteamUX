import React, { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthService } from "./services/authService";
import { ProjectService } from "./services/projectService";
import type { UserProfile } from "./services/authService";
import type { ProjectWithDetails } from "./services/projectService";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Cargar datos del usuario y proyectos
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar perfil de usuario
      const profile = await AuthService.getCurrentUserProfile();
      setUserProfile(profile);

      // Cargar proyectos del usuario
      const userProjects = await ProjectService.getUserProjects();
      setProjects(userProjects);
    } catch (err) {
      console.error("❌ Error al cargar datos del usuario:", err);
      setError("Error al cargar los datos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar login
  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      const { user: loggedUser } = await AuthService.signIn(email, password);

      if (loggedUser) {
        setUser(loggedUser);
        await loadUserData();
      }
    } catch (err: unknown) {
      console.error("❌ Error en login:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(errorMessage);
    }
  };

  // Manejar logout
  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
      setProjects([]);
    } catch (err) {
      console.error("❌ Error en logout:", err);
    }
  };

  // Recargar proyectos
  const reloadProjects = async () => {
    if (user) {
      try {
        setLoading(true);
        const userProjects = await ProjectService.getUserProjects();
        setProjects(userProjects);
      } catch (err) {
        console.error("❌ Error al recargar proyectos:", err);
        setError("Error al recargar proyectos");
      } finally {
        setLoading(false);
      }
    }
  };

  // Efecto para verificar autenticación inicial
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          await loadUserData();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error al verificar autenticación:", err);
        setLoading(false);
      }
    };

    checkAuth();

    // Escuchar cambios en autenticación
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (newUser) => {
      setUser(newUser);

      if (newUser) {
        await loadUserData();
      } else {
        setUserProfile(null);
        setProjects([]);
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading inicial
  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return (
      <div className="min-vh-100 bg-light">
        <LoginForm onLogin={handleLogin} error={error} />
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="min-vh-100 bg-light">
      <Dashboard
        user={user}
        userProfile={userProfile}
        projects={projects}
        loading={loading}
        error={error}
        onLogout={handleLogout}
        onReloadProjects={reloadProjects}
      />
    </div>
  );
}

export default App;
