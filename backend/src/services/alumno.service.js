const { Alumno, Grupo } = require('../models');
const { Op } = require('sequelize');

class AlumnoService {

  async getAll({ page = 1, limit = 10, search = '', grupo_id = null, activo = null }) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { matricula: { [Op.like]: `%${search}%` } }
      ];
    }

    if (grupo_id) {
      whereClause.grupo_actual_id = grupo_id;
    }

    if (activo !== null && activo !== undefined) {
      whereClause.activo = activo;
    }

    const { count, rows } = await Alumno.findAndCountAll({
      where: whereClause,
      include: [{
        model: Grupo,
        as: 'grupo',
        attributes: ['id', 'nombre', 'semestre']
      }],
      order: [['nombre', 'ASC']],
      limit,
      offset
    });

    return {
      alumnos: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id) {
    const alumno = await Alumno.findByPk(id, {
      include: [{
        model: Grupo,
        as: 'grupo',
        attributes: ['id', 'nombre', 'semestre']
      }]
    });

    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    return alumno.toJSON();
  }

  async create(data) {
    const { nombre, matricula, grupo_actual_id } = data;

    // Verificar matrícula duplicada
    const existeMatricula = await Alumno.findOne({ where: { matricula } });
    if (existeMatricula) {
      throw new Error('La matrícula ya está registrada');
    }

    // Verificar que el grupo existe
    if (grupo_actual_id) {
      const grupo = await Grupo.findByPk(grupo_actual_id);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }
    }

    const alumno = await Alumno.create({
      nombre,
      matricula,
      grupo_actual_id: grupo_actual_id || null,
      activo: true
    });

    return await this.getById(alumno.id);
  }

  async update(id, data) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    const { nombre, matricula, grupo_actual_id, activo } = data;

    // Verificar matrícula duplicada
    if (matricula && matricula !== alumno.matricula) {
      const existeMatricula = await Alumno.findOne({
        where: { matricula, id: { [Op.ne]: id } }
      });
      if (existeMatricula) {
        throw new Error('La matrícula ya está registrada');
      }
    }

    // Verificar grupo
    if (grupo_actual_id) {
      const grupo = await Grupo.findByPk(grupo_actual_id);
      if (!grupo) {
        throw new Error('El grupo especificado no existe');
      }
    }

    await alumno.update({
      nombre: nombre || alumno.nombre,
      matricula: matricula || alumno.matricula,
      grupo_actual_id: grupo_actual_id !== undefined ? grupo_actual_id : alumno.grupo_actual_id,
      activo: activo !== undefined ? activo : alumno.activo
    });

    return await this.getById(id);
  }

  async delete(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    // Soft delete
    await alumno.update({ activo: false });
    return { message: 'Alumno desactivado correctamente' };
  }

  async restore(id) {
    const alumno = await Alumno.findByPk(id);
    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    await alumno.update({ activo: true });
    return await this.getById(id);
  }

  async getByGrupo(grupoId) {
    return await Alumno.findAll({
      where: { grupo_actual_id: grupoId, activo: true },
      attributes: ['id', 'nombre', 'matricula'],
      order: [['nombre', 'ASC']]
    });
  }

  async search(query) {
    if (!query || query.length < 2) {
      return [];
    }

    return await Alumno.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { matricula: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{
        model: Grupo,
        as: 'grupo',
        attributes: ['id', 'nombre']
      }],
      limit: 20
    });
  }
}

module.exports = new AlumnoService();