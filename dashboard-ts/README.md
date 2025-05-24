# Dashboard Admin - TypeScript + React

Este proyecto es una migración del Dashboard de administración original a una aplicación moderna construida con TypeScript y React.

## Tecnologías utilizadas

- React 18
- TypeScript
- React Router v6
- Supabase para backend y autenticación
- React-Bootstrap para UI
- Chart.js para visualización de datos

## Características

- ✅ Autenticación de usuarios con roles
- ✅ Dashboard con estadísticas y gráficos
- ✅ Gestión de usuarios
- ✅ Gestión de proyectos
- ✅ Integración con IA de Supabase

## Estructura del Proyecto

```
dashboard/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes de React
│   │   ├── common/      # Componentes comunes (Layout, Header, Sidebar)
│   │   ├── auth/        # Componentes de autenticación
│   │   ├── dashboard/   # Componentes del Dashboard principal
│   │   ├── projects/    # Componentes para gestión de proyectos
│   │   ├── users/       # Componentes para gestión de usuarios
│   │   └── ai/          # Componentes para funcionalidades de IA
│   ├── services/        # Servicios para comunicación con API
│   ├── hooks/           # Hooks personalizados
│   ├── types/           # Definiciones de TypeScript
│   ├── utils/           # Utilidades
│   ├── contexts/        # Contextos de React
│   └── styles/          # Archivos CSS globales
└── vite.config.ts       # Configuración de Vite
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` con las siguientes variables:

   ```
   VITE_SUPABASE_URL=<URL_DE_TU_PROYECTO_SUPABASE>
   VITE_SUPABASE_ANON_KEY=<CLAVE_ANONIMA_DE_TU_PROYECTO>
   ```

   **IMPORTANTE SOBRE SEGURIDAD:**

   - NUNCA subas este archivo a repositorios públicos
   - NUNCA compartas estas claves en código fuente
   - El archivo `.env.local` está incluido en `.gitignore`
   - Solicita estas claves al administrador de infraestructura

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión construida localmente

## Supabase

Este proyecto utiliza Supabase como backend. Asegúrate de tener las siguientes funcionalidades configuradas:

1. Autenticación con email y contraseña
2. Tablas:
   - `profiles` - Información de usuarios
   - `projects` - Información de proyectos
3. Funciones RPC:
   - `get_ai_completion` - Para generación de texto con IA
   - `search_users_with_ai` - Para búsqueda avanzada con IA

## Seguridad

- El dashboard de administrador tiene protección por roles
- Solo los usuarios con `is_admin=true` pueden acceder
- Las operaciones críticas están protegidas con RLS en Supabase
- Todas las contraseñas se manejan a través de Supabase Auth
- NUNCA almacenes contraseñas o claves API en código

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añadir característica increíble'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
