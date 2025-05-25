import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import { AuthService } from "./services/authService";
import {
  ProjectService,
  type ProjectWithDetails,
} from "./services/projectService";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "./services/authService";
import "./index.css";
import supabase from "./lib/supabase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Manejar cambio entre login y registro
  const toggleRegister = () => {
    setShowRegister(!showRegister);
    // Limpiar cualquier mensaje de error al cambiar de vista
    setAuthError(null);
  };

  // Comprobar el estado de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Verificar la sesión directamente
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error al obtener sesión:", sessionError);
          setAuthError(
            "Error al verificar tu sesión. Por favor, inicia sesión nuevamente."
          );
          setUser(null);
          setLoading(false);
          return;
        }

        // Si no hay sesión, no hay usuario autenticado
        if (!sessionData.session) {
          console.log("No hay sesión activa");
          setUser(null);
          setLoading(false);
          return;
        }

        // Obtener usuario actual
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error al obtener usuario:", userError);
          setAuthError(
            "Error al obtener datos de usuario. Por favor, inicia sesión nuevamente."
          );
          setUser(null);
        } else if (userData?.user) {
          console.log("Usuario autenticado:", userData.user.email);
          setUser(userData.user);

          // Obtener perfil de usuario
          try {
            const profile = await AuthService.getCurrentUserProfile();
            setUserProfile(profile);

            // Cargar proyectos del usuario
            await loadUserProjects();
          } catch (profileError) {
            console.error("Error al obtener perfil:", profileError);
          }
        }
      } catch (error) {
        console.error("Error general al comprobar autenticación:", error);
        setAuthError(
          "Error de conexión. Por favor, intenta de nuevo más tarde."
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Configurar listener para cambios de autenticación
    const { data: authListener } = AuthService.onAuthStateChange(
      async (updatedUser) => {
        setUser(updatedUser);

        if (updatedUser) {
          try {
            const profile = await AuthService.getCurrentUserProfile();
            setUserProfile(profile);

            // Cargar proyectos del usuario al iniciar sesión
            await loadUserProjects();
          } catch (error) {
            console.error(
              "Error al obtener datos después de autenticación:",
              error
            );
          }
        } else {
          setUserProfile(null);
          setProjects([]);
        }
      }
    );

    return () => {
      // Limpiar el listener al desmontar
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Cargar proyectos del usuario
  const loadUserProjects = async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const userProjects = await ProjectService.getUserProjects();
      setProjects(userProjects);
    } catch (error: any) {
      console.error("Error al cargar proyectos:", error);
      setProjectsError(error.message || "Error al cargar proyectos");
    } finally {
      setProjectsLoading(false);
    }
  };

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
      setProjects([]);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando portal...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar formulario de login o registro
  if (!user) {
    return (
      <div className="min-vh-100 bg-light">
        {showRegister ? (
          <RegisterForm onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm
            onRegisterClick={() => setShowRegister(true)}
            initialError={authError}
          />
        )}
      </div>
    );
  }

  // Si hay usuario, mostrar el dashboard
  return (
    <Dashboard
      user={user}
      userProfile={userProfile}
      projects={projects}
      loading={projectsLoading}
      error={projectsError}
      onLogout={handleLogout}
      onReloadProjects={loadUserProjects}
    />
  );
}

export default App;
