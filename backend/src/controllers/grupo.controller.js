const grupoService = require('../services/grupo.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');

class GrupoController {

  getAll = asyncHandler(async (req, res) => {
    const { page, limit, search, semestre } = req.query;

    const result = await grupoService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      semestre: semestre ? parseInt(semestre) : null
    });

    res.json({
      success: true,
      data: result.grupos,
      pagination: result.pagination
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const grupo = await grupoService.getById(id);

    res.json({
      success: true,
      data: grupo
    });
  });

  create = asyncHandler(async (req, res) => {
    const { nombre, semestre, ciclo_escolar } = req.body;

    if (!nombre || !semestre) {
      throw new AppError('Nombre y semestre son requeridos', 400);
    }

    const grupo = await grupoService.create({
      nombre,
      semestre,
      ciclo_escolar
    });

    res.status(201).json({
      success: true,
      message: 'Grupo creado correctamente',
      data: grupo
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, semestre, ciclo_escolar } = req.body;

    const grupo = await grupoService.update(id, {
      nombre,
      semestre,
      ciclo_escolar
    });

    res.json({
      success: true,
      message: 'Grupo actualizado correctamente',
      data: grupo
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await grupoService.delete(id);

    res.json({
      success: true,
      message: result.message
    });
  });

  getAllSimple = asyncHandler(async (req, res) => {
    const grupos = await grupoService.getAllSimple();

    res.json({
      success: true,
      data: grupos
    });
  });
}

module.exports = new GrupoController();