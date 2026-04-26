-- ========================================
-- CREAR BASE DE DATOS
-- ========================================

CREATE DATABASE gestion_incidencias;
USE gestion_incidencias;

-- ========================================
-- ROLES
-- ========================================

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (nombre) VALUES 
('profesor'),
('prefecto'),
('administrador');


-- ========================================
-- USUARIOS
-- ========================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);


-- ========================================
-- GRUPOS
-- ========================================

CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    semestre INT NOT NULL,
    ciclo_escolar VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ========================================
-- ALUMNOS
-- ========================================

CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    grupo_actual_id INT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (grupo_actual_id) REFERENCES grupos(id)
);


-- ========================================
-- SEVERIDAD
-- ========================================

CREATE TABLE severidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

INSERT INTO severidades (nombre, descripcion) VALUES
('Leve', 'Incidencia menor'),
('Moderada', 'Incidencia media'),
('Grave', 'Incidencia grave');


-- ========================================
-- INCIDENCIAS
-- ========================================

CREATE TABLE incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    descripcion TEXT,
    severidad_id INT,
    profesor_id INT,
    grupo_id INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'abierta',

    FOREIGN KEY (severidad_id) REFERENCES severidades(id),
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id),
    FOREIGN KEY (grupo_id) REFERENCES grupos(id)
);


-- ========================================
-- RELACION INCIDENCIAS - ALUMNOS
-- ========================================

CREATE TABLE incidencia_alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT,
    alumno_id INT,
    grupo_snapshot VARCHAR(100),

    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE CASCADE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);


-- ========================================
-- SEGUIMIENTO INDIVIDUAL
-- ========================================

CREATE TABLE seguimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT,
    alumno_id INT,
    descripcion TEXT,
    usuario_id INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


-- ========================================
-- ARCHIVOS
-- ========================================

CREATE TABLE archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT,
    alumno_id INT,
    nombre_archivo VARCHAR(255),
    nombre_original VARCHAR(255),
    tipo VARCHAR(50),
    ruta VARCHAR(255),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
);


-- ========================================
-- ACUERDOS FIRMADOS
-- ========================================

CREATE TABLE acuerdos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id INT,
    alumno_id INT,
    ruta_pdf VARCHAR(255),
    contenido TEXT,
    firmado BOOLEAN DEFAULT FALSE,
    fecha_firma DATETIME,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
);


-- ========================================
-- SEVERIDADES (DATOS INICIALES)
-- ========================================

INSERT INTO severidades (nombre, descripcion) VALUES
('Leve', 'Incidencia menor que no requiere acción inmediata'),
('Moderada', 'Incidencia media que requiere seguimiento'),
('Grave', 'Incidencia grave que requiere intervención inmediata');


-- ========================================
-- USUARIO ADMIN POR DEFECTO
-- ========================================

-- La contraseña se hashea automáticamente en el modelo Usuario
-- Este INSERT es solo de referencia, el script createDatabase.js lo maneja
-- INSERT INTO usuarios (nombre, email, password, rol_id)
-- VALUES ('Administrador', 'admin@conalep.edu.mx', 'admin123', 3);


-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Grupos de ejemplo
-- INSERT INTO grupos (nombre, semestre, ciclo_escolar) VALUES
-- ('1A Informática', 1, '2024A'),
-- ('3B Administración', 3, '2024A'),
-- ('5C Contabilidad', 5, '2024A');

-- Alumnos de ejemplo
-- INSERT INTO alumnos (nombre, matricula, grupo_actual_id, activo) VALUES
-- ('Juan Pérez', '2024001', 1, TRUE),
-- ('María García', '2024002', 2, TRUE);