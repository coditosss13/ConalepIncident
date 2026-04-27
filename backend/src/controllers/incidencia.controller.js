const incidenciaService = require('../services/incidencia.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');
const auditService = require('../services/audit.service');
const { getIncidenciaReasonsCatalog, resolveReason } = require('../utils/incidencia-reasons.util');

class IncidenciaController {

  getCatalogoRazones = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: getIncidenciaReasonsCatalog()
    });
  });

  /**
   * GET /api/incidencias
   * Listar incidencias con paginación y filtros
   */
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, search, severidad_id, estado, grupo_id, semestre } = req.query;

    // Si el usuario no es admin/prefecto, solo ve las propias
    let profesor_id = null;
    if (req.usuario.rol.nombre !== 'administrador' && req.usuario.rol.nombre !== 'prefecto') {
      profesor_id = req.usuario.id;
    }

    const result = await incidenciaService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      severidad_id: severidad_id || null,
      estado: estado || null,
      grupo_id: grupo_id || null,
      semestre: semestre || null,
      profesor_id
    });

    res.json({
      success: true,
      data: result.incidencias,
      pagination: result.pagination
    });
  });

  /**
   * GET /api/incidencias/:id
   * Obtener incidencia por ID
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const incidencia = await incidenciaService.getById(id);

    // Verificar permisos: solo puede ver la incidencia si es el creador, prefecto o admin
    if (req.usuario.rol.nombre === 'profesor' && incidencia.profesor_id !== req.usuario.id) {
      throw new AppError('No tienes permiso para ver esta incidencia', 403);
    }

    res.json({
      success: true,
      data: incidencia
    });
  });

  /**
   * POST /api/incidencias
   * Crear nueva incidencia
   */
  create = asyncHandler(async (req, res) => {
    const { titulo, descripcion, razon, grupo_id, alumno_ids } = req.body;
    const reason = resolveReason(razon);

    // Validaciones básicas
    if (!descripcion || !reason) {
      throw new AppError('Los campos requeridos son: descripcion y razon valida', 400);
    }

    if (!alumno_ids || !Array.isArray(alumno_ids) || alumno_ids.length === 0) {
      throw new AppError('Debe seleccionar al menos un alumno', 400);
    }

    const incidencia = await incidenciaService.create({
      titulo: titulo || reason.label,
      descripcion,
      severidad_id: reason.severidad_id,
      grupo_id: grupo_id ? parseInt(grupo_id) : null,
      alumno_ids: alumno_ids.map(id => parseInt(id))
    }, req.usuario.id);

    res.status(201).json({
      success: true,
      message: 'Incidencia creada correctamente',
      data: incidencia
    });
  });

  /**
   * PUT /api/incidencias/:id
   * Actualizar incidencia
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, severidad_id, grupo_id, estado, razon } = req.body;
    const reason = razon ? resolveReason(razon) : null;

    // Verificar que la incidencia existe y tiene permisos
    const existingIncidencia = await incidenciaService.getById(id);

    if (req.usuario.rol.nombre === 'profesor' && existingIncidencia.profesor_id !== req.usuario.id) {
      throw new AppError('No tienes permiso para editar esta incidencia', 403);
    }

    // Solo admin y prefecto pueden cambiar estado
    if (estado && req.usuario.rol.nombre === 'profesor') {
      throw new AppError('Solo prefectos y administradores pueden cambiar el estado', 403);
    }

    if (razon && !reason) {
      throw new AppError('La razon de incidencia no es valida', 400);
    }

    const incidencia = await incidenciaService.update(id, {
      titulo: titulo || reason?.label,
      descripcion,
      severidad_id: reason ? reason.severidad_id : (severidad_id ? parseInt(severidad_id) : undefined),
      grupo_id: grupo_id ? parseInt(grupo_id) : undefined,
      estado
    });

    res.json({
      success: true,
      message: 'Incidencia actualizada correctamente',
      data: incidencia
    });
  });

  /**
   * PATCH /api/incidencias/:id/estado
   * Cambiar estado de la incidencia
   */
  changeStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['abierta', 'en_proceso', 'cerrada'].includes(estado)) {
      throw new AppError('Estado no válido. Debe ser: abierta, en_proceso, cerrada', 400);
    }

    const incidencia = await incidenciaService.changeStatus(id, estado);
    await auditService.record('incidencia.status.changed', {
      incidencia_id: Number(id),
      nuevo_estado: estado,
      user_id: req.usuario.id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: `Incidencia marcada como ${estado}`,
      data: incidencia
    });
  });

  /**
   * POST /api/incidencias/:id/seguimientos
   * Agregar seguimiento a una incidencia
   */
  addSeguimiento = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { alumno_id, descripcion } = req.body;

    if (!descripcion) {
      throw new AppError('La descripción del seguimiento es requerida', 400);
    }

    const seguimiento = await incidenciaService.addSeguimiento(
      parseInt(id),
      alumno_id ? parseInt(alumno_id) : null,
      descripcion,
      req.usuario.id
    );

    res.status(201).json({
      success: true,
      message: 'Seguimiento agregado correctamente',
      data: seguimiento
    });
  });

  /**
   * DELETE /api/incidencias/:id
   * Eliminar incidencia (soft delete - cambia estado a cerrada)
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Solo admin puede eliminar
    if (req.usuario.rol.nombre !== 'administrador') {
      throw new AppError('Solo los administradores pueden eliminar incidencias', 403);
    }

    const result = await incidenciaService.delete(id);

    res.json({
      success: true,
      message: result.message
    });
  });

  /**
   * GET /api/incidencias/stats
   * Obtener estadísticas de incidencias
   */
  getStats = asyncHandler(async (req, res) => {
    // Solo prefectos y administradores pueden ver estadísticas
    if (req.usuario.rol.nombre === 'profesor') {
      throw new AppError('No tienes permiso para ver estadísticas', 403);
    }

    const stats = await incidenciaService.getStats();

    res.json({
      success: true,
      data: stats
    });
  });
}

module.exports = new IncidenciaController();
