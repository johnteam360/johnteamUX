# 👥 Dashboard de Usuario - JohnTeam

Dashboard personalizado para clientes, con acceso de solo lectura a sus proyectos.

## 🚀 **Inicio Rápido**

### Prerrequisitos

- Node.js 18+
- Variables de entorno configuradas (ver sección de Configuración)

### Instalación

```bash
cd user-dashboard
npm install
npm run dev
```

### Acceso

- **URL:** http://localhost:5174
- **Credenciales:** Solicitar al administrador

## 🎯 **Características**

### ✅ **Funcionalidades**

- 👤 **Autenticación segura** con Supabase
- 📊 **Dashboard personalizado** con estadísticas del usuario
- 📋 **Lista de proyectos** solo del usuario logueado
- 🔍 **Vista detallada** de proyectos con fases y actualizaciones
- 📱 **Interfaz responsiva** con Bootstrap 5.3.0
- 🔒 **Solo lectura** - sin capacidades de edición

### 🛡️ **Seguridad**

- ✅ **RLS (Row Level Security)** implementado
- ✅ **Aislamiento de datos** por usuario
- ✅ **Autenticación real** con Supabase Auth
- ✅ **Acceso controlado** solo a datos propios

## 📁 **Estructura**

```
user-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Panel principal
│   │   ├── LoginForm.tsx      # Formulario de login
│   │   ├── ProjectList.tsx    # Lista de proyectos
│   │   └── ProjectDetail.tsx  # Detalle del proyecto
│   ├── services/
│   │   ├── authService.ts     # Autenticación
│   │   └── projectService.ts  # Gestión de proyectos
│   └── lib/
│       └── supabase.ts        # Cliente Supabase
├── package.json
└── README.md
```

## 🔧 **Configuración**

### Variables de Entorno (.env.local)

```env
VITE_SUPABASE_URL=<URL_DE_SUPABASE>
VITE_SUPABASE_ANON_KEY=<CLAVE_ANONIMA_DE_SUPABASE>
```

**Notas importantes:**

- Nunca compartas estas claves en repositorios públicos
- El archivo .env.local está incluido en .gitignore
- Solicita estas claves al administrador del proyecto

## 📊 **Datos de Prueba**

### Usuario de Prueba

- **Email:** [Solicitar al administrador]
- **Contraseña:** [Solicitar al administrador]
- **Rol:** Usuario (cliente)
- **Proyectos:** Solo los asignados a este usuario

## 🎨 **Tecnologías**

- **Frontend:** React 19.1.0 + TypeScript
- **Estilos:** Bootstrap 5.3.0
- **Build:** Vite 6.3.5
- **Base de datos:** Supabase
- **Puerto:** 5174

## 🚧 **Diferencias con Dashboard Admin**

| Característica       | Dashboard Usuario  | Dashboard Admin |
| -------------------- | ------------------ | --------------- |
| **Puerto**           | 5174               | 3000            |
| **Acceso**           | Solo datos propios | Todos los datos |
| **Permisos**         | Solo lectura       | CRUD completo   |
| **Funciones IA**     | No                 | Sí              |
| **Gestión usuarios** | No                 | Sí              |

## 📝 **Scripts**

```bash
npm run dev      # Desarrollo (puerto 5174)
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 🐛 **Debugging**

### Logs

- **Desarrollo:** Logs visibles en consola
- **Producción:** Solo errores críticos

### Problemas Comunes

1. **No ve proyectos:** Verificar autenticación
2. **Error de permisos:** Verificar políticas RLS
3. **No carga:** Verificar variables de entorno

## ✅ **Estado del Proyecto**

- 🟢 **Funcional:** 100% operativo
- 🟢 **Seguridad:** RLS implementado
- 🟢 **Performance:** Optimizado
- 🟢 **UX:** Interfaz completa y responsiva
