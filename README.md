# Landing Page JohnTeam

# JohnTeam UX

## Proyecto de transformación digital con múltiples componentes

Este proyecto consta de los siguientes elementos:

1. **Sitio Web Principal (Landing Page)**
2. **Dashboard de Administrador** - Para gestión interna
3. **Dashboard de Usuario/Cliente** - Para acceso de clientes

## Componentes

### Sitio Web Principal

- **Tecnologías:** HTML5, CSS3, JavaScript, Bootstrap
- **Características:**
  - Diseño responsive
  - Formulario de contacto
  - Portafolio interactivo
  - Integración con WhatsApp

### Dashboard de Administrador

- **Tecnologías:** React, TypeScript, Bootstrap, Supabase
- **Características:**
  - Autenticación segura
  - Gestión de usuarios y proyectos
  - Protección de rutas por rol de usuario
  - Estadísticas y análisis

### Dashboard de Usuario/Cliente

- **Tecnologías:** React, TypeScript, Supabase
- **Características:**
  - Acceso personalizado a proyectos
  - Acceso a documentación
  - Interfaz limpia y amigable

## Cómo ejecutar el proyecto

### 1. Sitio Web Principal (puerto 5500)

```bash
npx live-server --port=5500
```

### 2. Dashboard de Administrador (puerto 3000)

```bash
cd dashboard-ts
npm run dev
```

### 3. Dashboard de Usuario (puerto 5174)

```bash
cd user-dashboard
npm run dev
```

## Seguridad Implementada

Esta landing page ha sido reforzada con diversas medidas de seguridad front-end para proteger a los usuarios y los datos:

### Medidas de Seguridad Implementadas

1. **Cabeceras de Seguridad (via meta tags)**

   - Content Security Policy (CSP) para prevenir XSS
   - X-Frame-Options para evitar clickjacking
   - X-Content-Type-Options para evitar MIME sniffing
   - Referrer-Policy para controlar información de referencia
   - Permissions-Policy para limitar acceso a APIs sensibles

2. **Validación de Entradas**

   - Validación de email y URL en formularios
   - Sanitización de entradas para prevenir XSS

3. **Generación Segura de IDs**

   - Uso de la API Web Crypto para generar IDs aleatorios seguros

4. **Monitoreo de Violaciones CSP**

   - Registro de alertas sobre violaciones de políticas de seguridad

5. **Protección de Datos Sensibles**
   - Archivo .gitignore mejorado para prevenir exposición de datos
   - Uso de URLs relativas en lugar de hardcodeadas

### Configuración para Despliegue Seguro

Para completar la configuración de seguridad al desplegar en producción:

1. **Configuración en GitHub**

   - Activar "Enforce HTTPS" en la configuración del repositorio
   - Escanear el repositorio con GitHub CodeQL o Dependabot

2. **Configuración de DNS**

   - Agregar registros CAA para restringir emisión de certificados
   - Configurar registro SPF si se utiliza email con el dominio
   - Activar DNSSEC si el proveedor lo soporta

3. **Seguridad Adicional**
   - Revisar regularmente las dependencias con `npm audit`
   - Implementar un middleware de seguridad en el servidor (si aplica)
   - Considerar el uso de Cloudflare o similar para protección DDoS

### Pruebas de Seguridad Recomendadas

Antes del despliegue final, realizar:

1. Prueba de seguridad con [Mozilla Observatory](https://observatory.mozilla.org/)
2. Validación de cabeceras con [Security Headers](https://securityheaders.com/)
3. Prueba de vulnerabilidades con [OWASP ZAP](https://www.zaproxy.org/)

Para más información sobre mejores prácticas de seguridad, consultar:

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security.html)
