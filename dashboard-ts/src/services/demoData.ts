// Datos de demo para desarrollar sin conexión a Supabase
import { UserProfile } from "./userService";
import { Project } from "./projectService";

export const demoUsers: UserProfile[] = [
  {
    id: "1",
    email: "admin@johnteam.com",
    full_name: "Juan Administrador",
    is_admin: true,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "maria@johnteam.com",
    full_name: "María García",
    is_admin: false,
    is_active: true,
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    email: "carlos@johnteam.com",
    full_name: "Carlos López",
    is_admin: false,
    is_active: true,
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    email: "ana@johnteam.com",
    full_name: "Ana Martínez",
    is_admin: false,
    is_active: false,
    created_at: "2024-02-10T11:45:00Z",
  },
  {
    id: "5",
    email: "luis@johnteam.com",
    full_name: "Luis Rodríguez",
    is_admin: true,
    is_active: true,
    created_at: "2024-02-15T16:20:00Z",
  },
];

export const demoProjects: Project[] = [
  {
    id: "1",
    name: "Website E-commerce",
    description:
      "Desarrollo de tienda online con carrito de compras, pagos integrados y gestión de inventario.",
    type: "web",
    status: "active",
    user_id: "1",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "App Móvil Delivery",
    description:
      "Aplicación móvil para pedidos de comida con geolocalización y seguimiento en tiempo real.",
    type: "mobile",
    status: "pending",
    user_id: "2",
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Rediseño de Marca",
    description:
      "Nuevo diseño de identidad corporativa incluyendo logo, colores y guía de estilo.",
    type: "design",
    status: "completed",
    user_id: "3",
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    name: "Campaña Social Media",
    description:
      "Estrategia de marketing digital para redes sociales con contenido y publicidad pagada.",
    type: "marketing",
    status: "active",
    user_id: "4",
    created_at: "2024-02-10T11:45:00Z",
  },
  {
    id: "5",
    name: "Sistema CRM",
    description:
      "Plataforma web para gestión de clientes, ventas y seguimiento de leads.",
    type: "web",
    status: "pending",
    user_id: "5",
    created_at: "2024-02-15T16:20:00Z",
  },
  {
    id: "6",
    name: "App Fitness",
    description:
      "Aplicación móvil para rutinas de ejercicio, seguimiento de progreso y nutrición.",
    type: "mobile",
    status: "canceled",
    user_id: "1",
    created_at: "2024-02-20T08:30:00Z",
  },
];

// Simulación de estadísticas de IA
export const demoAIStats = {
  totalCompletions: 42,
  totalSearches: 128,
  averageResponseTime: 1.2,
  successRate: 95.5,
};

// Helper para generar IDs únicos
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper para simular delay de red
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
