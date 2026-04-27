ALTER TABLE incidencias ADD COLUMN IF NOT EXISTS grupo_snapshot VARCHAR(100) NULL AFTER grupo_id;
ALTER TABLE incidencias ADD COLUMN IF NOT EXISTS semestre_snapshot INT NULL AFTER grupo_snapshot;
ALTER TABLE incidencias ADD COLUMN IF NOT EXISTS ciclo_escolar_snapshot VARCHAR(20) NULL AFTER semestre_snapshot;

UPDATE incidencias i
INNER JOIN grupos g ON g.id = i.grupo_id
SET
  i.grupo_snapshot = COALESCE(i.grupo_snapshot, g.nombre),
  i.semestre_snapshot = COALESCE(i.semestre_snapshot, g.semestre),
  i.ciclo_escolar_snapshot = COALESCE(i.ciclo_escolar_snapshot, g.ciclo_escolar)
WHERE i.grupo_snapshot IS NULL OR i.semestre_snapshot IS NULL OR i.ciclo_escolar_snapshot IS NULL;
