const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Archivo = sequelize.define('Archivo', {
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
    comment: 'NULL si el archivo es general a la incidencia'
  },
  nombre_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nombre_original: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nombre original del archivo antes de ser renombrado'
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['imagen', 'documento', 'pdf', 'otro']],
        msg: 'Tipo de archivo no válido'
      }
    }
  },
  ruta: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'archivos'
});

module.exports = Archivo;
