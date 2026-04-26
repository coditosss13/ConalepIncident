const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Acuerdo = sequelize.define('Acuerdo', {
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
  ruta_pdf: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Contenido textual del acuerdo para referencia rápida'
  },
  nombre_tutor: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  telefono_tutor: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  parentesco: {
    type: DataTypes.STRING(80),
    allowNull: true
  },
  firmado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indica si el acuerdo ha sido firmado por los tutores'
  },
  fecha_firma: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha cuando se registró la firma'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'acuerdos'
});

module.exports = Acuerdo;
