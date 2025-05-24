import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs,
  Alert,
  Badge,
  Table,
  Modal,
  Spinner,
} from "react-bootstrap";
import "./Settings.css";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [loading, setLoading] = useState<boolean>(false);

  // Estados para configuraciones generales
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "DashSync Admin",
    supportEmail: "admin@dashsync.com",
    timezone: "America/Mexico_City",
    language: "es",
    maintenanceMode: false,
    enableNotifications: true,
  });

  // Estados para configuraciones de usuario
  const [userSettings, setUserSettings] = useState({
    defaultRole: "user",
    requireEmailVerification: true,
    allowSelfRegistration: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  // Estados para configuraciones de sistema
  const [systemSettings, setSystemSettings] = useState({
    enableLogging: true,
    logLevel: "info",
    backupFrequency: "daily",
    maxFileSize: 10, // MB
    enableAI: true,
    aiProvider: "openai",
  });

  // Estados para configuraciones de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notifyNewUsers: true,
    notifyNewProjects: true,
    notifySystemErrors: true,
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAlertType("success");
      setAlertMessage(`Configuración de ${section} guardada exitosamente`);
      setShowAlert(true);

      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage("Error al guardar la configuración");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="settings-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-header mb-1">
            <i className="bi bi-gear me-2 text-primary"></i>
            Configuración del Sistema
          </h1>
          <p className="text-muted mb-0">
            Administra las configuraciones globales del sistema
          </p>
        </div>
        <Badge bg="info" className="fs-6">
          <i className="bi bi-shield-check me-1"></i>
          Admin Only
        </Badge>
      </div>

      {showAlert && (
        <Alert
          variant={alertType}
          className="mb-4"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "general")}
        className="mb-4 custom-tabs"
      >
        {/* Configuración General */}
        <Tab
          eventKey="general"
          title={
            <span>
              <i className="bi bi-gear me-2"></i>
              General
            </span>
          }
        >
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-sliders me-2"></i>
                Configuración General
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Sistema</Form.Label>
                    <Form.Control
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          siteName: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email de Soporte</Form.Label>
                    <Form.Control
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          supportEmail: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Zona Horaria</Form.Label>
                    <Form.Select
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          timezone: e.target.value,
                        }))
                      }
                    >
                      <option value="America/Mexico_City">
                        México (GMT-6)
                      </option>
                      <option value="America/New_York">
                        Nueva York (GMT-5)
                      </option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Idioma del Sistema</Form.Label>
                    <Form.Select
                      value={generalSettings.language}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          language: e.target.value,
                        }))
                      }
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </Form.Select>
                  </Form.Group>

                  <div className="mb-3">
                    <h6>Opciones del Sistema</h6>
                    <Form.Check
                      type="switch"
                      id="maintenance-mode"
                      label="Modo Mantenimiento"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          maintenanceMode: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="enable-notifications"
                      label="Habilitar Notificaciones"
                      checked={generalSettings.enableNotifications}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          enableNotifications: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings("general")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Configuración de Usuarios */}
        <Tab
          eventKey="users"
          title={
            <span>
              <i className="bi bi-people me-2"></i>
              Usuarios
            </span>
          }
        >
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-person-gear me-2"></i>
                Configuración de Usuarios
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rol Predeterminado</Form.Label>
                    <Form.Select
                      value={userSettings.defaultRole}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          defaultRole: e.target.value,
                        }))
                      }
                    >
                      <option value="user">Usuario</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Administrador</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tiempo de Sesión (minutos)</Form.Label>
                    <Form.Control
                      type="number"
                      min="15"
                      max="480"
                      value={userSettings.sessionTimeout}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          sessionTimeout: parseInt(e.target.value),
                        }))
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Máximo Intentos de Login</Form.Label>
                    <Form.Control
                      type="number"
                      min="3"
                      max="10"
                      value={userSettings.maxLoginAttempts}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          maxLoginAttempts: parseInt(e.target.value),
                        }))
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <h6>Opciones de Registro</h6>
                    <Form.Check
                      type="switch"
                      id="require-email-verification"
                      label="Requerir Verificación de Email"
                      checked={userSettings.requireEmailVerification}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          requireEmailVerification: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="allow-self-registration"
                      label="Permitir Auto-registro"
                      checked={userSettings.allowSelfRegistration}
                      onChange={(e) =>
                        setUserSettings((prev) => ({
                          ...prev,
                          allowSelfRegistration: e.target.checked,
                        }))
                      }
                    />
                  </div>

                  <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="text-muted">
                      <i className="bi bi-info-circle me-2"></i>
                      Información
                    </h6>
                    <small className="text-muted">
                      Los cambios en la configuración de usuarios afectarán a
                      todos los nuevos registros.
                    </small>
                  </div>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings("usuarios")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Configuración del Sistema */}
        <Tab
          eventKey="system"
          title={
            <span>
              <i className="bi bi-cpu me-2"></i>
              Sistema
            </span>
          }
        >
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-server me-2"></i>
                Configuración del Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nivel de Logging</Form.Label>
                    <Form.Select
                      value={systemSettings.logLevel}
                      onChange={(e) =>
                        setSystemSettings((prev) => ({
                          ...prev,
                          logLevel: e.target.value,
                        }))
                      }
                    >
                      <option value="error">Solo Errores</option>
                      <option value="warn">Advertencias</option>
                      <option value="info">Información</option>
                      <option value="debug">Debug</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia de Backup</Form.Label>
                    <Form.Select
                      value={systemSettings.backupFrequency}
                      onChange={(e) =>
                        setSystemSettings((prev) => ({
                          ...prev,
                          backupFrequency: e.target.value,
                        }))
                      }
                    >
                      <option value="hourly">Cada Hora</option>
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tamaño Máximo de Archivo (MB)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      value={systemSettings.maxFileSize}
                      onChange={(e) =>
                        setSystemSettings((prev) => ({
                          ...prev,
                          maxFileSize: parseInt(e.target.value),
                        }))
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <div className="mb-3">
                    <h6>Funcionalidades</h6>
                    <Form.Check
                      type="switch"
                      id="enable-logging"
                      label="Habilitar Logging"
                      checked={systemSettings.enableLogging}
                      onChange={(e) =>
                        setSystemSettings((prev) => ({
                          ...prev,
                          enableLogging: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="enable-ai"
                      label="Habilitar Funciones de IA"
                      checked={systemSettings.enableAI}
                      onChange={(e) =>
                        setSystemSettings((prev) => ({
                          ...prev,
                          enableAI: e.target.checked,
                        }))
                      }
                      className="mb-3"
                    />
                  </div>

                  {systemSettings.enableAI && (
                    <Form.Group className="mb-3">
                      <Form.Label>Proveedor de IA</Form.Label>
                      <Form.Select
                        value={systemSettings.aiProvider}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            aiProvider: e.target.value,
                          }))
                        }
                      >
                        <option value="openai">OpenAI</option>
                        <option value="claude">Claude</option>
                        <option value="gemini">Google Gemini</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded">
                    <h6 className="text-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Advertencia
                    </h6>
                    <small className="text-muted">
                      Los cambios en la configuración del sistema pueden afectar
                      el rendimiento.
                    </small>
                  </div>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings("sistema")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Configuración de Notificaciones */}
        <Tab
          eventKey="notifications"
          title={
            <span>
              <i className="bi bi-bell me-2"></i>
              Notificaciones
            </span>
          }
        >
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-envelope-at me-2"></i>
                Configuración de Notificaciones
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h6>Tipos de Notificación</h6>
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="Notificaciones por Email"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="push-notifications"
                      label="Notificaciones Push"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushNotifications: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="sms-notifications"
                      label="Notificaciones SMS"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          smsNotifications: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-4">
                    <h6>Eventos de Notificación</h6>
                    <Form.Check
                      type="switch"
                      id="notify-new-users"
                      label="Nuevos Usuarios"
                      checked={notificationSettings.notifyNewUsers}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          notifyNewUsers: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notify-new-projects"
                      label="Nuevos Proyectos"
                      checked={notificationSettings.notifyNewProjects}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          notifyNewProjects: e.target.checked,
                        }))
                      }
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notify-system-errors"
                      label="Errores del Sistema"
                      checked={notificationSettings.notifySystemErrors}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          notifySystemErrors: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="primary"
                  onClick={() => handleSaveSettings("notificaciones")}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Settings;
