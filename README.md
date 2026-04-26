# Sistema de Gestion de Incidencias Escolares

Proyecto full stack para gestionar incidencias de alumnos con enfoque por rol:
`profesor`, `prefecto`, `administrador`.

## Stack

- Backend: Node.js + Express + Sequelize + MySQL.
- Frontend: React + Vite + TailwindCSS.
- Auth: JWT access token + refresh token rotativo.

## Arranque rapido

### 1) Backend

1. Copiar `backend/.env.example` a `backend/.env`.
2. Instalar dependencias:
   - `cd backend`
   - `npm install`
3. Inicializar BD:
   - `npm run db:create`
4. Iniciar API:
   - `npm run dev`

### 2) Frontend

1. Instalar dependencias:
   - `cd frontend`
   - `npm install`
2. Iniciar app:
   - `npm run dev`
3. Verificar calidad:
   - `npm run lint`
   - `npm run build`

## Credenciales iniciales

El script de base de datos crea:

- Email: `admin@conalep.edu.mx`
- Password: `admin123`

## Estructura de datos

- Esquema y restricciones: `backend/src/database/migrations/001_initial_schema.sql`
- Datos semilla: `backend/src/database/seeders/001_catalogs.sql`

## Modulos principales

- `auth`: login, refresh, logout, cambio de password.
- `usuarios`: alta, baja logica, restauracion, roles.
- `incidencias`: registro multi-alumno, estado y seguimiento.
- `archivos`: carga de evidencias (imagenes/PDF).
- `acuerdos`: generacion PDF, firma y descarga.
- `metricas`: dashboard por alumnos, grupos y semestre.
# Conalep - Sistema de Gestión de Incidencias

Sistema para gestionar incidencias de alumnos en instituciones educativas.

## Requisitos

- Node.js 18+
- MySQL 8.0+
- npm o yarn

## Instalación

### 1. Clonar repositorio
```bash
git clone <repo-url>
cd ConalepIncidencias
```

### 2. Configurar Base de Datos

Crea una base de datos MySQL y configura las variables de entorno:

```bash
# Backend
cd backend
cp .env.example .env
# Edita .env con tus credenciales de MySQL
```

### 3. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Inicializar Base de Datos

```bash
cd backend
npm run db:create
```

Esto creará las tablas y el usuario administrador por defecto:
- Email: admin@conalep.edu.mx
- Password: admin123

### 5. Iniciar Servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Credenciales por Defecto

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Administrador | admin@conalep.edu.mx | admin123 | administrador |

## Estructura del Proyecto

```
ConalepIncidencias/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, JWT)
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── middlewares/    # Middlewares (Auth, RBAC)
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Definición de rutas
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # Utilidades
│   └── uploads/            # Archivos subidos
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/           # Cliente HTTP
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Estado global
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Páginas/Vistas
│   │   └── utils/         # Utilidades
│   └── public/
│
└── BDexample.sql          # Esquema de BD
```

## Roles y Permisos

| Permiso | Profesor | Prefecto | Admin |
|---------|:--------:|:--------:|:-----:|
| Ver incidencias propias | ✅ | ✅ | ✅ |
| Ver todas las incidencias | ❌ | ✅ | ✅ |
| Crear incidencias | ✅ | ✅ | ✅ |
| Seguimientos | ❌ | ✅ | ✅ |
| Métricas | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/change-password` - Cambiar contraseña

## Tecnologías

### Backend
- Node.js + Express
- MySQL + Sequelize
- JWT + bcrypt
- Multer (uploads)

### Frontend
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios

## Licencia

MIT