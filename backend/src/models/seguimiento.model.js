const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Seguimiento = sequelize.define('Seguimiento', {
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
    allowNull: true,
    references: {
      model: 'alumnos',
      key: 'id'
    },
    comment: 'NULL si el seguimiento es general a la incidencia, no específico de un alumno'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción del seguimiento es requerida' }
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'seguimientos'
});

module.exports = Seguimiento;
