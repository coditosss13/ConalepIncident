const alumnoService = require('../services/alumno.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');

class AlumnoController {

  getAll = asyncHandler(async (req, res) => {
    const { page, limit, search, grupo_id, activo } = req.query;

    const result = await alumnoService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      grupo_id: grupo_id || null,
      activo: activo === 'true' ? true : activo === 'false' ? false : null
    });

    res.json({
      success: true,
      data: result.alumnos,
      pagination: result.pagination
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const alumno = await alumnoService.getById(id);

    res.json({
      success: true,
      data: alumno
    });
  });

  create = asyncHandler(async (req, res) => {
    const { nombre, matricula, grupo_actual_id } = req.body;

    if (!nombre || !matricula) {
      throw new AppError('Nombre y matrícula son requeridos', 400);
    }

    const alumno = await alumnoService.create({
      nombre,
      matricula,
      grupo_actual_id
    });

    res.status(201).json({
      success: true,
      message: 'Alumno creado correctamente',
      data: alumno
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, matricula, grupo_actual_id, activo } = req.body;

    const alumno = await alumnoService.update(id, {
      nombre,
      matricula,
      grupo_actual_id,
      activo
    });

    res.json({
      success: true,
      message: 'Alumno actualizado correctamente',
      data: alumno
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await alumnoService.delete(id);

    res.json({
      success: true,
      message: result.message
    });
  });

  restore = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const alumno = await alumnoService.restore(id);

    res.json({
      success: true,
      message: 'Alumno activado correctamente',
      data: alumno
    });
  });

  getByGrupo = asyncHandler(async (req, res) => {
    const { grupoId } = req.params;

    const alumnos = await alumnoService.getByGrupo(grupoId);

    res.json({
      success: true,
      data: alumnos
    });
  });

  search = asyncHandler(async (req, res) => {
    const { q } = req.query;

    const alumnos = await alumnoService.search(q);

    res.json({
      success: true,
      data: alumnos
    });
  });
}

module.exports = new AlumnoController();