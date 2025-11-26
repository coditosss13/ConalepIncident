# Guía de Inicio

## 1. Requisitos Previos

- Node.js instalado (v16 o superior)
- PostgreSQL instalado y corriendo
- Base de datos "incidencias" creada

## 2. Configuración

### Paso 1: Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### Paso 2: Configurar el backend

El archivo `backend/.env` ya está configurado con:
- Base de datos: `incidencias`
- Contraseña: `admin2004`

Si necesitas cambiar algo, edita `backend/.env`

### Paso 3: Iniciar el sistema

\`\`\`bash
npm run dev:full
\`\`\`

Esto iniciará:
- Frontend en http://localhost:3000
- Backend en http://localhost:4000

## 3. Acceso al Sistema

Usa las credenciales de los usuarios registrados en tu base de datos para iniciar sesión.

## 4. Estructura de Carpetas Importantes

- `app/` - Todas las páginas del frontend
- `backend/src/` - Todo el código del backend
- `components/` - Componentes reutilizables
- `lib/api.js` - Funciones para conectar con el backend
