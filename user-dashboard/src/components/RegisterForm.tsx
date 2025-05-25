import React, { useState } from "react";
import { AuthService } from "../services/authService";
import supabase from "../lib/supabase";

interface RegisterFormProps {
  onBackToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    projectObjective: "",
    industry: "",
    expectedTimeline: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.companyName.trim())
      return "El nombre de la empresa es obligatorio";
    if (!formData.fullName.trim())
      return "El nombre del usuario es obligatorio";
    if (!formData.email.trim()) return "El correo electrónico es obligatorio";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return "El correo electrónico no es válido";

    if (formData.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    if (formData.password !== formData.confirmPassword)
      return "Las contraseñas no coinciden";

    return null;
  };

  // Función para verificar manualmente un email (solo para demo)
  const handleVerifyManually = async () => {
    try {
      setLoading(true);
      console.log("Iniciando verificación manual para:", formData.email);

      // Solo para desarrollo - esto normalmente se haría mediante el enlace de confirmación
      const { data: user } = await supabase.auth.getUser();

      if (!user || !user.user || !user.user.id) {
        throw new Error("No se pudo obtener el usuario");
      }

      console.log("Usuario encontrado:", user.user.id);

      // Crear o actualizar el perfil usando el AuthService
      const profileData = {
        id: user.user.id,
        full_name: formData.fullName,
        company_name: formData.companyName,
        project_objective: formData.projectObjective,
        industry: formData.industry,
        expected_timeline: formData.expectedTimeline,
        email: formData.email,
        is_admin: false,
      };

      // Primero intentamos con AuthService
      try {
        const profile = await AuthService.createUserProfile(profileData);
        console.log("Perfil actualizado mediante AuthService:", profile);
      } catch (authError) {
        console.error("Error al actualizar perfil con AuthService:", authError);

        // Como fallback, usamos upsert directo
        console.log("Intentando actualización directa...");
        const { data, error } = await supabase
          .from("user_profiles")
          .upsert(profileData, { onConflict: "id" })
          .select();

        if (error) {
          console.error("Error en actualización directa:", error);
          throw error;
        } else {
          console.log("Perfil actualizado mediante upsert directo:", data);
        }
      }

      setSuccess(true);
      setShowVerificationMessage(false);
    } catch (err: any) {
      console.error("Error al verificar manualmente:", err);
      setError(err.message || "Error al verificar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      console.log("Iniciando registro con datos:", {
        email: formData.email,
        fullName: formData.fullName,
        companyName: formData.companyName,
        // No imprimir contraseña por seguridad
      });

      // Verificar primero si el correo ya existe
      const { data: existingUser } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: false,
        },
      });

      // Si Supabase no da error pero tampoco crea un usuario, es porque el correo ya existe
      if (existingUser && existingUser.user === null) {
        setError(
          "Este correo electrónico ya está registrado. Por favor inicia sesión."
        );
        setLoading(false);
        return;
      }

      // Preparar los datos del perfil
      const profileData = {
        full_name: formData.fullName,
        company_name: formData.companyName,
        project_objective: formData.projectObjective,
        industry: formData.industry,
        expected_timeline: formData.expectedTimeline,
        email: formData.email,
        is_admin: false,
      };

      // Usar el método actualizado de AuthService que maneja todo el proceso
      const result = await AuthService.signUp(
        formData.email,
        formData.password,
        profileData
      );

      if (!result || !result.user) {
        throw new Error("Error al crear la cuenta");
      }

      // Verificar si la respuesta contiene identities vacías, lo que indica un usuario existente
      if (result.user.identities && result.user.identities.length === 0) {
        setError(
          "Este correo electrónico ya está registrado. Por favor inicia sesión."
        );
        setLoading(false);
        return;
      }

      console.log("Usuario creado con ID:", result.user.id);

      // Verificar si necesita confirmar el email
      if (result.user && !result.user.email_confirmed_at) {
        setShowVerificationMessage(true);
        setSuccess(false);

        // Para desarrollo - facilitar verificación
        if (import.meta.env.DEV) {
          console.log(
            "URL para verificación en desarrollo: ",
            window.location.origin + "/dashboard"
          );
        }
      } else {
        setSuccess(true);
        setShowVerificationMessage(false);
      }
    } catch (err: any) {
      console.error("❌ Error al registrar usuario:", err);
      setSuccess(false);

      // Mensajes de error personalizados
      if (
        err.message?.includes("already registered") ||
        err.message?.includes("User already registered") ||
        err.message?.includes("existing") ||
        err.message?.includes("usuario ya existe")
      ) {
        setError(
          "Este correo electrónico ya está registrado. Por favor inicia sesión."
        );
      } else {
        setError(
          err.message || "Error al crear la cuenta. Inténtalo de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-4">
                  <h3 className="card-title mb-2">Crear cuenta nueva</h3>
                  <p className="text-muted small">
                    Completa el formulario para crear tu cuenta
                  </p>
                </div>

                {/* Mensaje de éxito */}
                {success ? (
                  <div className="alert alert-success" role="alert">
                    <h5 className="alert-heading">¡Registro exitoso!</h5>
                    <p>
                      Tu cuenta ha sido creada correctamente. Ya puedes iniciar
                      sesión.
                    </p>
                    <hr />
                    <div className="text-center">
                      <button
                        className="btn btn-primary"
                        onClick={onBackToLogin}
                      >
                        Volver a Iniciar Sesión
                      </button>
                    </div>
                  </div>
                ) : showVerificationMessage ? (
                  <div className="alert alert-warning" role="alert">
                    <h5 className="alert-heading">
                      ¡Verifica tu correo electrónico!
                    </h5>
                    <p>
                      Hemos enviado un enlace de confirmación a tu correo
                      electrónico. Por favor, revisa tu bandeja de entrada y
                      confirma tu correo para activar tu cuenta.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={onBackToLogin}
                      >
                        Volver a Iniciar Sesión
                      </button>

                      {/* Solo para entorno de desarrollo - botón para verificar manualmente */}
                      {import.meta.env.DEV && (
                        <button
                          className="btn btn-warning"
                          onClick={handleVerifyManually}
                          disabled={loading}
                        >
                          {loading
                            ? "Verificando..."
                            : "Verificar manualmente (solo demo)"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Error */}
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="companyName" className="form-label">
                            Nombre de la empresa *
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className="form-control"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="fullName" className="form-label">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="password" className="form-label">
                            Contraseña *
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirmar contraseña *
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="projectObjective"
                          className="form-label"
                        >
                          Objetivo del proyecto
                        </label>
                        <textarea
                          id="projectObjective"
                          name="projectObjective"
                          className="form-control"
                          value={formData.projectObjective}
                          onChange={handleChange}
                          rows={3}
                          disabled={loading}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="industry" className="form-label">
                            Industria o sector
                          </label>
                          <select
                            id="industry"
                            name="industry"
                            className="form-select"
                            value={formData.industry}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Selecciona una opción</option>
                            <option value="Tecnología">Tecnología</option>
                            <option value="Salud">Salud</option>
                            <option value="Educación">Educación</option>
                            <option value="Comercio">Comercio</option>
                            <option value="Manufactura">Manufactura</option>
                            <option value="Servicios">Servicios</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="expectedTimeline"
                            className="form-label"
                          >
                            Tiempo estimado del proyecto
                          </label>
                          <select
                            id="expectedTimeline"
                            name="expectedTimeline"
                            className="form-select"
                            value={formData.expectedTimeline}
                            onChange={handleChange}
                            disabled={loading}
                          >
                            <option value="">Selecciona una opción</option>
                            <option value="1-3 meses">1-3 meses</option>
                            <option value="3-6 meses">3-6 meses</option>
                            <option value="6-12 meses">6-12 meses</option>
                            <option value="Más de 1 año">Más de 1 año</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creando cuenta...
                          </>
                        ) : (
                          "Crear Cuenta"
                        )}
                      </button>
                    </form>

                    {/* Enlace para volver */}
                    <div className="text-center mt-4">
                      <button
                        className="btn btn-link"
                        onClick={onBackToLogin}
                        disabled={loading}
                      >
                        ¿Ya tienes cuenta? Inicia sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
