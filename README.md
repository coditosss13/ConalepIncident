# Sistema de Incidencias Escolares

Sistema completo de gestión de incidencias escolares con Next.js y Express.

## Estructura del Proyecto

\`\`\`
├── app/                    # Frontend Next.js
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── dashboard/         # Sistema principal
│       ├── page.jsx       # Dashboard principal
│       ├── incidencias/   # Módulo de incidencias
│       ├── alumnos/       # Módulo de alumnos
│       └── reportes/      # Módulo de reportes
├── backend/               # Backend Express
│   ├── src/
│   │   ├── config/       # Configuración DB
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Middleware de autenticación
│   │   ├── models/       # Modelos de datos
│   │   └── routes/       # Rutas API
│   ├── server.js         # Servidor Express
│   └── package.json      # Dependencias backend
├── components/            # Componentes React
│   ├── Sidebar.jsx       # Barra lateral de navegación
│   └── ui/               # Componentes UI (shadcn)
├── lib/                   # Librerías y utilidades
│   └── api.js            # Cliente API
└── public/               # Archivos estáticos
\`\`\`

## Inicio Rápido

### 1. Instalar dependencias

\`\`\`bash
# Dependencias del frontend
npm install

# Dependencias del backend
cd backend
npm install
cd ..
\`\`\`

### 2. Configurar base de datos

Edita el archivo `backend/.env` con tus credenciales de PostgreSQL:

\`\`\`env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=incidencias
DB_PASSWORD=admin2004
DB_PORT=5432
PORT=4000
JWT_SECRET=clave_secreta_123456
\`\`\`

### 3. Iniciar el proyecto

\`\`\`bash
# Iniciar frontend y backend simultáneamente
npm run dev:full
\`\`\`

El frontend estará en: http://localhost:3000
El backend estará en: http://localhost:4000

## Scripts Disponibles

- `npm run dev` - Inicia solo el frontend
- `npm run backend` - Inicia solo el backend  
- `npm run dev:full` - Inicia frontend y backend juntos

## Tecnologías

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, PostgreSQL
- **Autenticación**: JWT
