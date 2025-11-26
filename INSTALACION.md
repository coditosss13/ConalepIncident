# Guía de Instalación y Ejecución - Sistema de Incidencias CONALEP

## Requisitos Previos

1. **Node.js y npm** (versión 18 o superior)
   \`\`\`bash
   node --version  # Debe ser v18 o superior
   npm --version
   \`\`\`

2. **PostgreSQL** (versión 12 o superior)
   \`\`\`bash
   psql --version
   \`\`\`

3. **Git** (opcional, para clonar el repositorio)

---

## Paso 1: Preparar la Base de Datos

### 1.1 Crear la base de datos en PostgreSQL

\`\`\`bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Dentro de psql, crear la base de datos
CREATE DATABASE incidencias;

# Salir de psql
\q
\`\`\`

### 1.2 Crear las tablas

Ejecuta el siguiente script SQL en tu base de datos:

\`\`\`sql
-- Tabla de roles
CREATE TABLE rol (
    id_rol INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(25) UNIQUE NOT NULL
);

-- Tabla de docentes
CREATE TABLE docente (
    id_docente INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clave VARCHAR(20),
    correo VARCHAR(250),
    area VARCHAR(50)
);

-- Tabla de grupos
CREATE TABLE grupo (
    id_grupo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    grado VARCHAR(15) NOT NULL,
    periodo VARCHAR(15) NOT NULL
);

-- Tabla de tipos de incidencia
CREATE TABLE tipo_incidencia (
    id_tipoIncidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- Tabla de alumnos
CREATE TABLE alumno (
    id_alumno INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    primerApellido VARCHAR(30) NOT NULL,
    segundoApellido VARCHAR(30),
    matricula VARCHAR(20) UNIQUE NOT NULL,
    id_grupo INT NOT NULL REFERENCES grupo(id_grupo)
);

-- Tabla de usuarios
CREATE TABLE usuario (
    id_usuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    primerApellido VARCHAR(30) NOT NULL,
    segundoApellido VARCHAR(30),
    usuario VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL REFERENCES rol(id_rol),
    id_docente INT UNIQUE REFERENCES docente(id_docente)
);

-- Tabla de bitácora
CREATE TABLE bitacora (
    id_bitacora INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    accion VARCHAR(100) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario)
);

-- Tabla de relación docente-grupo
CREATE TABLE docente_grupo (
    id_docente INT NOT NULL,
    id_grupo INT NOT NULL,
    PRIMARY KEY (id_docente, id_grupo),
    FOREIGN KEY (id_docente) REFERENCES docente(id_docente),
    FOREIGN KEY (id_grupo) REFERENCES grupo(id_grupo)
);

-- Tabla de incidencias
CREATE TABLE incidencia (
    id_incidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gravedad VARCHAR(25) NOT NULL CHECK (gravedad IN ('Leve', 'Moderada', 'Grave')),
    observaciones TEXT,
    estado VARCHAR(25) DEFAULT 'Pendiente',
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_tipoIncidencia INT NOT NULL REFERENCES tipo_incidencia(id_tipoIncidencia)
);

-- Tabla de relación alumno-incidencia
CREATE TABLE alumno_incidencia (
    id_alumno INT NOT NULL REFERENCES alumno(id_alumno) ON DELETE CASCADE,
    id_incidencia INT NOT NULL REFERENCES incidencia(id_incidencia) ON DELETE CASCADE,
    PRIMARY KEY (id_alumno, id_incidencia)
);

-- Tabla de evidencias
CREATE TABLE evidencia (
    id_evidencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    archivo VARCHAR(255) NOT NULL,
    tipoArchivo VARCHAR(15),
    fechaSubida TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_incidencia INT NOT NULL REFERENCES incidencia(id_incidencia)
);

-- Tabla de acciones correctivas
CREATE TABLE acc_correctiva (
    id_accion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fechaAplicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
    id_incidencia INT NOT NULL REFERENCES incidencia(id_incidencia)
);
\`\`\`

### 1.3 Insertar datos iniciales

\`\`\`sql
-- Insertar roles
INSERT INTO rol (nombre) VALUES 
    ('Administrador'),
    ('Docente'),
    ('Coordinador');

-- Insertar tipos de incidencia
INSERT INTO tipo_incidencia (nombre, categoria) VALUES 
    ('Falta injustificada', 'Asistencia'),
    ('Retardo', 'Asistencia'),
    ('Conducta inapropiada', 'Disciplinaria'),
    ('Incumplimiento de tareas', 'Académica'),
    ('Uso de celular en clase', 'Disciplinaria');

-- Insertar un usuario administrador de prueba
-- Password: Temporal123 (ya hasheado con bcrypt)
INSERT INTO usuario (nombre, primerApellido, usuario, password, id_rol) VALUES 
    ('Admin', 'Principal', 'admin_test', '$2b$10$K0GOdfH6QgGicT64iQcufOLy61S1TYYvPJfqiNmZPQvwxSHmmtZJO', 1);
\`\`\`

---

## Paso 2: Configurar el Backend

### 2.1 Navegar a la carpeta del backend

\`\`\`bash
cd backend
\`\`\`

### 2.2 Instalar dependencias

\`\`\`bash
npm install
\`\`\`

Esto instalará:
- bcryptjs (para hashear contraseñas)
- cors (para permitir peticiones desde el frontend)
- dotenv (para variables de entorno)
- express (servidor web)
- jsonwebtoken (autenticación JWT)
- multer (subir archivos)
- pg (cliente PostgreSQL)
- nodemon (auto-reinicio en desarrollo)

### 2.3 Configurar variables de entorno

El archivo `.env` ya debería existir con:

\`\`\`env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=incidencias
DB_PASSWORD=admin2004
DB_PORT=5432
PORT=4000
JWT_SECRET=clave_secreta_123456
\`\`\`

Modifica `DB_PASSWORD` si tu contraseña de PostgreSQL es diferente.

### 2.4 Iniciar el servidor backend

\`\`\`bash
npm start
\`\`\`

Deberías ver:
\`\`\`
Servidor corriendo en http://localhost:4000
Conectado a PostgreSQL
\`\`\`

---

## Paso 3: Configurar el Frontend

### 3.1 Abrir una nueva terminal y navegar a la raíz del proyecto

\`\`\`bash
cd ..  # Volver a la raíz del proyecto
\`\`\`

### 3.2 Instalar dependencias del frontend

\`\`\`bash
npm install
\`\`\`

Esto instalará Next.js, React, Tailwind CSS, shadcn/ui y todas las dependencias necesarias.

### 3.3 Iniciar el servidor de desarrollo

\`\`\`bash
npm run dev
\`\`\`

Deberías ver:
\`\`\`
▲ Next.js 16.0.3 (Turbopack)
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.xxx:3000

✓ Ready in X.Xs
\`\`\`

---

## Paso 4: Acceder al Sistema

1. Abre tu navegador en: http://localhost:3000

2. Serás redirigido a la página de login

3. Usa las credenciales del usuario administrador de prueba:
   - **Usuario:** `admin_test`
   - **Password:** `Temporal123`

4. Después del login exitoso, serás redirigido al dashboard del administrador

---

## Comandos Útiles

### Ejecutar ambos servidores simultáneamente

Desde la raíz del proyecto:

\`\`\`bash
npm run dev:full
\`\`\`

Este comando inicia el frontend y el backend al mismo tiempo usando concurrently.

### Solo backend

\`\`\`bash
cd backend
npm start         # Producción
npm run dev       # Desarrollo con auto-reinicio (nodemon)
\`\`\`

### Solo frontend

\`\`\`bash
npm run dev       # Desarrollo
npm run build     # Construcción para producción
npm start         # Servidor de producción
\`\`\`

---

## Solución de Problemas Comunes

### Error: "Cannot connect to PostgreSQL"

1. Verifica que PostgreSQL esté corriendo:
   \`\`\`bash
   sudo systemctl status postgresql
   \`\`\`

2. Verifica las credenciales en `backend/.env`

3. Asegúrate de que la base de datos `incidencias` exista

### Error: "JWT_SECRET no está definido"

1. Verifica que el archivo `backend/.env` exista
2. Asegúrate de que contenga la línea: `JWT_SECRET=clave_secreta_123456`
3. Reinicia el servidor backend

### Error 404 en endpoints del API

1. Verifica que el backend esté corriendo en http://localhost:4000
2. Revisa los logs del backend para ver qué rutas se están registrando
3. Asegúrate de que no haya conflictos de puertos

### Contraseña del administrador no funciona

Si modificaste la tabla `usuario`, regenera el hash de la contraseña:

\`\`\`bash
cd backend
node
\`\`\`

Dentro de Node:
\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'Temporal123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
\`\`\`

Copia el hash y actualiza la base de datos.

---

## Estructura del Proyecto

\`\`\`
school-incident-app/
├── app/                      # Páginas del frontend (Next.js App Router)
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   └── dashboard/           # Dashboard y submódulos
├── backend/                  # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/          # Configuración de BD
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Rutas del API
│   │   └── middleware/      # Middlewares (auth, etc)
│   ├── .env                 # Variables de entorno
│   └── server.js            # Punto de entrada del backend
├── components/               # Componentes reutilizables
├── lib/                      # Utilidades y helpers
└── public/                   # Archivos estáticos
\`\`\`

---

## Usuarios de Prueba

### Administrador
- **Usuario:** admin_test
- **Password:** Temporal123
- **Permisos:** Control total del sistema

### Crear más usuarios

Puedes crear usuarios adicionales desde el panel de administración o directamente en la base de datos usando el hash de bcrypt.

---

## Próximos Pasos

1. Crear más usuarios (docentes y coordinadores)
2. Agregar grupos y alumnos
3. Registrar incidencias
4. Probar el flujo completo del sistema

---

## Soporte

Si encuentras problemas, revisa:
1. Los logs del backend (terminal donde corre `npm start`)
2. La consola del navegador (F12 → Console)
3. Los logs de PostgreSQL
