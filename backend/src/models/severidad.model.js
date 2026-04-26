const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Severidad = sequelize.define('Severidad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El nombre de la severidad es requerido' }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'severidades',
  timestamps: false
});

module.exports = Severidad;
