INSERT INTO roles (nombre) VALUES
('profesor'),
('prefecto'),
('administrador')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO severidades (nombre, descripcion) VALUES
('Leve', 'Incidencia menor que no requiere acción inmediata'),
('Moderada', 'Incidencia media que requiere seguimiento'),
('Grave', 'Incidencia grave que requiere intervención inmediata')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);
