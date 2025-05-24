# 🎯 Dashboard de Usuario - JohnTeam

## 📋 Descripción

Este es el **Dashboard de USUARIO/CLIENTE** - separado completamente del dashboard de administrador.

## 🚀 Cómo Ejecutar

### 1. Navegar al directorio correcto

```bash
cd user-dashboard
```

### 2. Instalar dependencias (si es necesario)

```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 4. Acceder al dashboard

- **URL:** http://localhost:5174
- **Puerto:** 5174 (diferente al admin que usa 3001)

## 🔐 Credenciales de Prueba

### Usuario Normal (Cliente)

- **Email:** wolfdarius23@gmail.com
- **Contraseña:** [tu contraseña]

### ⚠️ NO usar credenciales de admin aquí

## 🎯 Funcionalidades

✅ **Solo Lectura** - Los usuarios no pueden modificar proyectos
✅ **Datos Filtrados** - Solo ve sus propios proyectos
✅ **Seguridad RLS** - Políticas de seguridad implementadas
✅ **Interfaz Limpia** - Diseño específico para clientes

## 🔄 Diferencias con Dashboard Admin

| Característica | Dashboard Usuario      | Dashboard Admin       |
| -------------- | ---------------------- | --------------------- |
| Puerto         | 5174                   | 3001                  |
| Acceso         | Solo proyectos propios | Todos los proyectos   |
| Permisos       | Solo lectura           | Crear/Editar/Eliminar |
| Usuarios       | Clientes               | Administradores       |
| Funciones IA   | No                     | Sí                    |

## 🛡️ Seguridad

- ✅ Políticas RLS implementadas
- ✅ Aislamiento de datos por usuario
- ✅ Autenticación requerida
- ✅ Sin acceso a funciones administrativas

## 📁 Estructura del Proyecto

```
user-dashboard/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx      # Formulario de login
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── ProjectList.tsx    # Lista de proyectos
│   │   └── ProjectDetail.tsx  # Detalles del proyecto
│   ├── services/
│   │   ├── authService.ts     # Servicio de autenticación
│   │   └── projectService.ts  # Servicio de proyectos
│   ├── lib/
│   │   └── supabase.ts        # Cliente Supabase
│   └── types/
│       └── supabase.ts        # Tipos TypeScript
├── package.json
└── vite.config.ts
```

## 🐛 Solución de Problemas

### Si ves el dashboard de admin en lugar del de usuario:

1. Verifica que estés en el directorio `user-dashboard/`
2. Verifica que el puerto sea 5174, no 3001
3. Cierra cualquier servidor en puerto 3001

### Si no puedes hacer login:

1. Usa credenciales de USUARIO, no de admin
2. Verifica que las políticas RLS estén aplicadas
3. Revisa la consola del navegador para errores

## 📞 Soporte

Si tienes problemas, verifica:

1. Estás en el directorio correcto (`user-dashboard/`)
2. Usas el puerto correcto (5174)
3. Usas credenciales de usuario, no admin
