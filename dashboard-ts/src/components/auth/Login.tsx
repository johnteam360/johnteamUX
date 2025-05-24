import React, { useState, FormEvent } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Login real con Supabase
      const { data, error } = await authService.login({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.session) {
        if (import.meta.env.DEV) {
          console.log("Login exitoso:", data.session.user.email);
        }
        navigate("/");
      } else {
        throw new Error("No se pudo iniciar sesión");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido durante el inicio de sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline para asegurar que se apliquen
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1rem",
    },
    card: {
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      padding: "2.5rem",
      maxWidth: "450px",
      width: "100%",
      backgroundColor: "white",
    },
    title: {
      color: "#4a5568",
      fontWeight: 700,
      fontSize: "2rem",
      marginBottom: "0.5rem",
    },
    button: {
      backgroundColor: "#4c51bf",
      borderColor: "#4c51bf",
      padding: "0.75rem 0",
      fontWeight: 600,
      fontSize: "1rem",
      borderRadius: "8px",
      transition: "all 0.3s ease",
    },
    icon: {
      fontSize: "2rem",
      color: "#4c51bf",
      marginBottom: "1rem",
    },
    formControl: {
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f7fafc",
    },
    formLabel: {
      color: "#4a5568",
      fontWeight: 500,
    },
    link: {
      color: "#4c51bf",
      fontWeight: 500,
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <Row
        className="justify-content-center align-items-center"
        style={{ width: "100%" }}
      >
        <Col xs={12} md={6} lg={5} xl={4}>
          <Card style={styles.card}>
            <Card.Body>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="#4c51bf"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                </div>
                <h2 style={styles.title}>Admin Dashboard</h2>
                <p className="text-muted">Inicia sesión en tu cuenta</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i> {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label style={styles.formLabel}>
                    <i className="bi bi-envelope me-2"></i>
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Introduce tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.formControl}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label style={styles.formLabel}>
                    <i className="bi bi-key me-2"></i>
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.formControl}
                  />
                </Form.Group>

                <Form.Group className="mb-4 d-flex justify-content-between">
                  <Form.Check
                    type="checkbox"
                    label="Recordarme"
                    id="rememberMe"
                  />
                  <Link to="/forgot-password" style={styles.link}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    style={styles.button}
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
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar sesión
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
