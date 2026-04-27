CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expira_en DATETIME NOT NULL,
  revocado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_usuario (usuario_id),
  INDEX idx_refresh_tokens_expira (expira_en)
);

CREATE TABLE IF NOT EXISTS grupos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  semestre INT NOT NULL,
  ciclo_escolar VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  matricula VARCHAR(50) NOT NULL UNIQUE,
  nombre_tutor VARCHAR(150),
  telefono_tutor VARCHAR(30),
  parentesco_tutor VARCHAR(80),
  grupo_actual_id INT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_alumnos_grupo FOREIGN KEY (grupo_actual_id) REFERENCES grupos(id)
);

CREATE TABLE IF NOT EXISTS severidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  severidad_id INT NOT NULL,
  profesor_id INT NOT NULL,
  grupo_id INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50) DEFAULT 'abierta',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_incidencias_severidad FOREIGN KEY (severidad_id) REFERENCES severidades(id),
  CONSTRAINT fk_incidencias_profesor FOREIGN KEY (profesor_id) REFERENCES usuarios(id),
  CONSTRAINT fk_incidencias_grupo FOREIGN KEY (grupo_id) REFERENCES grupos(id),
  INDEX idx_incidencias_fecha (fecha),
  INDEX idx_incidencias_estado (estado),
  INDEX idx_incidencias_profesor (profesor_id),
  INDEX idx_incidencias_grupo (grupo_id)
);

CREATE TABLE IF NOT EXISTS incidencia_alumnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incidencia_id INT NOT NULL,
  alumno_id INT NOT NULL,
  grupo_snapshot VARCHAR(100) NOT NULL,
  ciclo_escolar_snapshot VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_incidencia_alumnos_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE CASCADE,
  CONSTRAINT fk_incidencia_alumnos_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
  UNIQUE KEY uk_incidencia_alumno (incidencia_id, alumno_id),
  INDEX idx_incidencia_alumnos_alumno (alumno_id)
);

CREATE TABLE IF NOT EXISTS seguimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incidencia_id INT NOT NULL,
  alumno_id INT NULL,
  descripcion TEXT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_seguimientos_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
  CONSTRAINT fk_seguimientos_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  CONSTRAINT fk_seguimientos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_seguimientos_alumno (alumno_id),
  INDEX idx_seguimientos_incidencia (incidencia_id)
);

CREATE TABLE IF NOT EXISTS archivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incidencia_id INT NOT NULL,
  alumno_id INT NULL,
  seguimiento_id INT NULL,
  nombre_archivo VARCHAR(255),
  nombre_original VARCHAR(255),
  tipo VARCHAR(50),
  ruta VARCHAR(255),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_archivos_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
  CONSTRAINT fk_archivos_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  CONSTRAINT fk_archivos_seguimiento FOREIGN KEY (seguimiento_id) REFERENCES seguimientos(id),
  INDEX idx_archivos_seguimiento (seguimiento_id),
  INDEX idx_archivos_incidencia (incidencia_id)
);

CREATE TABLE IF NOT EXISTS acuerdos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  incidencia_id INT NOT NULL,
  alumno_id INT NOT NULL,
  ruta_pdf VARCHAR(255),
  contenido TEXT,
  nombre_tutor VARCHAR(150),
  telefono_tutor VARCHAR(30),
  parentesco VARCHAR(80),
  firmado BOOLEAN DEFAULT FALSE,
  fecha_firma DATETIME,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_acuerdos_incidencia FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
  CONSTRAINT fk_acuerdos_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
  INDEX idx_acuerdos_incidencia (incidencia_id),
  INDEX idx_acuerdos_alumno (alumno_id)
);
