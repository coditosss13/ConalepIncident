INSERT INTO rol (nombre) VALUES
('Administrador'),
('Docente'),
('Prefecto');

INSERT INTO docente (clave, correo, area) VALUES
('DOC001', 'juan.lopez@conalep.edu.mx', 'Matemáticas'),
('DOC002', 'maria.sanchez@conalep.edu.mx', 'Español'),
('DOC003', 'carlos.ramirez@conalep.edu.mx', 'Prefectura');

INSERT INTO grupo (nombre, grado, periodo) VALUES
('6IM1', '6to', 'Feb-Jul'),
('5AM2', '5to', 'Ago-Ene'),
('4PM3', '4to', 'Feb-Jul');

INSERT INTO tipo_incidencia (nombre, categoria) VALUES
('Falta de respeto al docente', 'Conducta'),
('Llegada tarde', 'Asistencia'),
('No portar uniforme', 'Conducta'),
('Uso de celular en clase', 'Conducta'),
('Agresión entre alumnos', 'Disciplina');

INSERT INTO alumno (nombre, primerApellido, segundoApellido, matricula, id_grupo) VALUES
('Luis', 'Hernández', 'Pérez', 'A2024001', 1),
('Ana', 'Gómez', 'Ramírez', 'A2024002', 1),
('Mario', 'Lozano', NULL, 'A2024003', 2),
('Sofía', 'Cortés', 'Luna', 'A2024004', 2),
('Daniel', 'Rivas', 'Ortega', 'A2024005', 3);

-- Hash bcrypt de 'admin123'
INSERT INTO usuario (nombre, primerApellido, segundoApellido, usuario, password, id_rol, id_docente) VALUES
('Pedro', 'Luna', NULL, 'admin', '$2a$10$g3aBC4XVvYQA6k7Fu2RH4um.eL9geL4qokxcDeRbWMy0OcMBRF1hW', 1, NULL);

-- Hash bcrypt de 'docente123'
INSERT INTO usuario (nombre, primerApellido, segundoApellido, usuario, password, id_rol, id_docente) VALUES
('Juan', 'López', NULL, 'jlopez', '$2a$10$K8m2MuTg9MFeSQaLXWgYWuIrpJKyebirCfU67g69e7KYeCNuaBJtu', 2, 1),
('María', 'Sánchez', NULL, 'msanchez', '$2a$10$vtpX36uIwdF/K2SzY6Fed.XTAHmsoxlbpelc5u6b85A2IutnGClYq', 2, 2);

-- Hash bcrypt de 'prefecto123'
INSERT INTO usuario (
  nombre,
  primerApellido,
  segundoApellido,
  usuario,
  password,
  id_rol,
  id_docente
) VALUES (
  'Carlos',
  'Ramírez',
  NULL,
  'cramirez',
  '$2a$10$szx5weorS/nwQnIoi.4XfuxemcmaV79DuMquy0oWAup.n00y.sdEW',
  3,
  NULL
);


INSERT INTO docente_grupo (id_docente, id_grupo) VALUES
(1, 1), -- Juan López imparte en 6IM1
(1, 2), -- Juan López imparte en 5AM2
(2, 1); -- María Sánchez imparte en 6IM1

INSERT INTO incidencia (gravedad, observaciones, estado, id_usuario, id_tipoIncidencia) VALUES
('Leve', 'El alumno interrumpió la clase varias veces', 'Pendiente', 2, 1),
('Moderada', 'El alumno llegó 20 minutos tarde', 'Pendiente', 3, 2),
('Leve', 'No portaba uniforme completo', 'Pendiente', 2, 3),
('Grave', 'Pelea en el patio', 'Pendiente', 5, 5);


INSERT INTO alumno_incidencia (id_alumno, id_incidencia) VALUES
(1, 5), -- Luis Hernández - Falta de respeto
(2, 5), -- Ana Gómez - Falta de respeto (misma incidencia)
(3, 6), -- Mario Lozano - Llegada tarde
(4, 7), -- Sofía Cortés - No portar uniforme
(5, 8); -- Daniel Rivas - Pelea


INSERT INTO evidencia (archivo, tipoArchivo, id_incidencia) VALUES
('foto_incidencia_5.jpg', 'image', 5),
('video_incidencia_8.mp4', 'video', 8);


INSERT INTO acc_correctiva (descripcion, fechaAplicacion, id_usuario, id_incidencia) VALUES
('Llamada de atención verbal', NOW(), 5, 5),
('Firma de compromiso', NOW(), 5, 5),
('Reporte entregado a Coordinación', NOW(), 5, 6),
('Suspensión de 1 día', NOW(), 5, 8);



SELECT 'Datos de prueba insertados correctamente' AS status;
