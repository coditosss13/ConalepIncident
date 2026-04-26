ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS nombre_tutor VARCHAR(150) NULL AFTER matricula;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS telefono_tutor VARCHAR(30) NULL AFTER nombre_tutor;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS parentesco_tutor VARCHAR(80) NULL AFTER telefono_tutor;
