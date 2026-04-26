# Migraciones y seeders

Este directorio contiene scripts SQL versionados para inicializar la base de datos.

## Orden recomendado

1. Ejecutar `migrations/001_initial_schema.sql`.
2. Ejecutar `seeders/001_catalogs.sql`.
3. Crear usuario administrador mediante API o script de bootstrap.

## Notas

- El esquema incluye `refresh_tokens` para autenticación con renovación.
- Se agregan índices para métricas y consultas de incidencias/seguimientos.
- `incidencia_alumnos` conserva historial con `grupo_snapshot` y `ciclo_escolar_snapshot`.
