const { Incidencia, IncidenciaAlumnos, Alumno, Grupo, Severidad, Archivo, Seguimiento, Usuario } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

class IncidenciaService {

  /**
   * Obtener todas las incidencias con paginación y filtros
   */
  async getAll({ page = 1, limit = 10, search = '', severidad_id = null, estado = null, grupo_id = null, profesor_id = null }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where.titulo = { [require('sequelize').Op.like]: `%${search}%` };
    }
    if (severidad_id) {
      where.severidad_id = parseInt(severidad_id);
    }
    if (estado) {
      where.estado = estado;
    } else {
      // Por defecto ocultar incidencias cerradas en listados operativos.
      where.estado = { [Op.ne]: 'cerrada' };
    }
    if (grupo_id) {
      where.grupo_id = parseInt(grupo_id);
    }
    if (profesor_id) {
      where.profesor_id = parseInt(profesor_id);
    }

    const { count, rows } = await Incidencia.findAndCountAll({
      where,
      include: [
        { model: Severidad, as: 'severidad', attributes: ['id', 'nombre'] },
        { model: Grupo, as: 'grupo', attributes: ['id', 'nombre', 'semestre', 'ciclo_escolar'] },
        { model: Usuario, as: 'profesor', attributes: ['id', 'nombre', 'email'] },
        {
          model: Alumno,
          as: 'alumnos',
          attributes: ['id', 'nombre', 'matricula'],
          through: { attributes: ['grupo_snapshot'] }
        },
        {
          model: Archivo,
          as: 'archivos',
          attributes: ['id', 'nombre_archivo', 'nombre_original', 'tipo', 'ruta']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['fecha', 'DESC']]
    });

    return {
      incidencias: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Obtener incidencia por ID
   */
  async getById(id) {
    const incidencia = await Incidencia.findByPk(id, {
      include: [
        { model: Severidad, as: 'severidad' },
        { model: Grupo, as: 'grupo' },
        {
          model: Alumno,
          as: 'alumnos',
          through: { attributes: ['grupo_snapshot'] }
        },
        { model: Archivo, as: 'archivos' },
        {
          model: Seguimiento,
          as: 'seguimientos',
          include: [
            { model: Alumno, as: 'alumno', attributes: ['id', 'nombre', 'matricula'] },
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
          ]
        }
      ]
    });

    if (!incidencia) {
      throw new Error('Incidencia no encontrada');
    }

    return incidencia;
  }

  /**
   * Crear nueva incidencia con alumnos múltiples
   */
  async create(data, usuarioId) {
    const { titulo, descripcion, severidad_id, grupo_id, alumno_ids } = data;

    // Validar que haya al menos un alumno
    if (!alumno_ids || alumno_ids.length === 0) {
      throw new Error('Debe seleccionar al menos un alumno');
    }

    // Verificar que los alumnos existen
    const alumnos = await Alumno.findAll({
      where: { id: alumno_ids }
    });

    if (alumnos.length !== alumno_ids.length) {
      throw new Error('Alguno de los alumnos seleccionados no existe');
    }

    const gruposIds = [...new Set(alumnos.map((alumno) => alumno.grupo_actual_id).filter(Boolean))];
    const grupos = gruposIds.length > 0
      ? await Grupo.findAll({ where: { id: gruposIds } })
      : [];
    const grupoMap = new Map(grupos.map((grupo) => [grupo.id, grupo]));

    const grupoReferenciaId = grupo_id || gruposIds[0];
    const grupoReferencia = grupoReferenciaId ? grupoMap.get(grupoReferenciaId) || await Grupo.findByPk(grupoReferenciaId) : null;
    if (!grupoReferencia) {
      throw new Error('No se pudo determinar el grupo de referencia de la incidencia');
    }

    // Crear incidencia con transacción
    const transaction = await sequelize.transaction();

    try {
      const incidencia = await Incidencia.create({
        titulo,
        descripcion,
        severidad_id,
        grupo_id: grupoReferencia.id,
        profesor_id: usuarioId,
        estado: 'abierta'
      }, { transaction });

      // Asociar alumnos con snapshot del grupo
      for (const alumno of alumnos) {
        const grupoAlumno = grupoMap.get(alumno.grupo_actual_id) || grupoReferencia;
        await IncidenciaAlumnos.create({
          incidencia_id: incidencia.id,
          alumno_id: alumno.id,
          grupo_snapshot: grupoAlumno?.nombre || grupoReferencia.nombre,
          ciclo_escolar_snapshot: grupoAlumno?.ciclo_escolar || grupoReferencia.ciclo_escolar || null
        }, { transaction });
      }

      await transaction.commit();

      // Recargar la incidencia con relaciones
      return await this.getById(incidencia.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Actualizar incidencia
   */
  async update(id, data) {
    const incidencia = await this.getById(id);
    if (incidencia.estado === 'cerrada') {
      throw new Error('La incidencia está cerrada y no puede modificarse');
    }

    const { titulo, descripcion, severidad_id, grupo_id, estado } = data;

    await incidencia.update({
      titulo: titulo || incidencia.titulo,
      descripcion: descripcion || incidencia.descripcion,
      severidad_id: severidad_id || incidencia.severidad_id,
      grupo_id: grupo_id || incidencia.grupo_id,
      estado: estado || incidencia.estado
    });

    return this.getById(id);
  }

  /**
   * Cambiar estado de la incidencia
   */
  async changeStatus(id, estado) {
    const incidencia = await this.getById(id);
    if (incidencia.estado === 'cerrada') {
      throw new Error('La incidencia está cerrada y no puede cambiar de estado');
    }
    if (incidencia.estado === estado) {
      throw new Error(`La incidencia ya está en estado ${estado}`);
    }
    await incidencia.update({ estado });
    return incidencia;
  }

  /**
   * Agregar seguimiento a una incidencia
   */
  async addSeguimiento(incidenciaId, alumnoId, descripcion, usuarioId) {
    const incidencia = await Incidencia.findByPk(incidenciaId);

    if (!incidencia) {
      throw new Error('Incidencia no encontrada');
    }
    if (incidencia.estado === 'cerrada') {
      throw new Error('La incidencia está cerrada y no admite nuevos seguimientos');
    }

    // Si se especifica alumno_id, verificar que esté asociado a la incidencia
    if (alumnoId) {
      const asociacion = await IncidenciaAlumnos.findOne({
        where: { incidencia_id: incidenciaId, alumno_id: alumnoId }
      });

      if (!asociacion) {
        throw new Error('El alumno no está asociado a esta incidencia');
      }
    }

    const seguimiento = await Seguimiento.create({
      incidencia_id: incidenciaId,
      alumno_id: alumnoId || null,
      descripcion,
      usuario_id: usuarioId
    });

    return seguimiento;
  }

  /**
   * Eliminar incidencia (soft delete - cambiar estado a cerrada)
   */
  async delete(id) {
    const incidencia = await this.getById(id);
    await incidencia.update({ estado: 'cerrada' });
    return { message: 'Incidencia cerrada correctamente' };
  }

  /**
   * Obtener estadísticas de incidencias
   */
  async getStats() {
    const { Op } = require('sequelize');

    // Total por estado
    const porEstado = await Incidencia.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      group: ['estado']
    });

    // Total por severidad
    const porSeveridad = await Incidencia.findAll({
      attributes: [
        [sequelize.col('severidad.nombre'), 'severidad'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      include: [{ model: Severidad, as: 'severidad' }],
      group: ['severidad.id', 'severidad.nombre']
    });

    // Incidencias por mes (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const porMes = await Incidencia.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m'), 'mes'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: {
        fecha: { [Op.gte]: seisMesesAtras }
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m')],
      order: [['mes', 'ASC']]
    });

    return {
      porEstado,
      porSeveridad,
      porMes
    };
  }
}

module.exports = new IncidenciaService();
