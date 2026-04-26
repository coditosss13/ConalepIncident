const { Grupo, Alumno, Incidencia } = require('../models');
const { Op } = require('sequelize');

class GrupoService {

  async getAll({ page = 1, limit = 10, search = '', semestre = null }) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.nombre = { [Op.like]: `%${search}%` };
    }

    if (semestre) {
      whereClause.semestre = semestre;
    }

    const { count, rows } = await Grupo.findAndCountAll({
      where: whereClause,
      include: [{
        model: Alumno,
        as: 'alumnos',
        attributes: ['id'],
        where: { activo: true },
        required: false
      }],
      order: [['semestre', 'ASC'], ['nombre', 'ASC']],
      limit,
      offset
    });

    // Agregar conteo de alumnos
    const gruposWithCount = rows.map(grupo => ({
      ...grupo.toJSON(),
      total_alumnos: grupo.alumnos?.length || 0
    }));

    return {
      grupos: gruposWithCount.map(g => {
        const { alumnos, ...rest } = g;
        return rest;
      }),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id) {
    const grupo = await Grupo.findByPk(id, {
      include: [{
        model: Alumno,
        as: 'alumnos',
        where: { activo: true },
        required: false
      }]
    });

    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    return grupo.toJSON();
  }

  async create(data) {
    const { nombre, semestre, ciclo_escolar } = data;

    // Verificar si ya existe un grupo con el mismo nombre
    const existeGrupo = await Grupo.findOne({ where: { nombre } });
    if (existeGrupo) {
      throw new Error('Ya existe un grupo con ese nombre');
    }

    const grupo = await Grupo.create({
      nombre,
      semestre: parseInt(semestre),
      ciclo_escolar
    });

    return await this.getById(grupo.id);
  }

  async update(id, data) {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    // Verificar nombre duplicado
    if (data.nombre && data.nombre !== grupo.nombre) {
      const existeGrupo = await Grupo.findOne({
        where: { nombre: data.nombre, id: { [Op.ne]: id } }
      });
      if (existeGrupo) {
        throw new Error('Ya existe un grupo con ese nombre');
      }
    }

    await grupo.update({
      nombre: data.nombre || grupo.nombre,
      semestre: data.semestre !== undefined ? parseInt(data.semestre) : grupo.semestre,
      ciclo_escolar: data.ciclo_escolar !== undefined ? data.ciclo_escolar : grupo.ciclo_escolar
    });

    return await this.getById(id);
  }

  async delete(id) {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    // Verificar si tiene alumnos activos
    const alumnosCount = await Alumno.count({
      where: { grupo_actual_id: id, activo: true }
    });

    if (alumnosCount > 0) {
      throw new Error(`No se puede eliminar el grupo porque tiene ${alumnosCount} alumno(s) activo(s)`);
    }

    const incidenciasCount = await Incidencia.count({
      where: { grupo_id: id }
    });

    if (incidenciasCount > 0) {
      throw new Error(`No se puede eliminar el grupo porque tiene ${incidenciasCount} incidencia(s) asociada(s)`);
    }

    await grupo.destroy();
    return { message: 'Grupo eliminado correctamente' };
  }

  async getAllSimple() {
    return await Grupo.findAll({
      attributes: ['id', 'nombre', 'semestre'],
      order: [['semestre', 'ASC'], ['nombre', 'ASC']]
    });
  }
}

module.exports = new GrupoService();