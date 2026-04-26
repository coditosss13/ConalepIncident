const { sequelize, Incidencia, Alumno, Grupo, Usuario, Severidad } = require('../models');
const { Op } = require('sequelize');

class MetricasService {

  /**
   * Obtener dashboard completo de métricas
   */
  async getDashboard(filtros = {}) {
    const { fechaInicio, fechaFin, grupo_id, severidad_id } = filtros;
    const replacements = {};

    // Construir where para filtro de fechas
    const where = {};
    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) where.fecha[Op.gte] = fechaInicio;
      if (fechaFin) where.fecha[Op.lte] = fechaFin;
    }
    if (grupo_id) where.grupo_id = parseInt(grupo_id);
    if (severidad_id) where.severidad_id = parseInt(severidad_id);

    // === TOTALES GENERALES ===
    const totalIncidencias = await Incidencia.count({ where });

    const incidenciasPorEstado = await Incidencia.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('Incidencia.id')), 'total']
      ],
      where,
      group: ['estado']
    });

    const incidenciasPorSeveridad = await Incidencia.findAll({
      attributes: [
        'severidad_id',
        [sequelize.fn('COUNT', sequelize.col('Incidencia.id')), 'total']
      ],
      where,
      include: [{
        model: Severidad,
        as: 'severidad',
        attributes: ['id', 'nombre']
      }],
      group: ['severidad_id', 'severidad.nombre']
    });

    // === ALUMNOS CON MÁS INCIDENCIAS ===
    if (fechaInicio) replacements.fechaInicio = fechaInicio;
    if (fechaFin) replacements.fechaFin = fechaFin;
    if (grupo_id) replacements.grupoId = parseInt(grupo_id);
    if (severidad_id) replacements.severidadId = parseInt(severidad_id);

    const alumnosConIncidencias = await sequelize.query(`
      SELECT
        a.id,
        a.nombre,
        a.matricula,
        COUNT(ia.alumno_id) as total_incidencias,
        g.nombre as grupo_actual
      FROM alumnos a
      INNER JOIN incidencia_alumnos ia ON a.id = ia.alumno_id
      INNER JOIN incidencias i ON ia.incidencia_id = i.id
      INNER JOIN grupos g ON i.grupo_id = g.id
      WHERE 1=1
      ${fechaInicio ? 'AND i.fecha >= :fechaInicio' : ''}
      ${fechaFin ? 'AND i.fecha <= :fechaFin' : ''}
      ${grupo_id ? 'AND i.grupo_id = :grupoId' : ''}
      GROUP BY a.id, a.nombre, a.matricula, g.nombre
      ORDER BY total_incidencias DESC
      LIMIT 10
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    // === GRUPOS CON MÁS INCIDENCIAS ===
    const gruposConIncidencias = await sequelize.query(`
      SELECT
        g.id,
        g.nombre,
        g.semestre,
        g.ciclo_escolar,
        COUNT(i.id) as total_incidencias
      FROM grupos g
      INNER JOIN incidencias i ON g.id = i.grupo_id
      WHERE 1=1
      ${fechaInicio ? 'AND i.fecha >= :fechaInicio' : ''}
      ${fechaFin ? 'AND i.fecha <= :fechaFin' : ''}
      ${severidad_id ? 'AND i.severidad_id = :severidadId' : ''}
      GROUP BY g.id, g.nombre, g.semestre, g.ciclo_escolar
      ORDER BY total_incidencias DESC
      LIMIT 10
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    // === INCIDENCIAS POR SEMESTRE ===
    const incidenciasPorSemestre = await sequelize.query(`
      SELECT
        g.semestre,
        COUNT(i.id) as total_incidencias,
        GROUP_CONCAT(DISTINCT g.nombre) as grupos_involucrados
      FROM incidencias i
      INNER JOIN grupos g ON i.grupo_id = g.id
      WHERE 1=1
      ${fechaInicio ? 'AND i.fecha >= :fechaInicio' : ''}
      ${fechaFin ? 'AND i.fecha <= :fechaFin' : ''}
      GROUP BY g.semestre
      ORDER BY g.semestre ASC
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    // === INCIDENCIAS POR MES (últimos 6 meses) ===
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const incidenciasPorMes = await Incidencia.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m'), 'mes'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: {
        fecha: { [Op.gte]: seisMesesAtras },
        ...where
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('fecha'), '%Y-%m')],
      order: [['mes', 'ASC']]
    });

    // === PROFESORES CON MÁS INCIDENCIAS REGISTRADAS ===
    const profesoresConIncidencias = await sequelize.query(`
      SELECT
        u.id,
        u.nombre,
        u.email,
        COUNT(i.id) as total_incidencias
      FROM usuarios u
      INNER JOIN incidencias i ON u.id = i.profesor_id
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE r.nombre = 'profesor'
      ${fechaInicio ? 'AND i.fecha >= :fechaInicio' : ''}
      ${fechaFin ? 'AND i.fecha <= :fechaFin' : ''}
      GROUP BY u.id, u.nombre, u.email
      ORDER BY total_incidencias DESC
      LIMIT 10
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    // === TASA DE CIERRE ===
    const incidenciasCerradas = await Incidencia.count({
      where: { ...where, estado: 'cerrada' }
    });
    const tasaCierre = totalIncidencias > 0
      ? ((incidenciasCerradas / totalIncidencias) * 100).toFixed(2)
      : 0;

    return {
      resumen: {
        total_incidencias: totalIncidencias,
        incidencias_abiertas: await Incidencia.count({ where: { ...where, estado: 'abierta' } }),
        incidencias_en_proceso: await Incidencia.count({ where: { ...where, estado: 'en_proceso' } }),
        incidencias_cerradas: incidenciasCerradas,
        tasa_cierre: `${tasaCierre}%`
      },
      por_estado: incidenciasPorEstado,
      por_severidad: incidenciasPorSeveridad,
      alumnos_mas_incidencias: alumnosConIncidencias,
      grupos_mas_incidencias: gruposConIncidencias,
      por_semestre: incidenciasPorSemestre,
      por_mes: incidenciasPorMes,
      profesores_mas_incidencias: profesoresConIncidencias
    };
  }

  /**
   * Obtener métricas rápidas (cards del dashboard)
   */
  async getResumen(filtros = {}) {
    const where = {};
    const { fechaInicio, fechaFin } = filtros;

    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) where.fecha[Op.gte] = fechaInicio;
      if (fechaFin) where.fecha[Op.lte] = fechaFin;
    }

    const total = await Incidencia.count({ where });
    const abiertas = await Incidencia.count({ where: { ...where, estado: 'abierta' } });
    const enProceso = await Incidencia.count({ where: { ...where, estado: 'en_proceso' } });
    const cerradas = await Incidencia.count({ where: { ...where, estado: 'cerrada' } });

    // Alumnos únicos afectados
    const replacements = {};
    if (fechaInicio) replacements.fechaInicio = fechaInicio;
    if (fechaFin) replacements.fechaFin = fechaFin;

    const alumnosUnicos = await sequelize.query(`
      SELECT COUNT(DISTINCT ia.alumno_id) as total
      FROM incidencia_alumnos ia
      INNER JOIN incidencias i ON ia.incidencia_id = i.id
      WHERE 1=1
      ${fechaInicio ? 'AND i.fecha >= :fechaInicio' : ''}
      ${fechaFin ? 'AND i.fecha <= :fechaFin' : ''}
    `, { replacements, type: sequelize.QueryTypes.SELECT });

    return {
      total_incidencias: total,
      incidencias_abiertas: abiertas,
      incidencias_en_proceso: enProceso,
      incidencias_cerradas: cerradas,
      alumnos_afectados: alumnosUnicos[0]?.total || 0,
      tasa_cierre: total > 0 ? `${((cerradas / total) * 100).toFixed(1)}%` : '0%'
    };
  }
}

module.exports = new MetricasService();
