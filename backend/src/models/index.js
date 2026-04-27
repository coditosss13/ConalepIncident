const { sequelize } = require('../config/database');
const Rol = require('./rol.model');
const Usuario = require('./usuario.model');
const Grupo = require('./grupo.model');
const Alumno = require('./alumno.model');
const Severidad = require('./severidad.model');
const Incidencia = require('./incidencia.model');
const IncidenciaAlumnos = require('./incidencia_alumnos.model');
const Seguimiento = require('./seguimiento.model');
const Archivo = require('./archivo.model');
const Acuerdo = require('./acuerdo.model');
const RefreshToken = require('./refresh_token.model');

// ========================================
// RELACIONES EXISTENTES
// ========================================

// Usuario - Rol
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
RefreshToken.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(RefreshToken, { foreignKey: 'usuario_id', as: 'refresh_tokens' });

// Alumno - Grupo
Alumno.belongsTo(Grupo, { foreignKey: 'grupo_actual_id', as: 'grupo' });
Grupo.hasMany(Alumno, { foreignKey: 'grupo_actual_id', as: 'alumnos' });

// ========================================
// RELACIONES DE INCIDENCIAS
// ========================================

// Incidencia - Severidad
Incidencia.belongsTo(Severidad, { foreignKey: 'severidad_id', as: 'severidad' });
Severidad.hasMany(Incidencia, { foreignKey: 'severidad_id', as: 'incidencias' });

// Incidencia - Profesor (Usuario)
Incidencia.belongsTo(Usuario, { foreignKey: 'profesor_id', as: 'profesor' });
Usuario.hasMany(Incidencia, { foreignKey: 'profesor_id', as: 'incidencias' });

// Incidencia - Grupo
Incidencia.belongsTo(Grupo, { foreignKey: 'grupo_id', as: 'grupo' });
Grupo.hasMany(Incidencia, { foreignKey: 'grupo_id', as: 'incidencias' });

// Incidencia - Alumnos (N:M a través de IncidenciaAlumnos)
Incidencia.belongsToMany(Alumno, {
  through: IncidenciaAlumnos,
  foreignKey: 'incidencia_id',
  as: 'alumnos'
});
Alumno.belongsToMany(Incidencia, {
  through: IncidenciaAlumnos,
  foreignKey: 'alumno_id',
  as: 'incidencias'
});

// IncidenciaAlumnos tiene snapshot del grupo
IncidenciaAlumnos.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
IncidenciaAlumnos.belongsTo(Incidencia, { foreignKey: 'incidencia_id', as: 'incidencia' });

// ========================================
// RELACIONES DE SEGUIMIENTOS
// ========================================

// Seguimiento - Incidencia
Seguimiento.belongsTo(Incidencia, { foreignKey: 'incidencia_id', as: 'incidencia' });
Incidencia.hasMany(Seguimiento, { foreignKey: 'incidencia_id', as: 'seguimientos' });

// Seguimiento - Alumno (opcional, puede ser NULL)
Seguimiento.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
Alumno.hasMany(Seguimiento, { foreignKey: 'alumno_id', as: 'seguimientos' });

// Seguimiento - Usuario (quién realiza el seguimiento)
Seguimiento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Seguimiento, { foreignKey: 'usuario_id', as: 'seguimientos_realizados' });

// ========================================
// RELACIONES DE ARCHIVOS
// ========================================

// Archivo - Incidencia
Archivo.belongsTo(Incidencia, { foreignKey: 'incidencia_id', as: 'incidencia' });
Incidencia.hasMany(Archivo, { foreignKey: 'incidencia_id', as: 'archivos' });

// Archivo - Alumno (opcional, puede ser NULL)
Archivo.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
Alumno.hasMany(Archivo, { foreignKey: 'alumno_id', as: 'archivos' });
Archivo.belongsTo(Seguimiento, { foreignKey: 'seguimiento_id', as: 'seguimiento' });
Seguimiento.hasMany(Archivo, { foreignKey: 'seguimiento_id', as: 'archivos_adjuntos' });

// ========================================
// RELACIONES DE ACUERDOS
// ========================================

// Acuerdo - Incidencia
Acuerdo.belongsTo(Incidencia, { foreignKey: 'incidencia_id', as: 'incidencia' });
Incidencia.hasMany(Acuerdo, { foreignKey: 'incidencia_id', as: 'acuerdos' });

// Acuerdo - Alumno
Acuerdo.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });
Alumno.hasMany(Acuerdo, { foreignKey: 'alumno_id', as: 'acuerdos' });

module.exports = {
  sequelize,
  Rol,
  Usuario,
  Grupo,
  Alumno,
  Severidad,
  Incidencia,
  IncidenciaAlumnos,
  Seguimiento,
  Archivo,
  Acuerdo,
  RefreshToken
};