import React, { useState } from "react";
import { AuthService } from "../services/authService";

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setDebugInfo("");

      console.log(`Intentando iniciar sesión con: ${email}`);
      const result = await AuthService.signIn(email, password);

      // Si llegamos aquí sin error, la autenticación fue exitosa
      console.log("Inicio de sesión exitoso:", result.user?.id);

      // Verificar si hay perfil de usuario
      if (result.user) {
        const profile = await AuthService.getCurrentUserProfile();
        console.log("Perfil obtenido:", profile ? "Sí" : "No");

        if (!profile) {
          setDebugInfo(
            "Advertencia: No se pudo obtener el perfil de usuario. Se intentará crear uno básico."
          );
        }
      }
    } catch (err: any) {
      console.error("Error al iniciar sesión:", err);

      // Mensajes de error personalizados
      if (err.message?.includes("Invalid login credentials")) {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError(
          "Tu email no ha sido confirmado. Por favor, revisa tu bandeja de entrada."
        );
      } else {
        setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.");
      }

      // Información de depuración en desarrollo
      if (import.meta.env.DEV) {
        setDebugInfo(`Error detallado: ${err.message || "Desconocido"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                {/* Logo y encabezado */}
                <div className="text-center mb-4">
                  <img
                    src="/logo-small.svg"
                    alt="JohnTeam Logo"
                    width="60"
                    className="mb-3"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <h3 className="card-title mb-1">Portal del Cliente</h3>
                  <p className="text-muted small">
                    Inicia sesión para ver el estado de tus proyectos
                  </p>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* Info de depuración */}
                {debugInfo && (
                  <div className="alert alert-warning small" role="alert">
                    <i className="bi bi-info-circle me-2"></i>
                    {debugInfo}
                  </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </button>
                </form>

                {/* Enlace a registro */}
                <div className="text-center mt-3">
                  <p className="mb-0">
                    ¿No tienes cuenta?{" "}
                    <button
                      className="btn btn-link p-0"
                      onClick={onRegisterClick}
                      disabled={loading}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
