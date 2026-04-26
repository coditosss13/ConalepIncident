const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const IncidenciaAlumnos = sequelize.define('IncidenciaAlumnos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  incidencia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'incidencias',
      key: 'id'
    }
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumnos',
      key: 'id'
    }
  },
  // Campo para guardar el grupo del alumno al momento de la incidencia
  grupo_snapshot: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del grupo al momento de la incidencia (histórico)'
  },
  ciclo_escolar_snapshot: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Ciclo escolar al momento de la incidencia'
  }
}, {
  tableName: 'incidencia_alumnos'
});

module.exports = IncidenciaAlumnos;
