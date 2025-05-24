import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import projectService from "../../services/projectService";
import userService from "../../services/userService";
import aiService from "../../services/aiService";
import { Project } from "../../services/projectService";
import { UserProfile } from "../../services/userService";
import "./Dashboard.css";

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    completedProjects: 0,
    aiCompletions: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Cargar datos de diferentes servicios en paralelo
        const [users, projects, aiStats] = await Promise.all([
          userService.getAll(),
          projectService.getAll(),
          aiService.getUsageStats(),
        ]);

        // Calcular estadísticas
        setStats({
          totalUsers: users.length,
          activeUsers: users.filter((user) => user.is_active).length,
          totalProjects: projects.length,
          completedProjects: projects.filter(
            (project) => project.status === "completed"
          ).length,
          aiCompletions: aiStats.totalCompletions,
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos para el gráfico de línea - Usuarios registrados por mes
  const lineChartData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Usuarios",
        data: [8, 12, 15, 18, 24, 28, 35, 39, 45, 50, 60, stats.totalUsers],
        borderColor: "rgba(62, 100, 255, 0.8)",
        backgroundColor: "rgba(62, 100, 255, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Opciones para el gráfico de línea
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(45, 55, 72, 0.9)",
        padding: 12,
        bodySpacing: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Datos para el gráfico de dona - Estado de proyectos
  const doughnutChartData = {
    labels: ["Completados", "Activos", "Pendientes"],
    datasets: [
      {
        data: [
          stats.completedProjects,
          stats.totalProjects -
            stats.completedProjects -
            Math.floor(stats.totalProjects * 0.2),
          Math.floor(stats.totalProjects * 0.2),
        ],
        backgroundColor: [
          "rgba(56, 178, 172, 0.9)",
          "rgba(90, 103, 216, 0.9)",
          "rgba(246, 173, 85, 0.9)",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  // Opciones para el gráfico de dona
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
    cutout: "70%",
  };

  return (
    <Container fluid className="dashboard-container">
      {/* Estadísticas principales */}
      <Row className="slide-in-up">
        <Col md={3} sm={6}>
          <div className="stat-card">
            <i className="bi bi-people-fill stat-icon"></i>
            <div className="stat-value">{stats.totalUsers}</div>
            <p className="stat-label">Usuarios Totales</p>
            <div className="stat-progress">
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{
                    width: `${
                      (stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <small className="text-muted">
                {stats.activeUsers} activos (
                {Math.round(
                  (stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100
                )}
                %)
              </small>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div className="stat-card">
            <i className="bi bi-kanban stat-icon"></i>
            <div className="stat-value">{stats.totalProjects}</div>
            <p className="stat-label">Proyectos Totales</p>
            <div className="stat-progress">
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${
                      (stats.completedProjects /
                        Math.max(stats.totalProjects, 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <small className="text-muted">
                {stats.completedProjects} completados (
                {Math.round(
                  (stats.completedProjects / Math.max(stats.totalProjects, 1)) *
                    100
                )}
                %)
              </small>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div className="stat-card">
            <i className="bi bi-robot stat-icon"></i>
            <div className="stat-value">{stats.aiCompletions}</div>
            <p className="stat-label">Generaciones IA</p>
            <div className="stat-progress">
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar bg-info"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <small className="text-muted">+15% vs. mes anterior</small>
            </div>
          </div>
        </Col>

        <Col md={3} sm={6}>
          <div className="stat-card">
            <i className="bi bi-graph-up stat-icon"></i>
            <div className="stat-value">89%</div>
            <p className="stat-label">Tasa de Eficiencia</p>
            <div className="stat-progress">
              <div className="progress" style={{ height: "5px" }}>
                <div
                  className="progress-bar bg-accent"
                  style={{ width: "89%" }}
                ></div>
              </div>
              <small className="text-muted">+3% vs. mes anterior</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="mt-4 slide-in-up" style={{ animationDelay: "0.1s" }}>
        <Col lg={8}>
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Usuarios Registrados</h5>
              <div className="card-actions">
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-download"></i> Exportar
                </Button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="mb-0">Estado de Proyectos</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={doughnutChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Actividad reciente */}
      <Row className="mt-4 slide-in-up" style={{ animationDelay: "0.2s" }}>
        <Col lg={6}>
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body p-0">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon bg-primary">
                    <i className="bi bi-person-plus"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      Nuevo usuario registrado
                    </div>
                    <div className="activity-text">
                      Maria Lopez se ha unido a la plataforma
                    </div>
                    <div className="activity-time">Hace 25 minutos</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon bg-success">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Proyecto completado</div>
                    <div className="activity-text">
                      Rediseño web corporativa finalizado
                    </div>
                    <div className="activity-time">Hace 2 horas</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon bg-warning">
                    <i className="bi bi-pencil"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Proyecto actualizado</div>
                    <div className="activity-text">
                      Campaña de marketing digital modificada
                    </div>
                    <div className="activity-time">Hace 5 horas</div>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon bg-info">
                    <i className="bi bi-robot"></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      Generación IA completada
                    </div>
                    <div className="activity-text">
                      Descripción generada para proyecto e-commerce
                    </div>
                    <div className="activity-time">Ayer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="mb-0">Proyectos Destacados</h5>
            </div>
            <div className="card-body p-0">
              <div className="project-list">
                <div className="project-item">
                  <div className="project-info">
                    <h6 className="project-name">Plataforma de e-learning</h6>
                    <p className="project-desc mb-0">
                      Desarrollo de LMS para universidad
                    </p>
                  </div>
                  <div className="project-status">
                    <div
                      className="progress"
                      style={{ height: "8px", width: "100px" }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <small>75% completado</small>
                  </div>
                </div>

                <div className="project-item">
                  <div className="project-info">
                    <h6 className="project-name">
                      Aplicación móvil de fitness
                    </h6>
                    <p className="project-desc mb-0">
                      App de seguimiento de ejercicios
                    </p>
                  </div>
                  <div className="project-status">
                    <div
                      className="progress"
                      style={{ height: "8px", width: "100px" }}
                    >
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <small>45% completado</small>
                  </div>
                </div>

                <div className="project-item">
                  <div className="project-info">
                    <h6 className="project-name">Rediseño sitio corporativo</h6>
                    <p className="project-desc mb-0">
                      Web responsive con nuevo branding
                    </p>
                  </div>
                  <div className="project-status">
                    <div
                      className="progress"
                      style={{ height: "8px", width: "100px" }}
                    >
                      <div
                        className="progress-bar bg-info"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                    <small>90% completado</small>
                  </div>
                </div>

                <div className="project-item">
                  <div className="project-info">
                    <h6 className="project-name">Sistema de inventario</h6>
                    <p className="project-desc mb-0">
                      Software de gestión para retail
                    </p>
                  </div>
                  <div className="project-status">
                    <div
                      className="progress"
                      style={{ height: "8px", width: "100px" }}
                    >
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                    <small>30% completado</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
