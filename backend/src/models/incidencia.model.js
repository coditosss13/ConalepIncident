const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Incidencia = sequelize.define('Incidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El título es requerido' },
      len: {
        args: [5, 255],
        msg: 'El título debe tener entre 5 y 255 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción es requerida' }
    }
  },
  severidad_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'severidades',
      key: 'id'
    }
  },
  profesor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  grupo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'grupos',
      key: 'id'
    }
  },
  grupo_snapshot: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  semestre_snapshot: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ciclo_escolar_snapshot: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'abierta',
    validate: {
      isIn: {
        args: [['abierta', 'en_proceso', 'cerrada']],
        msg: 'Estado no válido'
      }
    }
  }
}, {
  tableName: 'incidencias',
  hooks: {
    afterCreate: async (incidencia, options) => {
      // Registrar automáticamente quién creó la incidencia como primer seguimiento
      const Seguimiento = require('./seguimiento.model');
      await Seguimiento.create({
        incidencia_id: incidencia.id,
        alumno_id: null, // NULL porque es a nivel incidencia general
        usuario_id: incidencia.profesor_id,
        descripcion: 'Incidencia registrada en el sistema',
        fecha: new Date()
      }, {
        transaction: options?.transaction
      });
    }
  }
});

module.exports = Incidencia;
