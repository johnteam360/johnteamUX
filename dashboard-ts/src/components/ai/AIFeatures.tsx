import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import aiService from "../../services/aiService";
import projectService from "../../services/projectService";
import { Project } from "../../services/projectService";
import "./AIFeatures.css";

const AIFeatures: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");
  const [usageStats, setUsageStats] = useState({
    totalCompletions: 0,
    totalSearches: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Cargar proyectos y estadísticas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, statsData] = await Promise.all([
          projectService.getAll(),
          aiService.getUsageStats(),
        ]);
        setProjects(projectsData);
        setUsageStats(statsData);
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
        }
      } catch (err) {
        setError("Error al cargar datos");
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generar descripción con IA
  const handleGenerateDescription = async () => {
    if (!prompt.trim()) return;

    try {
      setGenerating(true);
      setError("");

      const response = await aiService.generateCompletion({
        prompt: prompt,
        projectId: selectedProjectId,
      });

      setGeneratedText(response);

      // Actualizar el proyecto si hay uno seleccionado
      if (selectedProjectId) {
        const updatedProject = await projectService.update(selectedProjectId, {
          description: response,
        });

        // Actualizar la lista de proyectos
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === updatedProject.id ? updatedProject : p
          )
        );
      }

      // Actualizar estadísticas de uso
      const updatedStats = await aiService.getUsageStats();
      setUsageStats(updatedStats);
    } catch (err) {
      setError("Error al generar texto con IA");
      console.error("Error de generación de IA:", err);
    } finally {
      setGenerating(false);
    }
  };

  // Limpiar la respuesta generada
  const handleClear = () => {
    setGeneratedText("");
    setPrompt("");
  };

  return (
    <Container fluid className="ai-features-container">
      <h1 className="page-header">Funcionalidades de IA</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            <Col lg={4}>
              <div className="dashboard-card">
                <div className="card-header">Estadísticas de IA</div>
                <div className="card-body">
                  <div className="stats-item mb-3">
                    <h3>{usageStats.totalCompletions}</h3>
                    <p className="text-muted">Generaciones de texto</p>
                  </div>
                  <div className="stats-item">
                    <h3>{usageStats.totalSearches}</h3>
                    <p className="text-muted">Búsquedas con IA</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={8}>
              <div className="dashboard-card">
                <div className="card-header">
                  Generador de descripciones con IA
                </div>
                <div className="card-body">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="project-select">Proyecto</Form.Label>
                      <Form.Select
                        id="project-select"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        disabled={projects.length === 0}
                        aria-label="Seleccionar proyecto"
                      >
                        {projects.length > 0 ? (
                          projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))
                        ) : (
                          <option value="">No hay proyectos disponibles</option>
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="prompt-textarea">
                        Prompt para IA
                      </Form.Label>
                      <Form.Control
                        id="prompt-textarea"
                        as="textarea"
                        rows={3}
                        placeholder="Ejemplo: Genera una descripción profesional para un proyecto de sitio web corporativo..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={handleGenerateDescription}
                        disabled={
                          generating || !prompt.trim() || !selectedProjectId
                        }
                      >
                        {generating ? (
                          <>
                            <Spinner animation="border" size="sm" />{" "}
                            Generando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-magic"></i> Generar descripción
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleClear}
                        disabled={!generatedText && !prompt}
                      >
                        <i className="bi bi-eraser"></i> Limpiar
                      </Button>
                    </div>
                  </Form>

                  {generatedText && (
                    <div className="ai-response mt-4">
                      <h5>Descripción generada</h5>
                      <p>{generatedText}</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <div className="dashboard-card">
                <div className="card-header">Instrucciones</div>
                <div className="card-body">
                  <h5>Cómo usar el generador de IA</h5>
                  <ol>
                    <li>Selecciona un proyecto de la lista desplegable.</li>
                    <li>
                      Escribe un prompt descriptivo de lo que deseas generar.
                    </li>
                    <li>
                      Haz clic en "Generar descripción" y espera la respuesta.
                    </li>
                    <li>
                      La descripción generada se guardará automáticamente en el
                      proyecto seleccionado.
                    </li>
                  </ol>

                  <h5>Consejos para mejores resultados</h5>
                  <ul>
                    <li>
                      Sé específico en tu prompt. Por ejemplo: "Escribe una
                      descripción para un proyecto de e-commerce para una tienda
                      de ropa deportiva".
                    </li>
                    <li>
                      Incluye detalles relevantes como el público objetivo,
                      objetivos del proyecto o características especiales.
                    </li>
                    <li>
                      Puedes solicitar un tono específico, como "formal",
                      "amigable" o "técnico".
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AIFeatures;
