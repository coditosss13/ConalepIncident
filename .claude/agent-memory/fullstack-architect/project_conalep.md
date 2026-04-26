---
name: Proyecto Conalep - Sistema de Incidencias
description: Sistema de gestión de incidencias escolares con roles Profesor/Prefecto/Admin
type: project
---

Sistema de Gestión de Incidencias Escolares "Conalep"

**Why:** Proyecto desde cero para escuela CONALEP. Necesita arquitectura profesional y escalable.

**How to apply:**
- Paleta de colores: Blanco (#FFFFFF) y Verde institucional (#007d68)
- Base de datos MySQL existente con schema en BDexample.sql
- Tres roles: Profesor (registra), Prefecto (métricas/seguimientos/PDFs), Administrador (CRUD usuarios)
- Backend Node.js, Frontend React
- Sistema de incidencias con múltiples alumnos por incidencia
- Histórico de grupo del alumno
- Generación de PDFs para acuerdos

**Estructura de tablas principal:**
- roles, usuarios, grupos, alumnos, severidades
- incidencias, incidencia_alumnos (N:M)
- seguimientos, archivos, acuerdos
- metricas_cache