const { Archivo, Incidencia } = require('../models');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');
const path = require('path');
const fs = require('fs');

class ArchivoController {

  /**
   * POST /api/archivos
   * Subir archivo(s) asociado(s) a una incidencia
   */
  upload = asyncHandler(async (req, res) => {
    const { incidencia_id, alumno_id } = req.body;

    if (!incidencia_id) {
      throw new AppError('El ID de incidencia es requerido', 400);
    }

    if (!req.files || req.files.length === 0) {
      throw new AppError('No se ha enviado ningún archivo', 400);
    }

    const incidencia = await Incidencia.findByPk(incidencia_id);
    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }
    if (incidencia.estado === 'cerrada') {
      throw new AppError('No se pueden modificar archivos de incidencias cerradas', 409);
    }

    // Determinar tipo de archivo
    const determinarTipo = (mimetype) => {
      if (mimetype.startsWith('image/')) return 'imagen';
      if (mimetype === 'application/pdf') return 'pdf';
      return 'documento';
    };

    // Crear registros en la base de datos
    const archivosGuardados = [];

    for (const file of req.files) {
      const archivo = await Archivo.create({
        incidencia_id: parseInt(incidencia_id),
        alumno_id: alumno_id ? parseInt(alumno_id) : null,
        nombre_archivo: file.filename,
        nombre_original: file.originalname,
        tipo: determinarTipo(file.mimetype),
        ruta: file.path.replace(/\\/g, '/'), // Normalizar path para Windows
        fecha: new Date()
      });

      archivosGuardados.push(archivo);
    }

    res.status(201).json({
      success: true,
      message: `${archivosGuardados.length} archivo(s) subido(s) correctamente`,
      data: archivosGuardados
    });
  });

  /**
   * GET /api/archivos/:id
   * Obtener información de un archivo
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const archivo = await Archivo.findByPk(id, {
      include: [
        { association: 'incidencia', attributes: ['id', 'titulo'] },
        { association: 'alumno', attributes: ['id', 'nombre', 'matricula'] }
      ]
    });

    if (!archivo) {
      throw new AppError('Archivo no encontrado', 404);
    }

    res.json({
      success: true,
      data: archivo
    });
  });

  /**
   * GET /api/archivos/incidencia/:incidenciaId
   * Obtener todos los archivos de una incidencia
   */
  getByIncidencia = asyncHandler(async (req, res) => {
    const { incidenciaId } = req.params;

    const archivos = await Archivo.findAll({
      where: { incidencia_id: incidenciaId },
      include: [
        { association: 'alumno', attributes: ['id', 'nombre', 'matricula'] }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json({
      success: true,
      data: archivos
    });
  });

  /**
   * DELETE /api/archivos/:id
   * Eliminar archivo
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const archivo = await Archivo.findByPk(id, {
      include: [{ association: 'incidencia', attributes: ['id', 'estado'] }]
    });

    if (!archivo) {
      throw new AppError('Archivo no encontrado', 404);
    }
    if (archivo.incidencia?.estado === 'cerrada') {
      throw new AppError('Los archivos de incidencias cerradas son de solo lectura', 409);
    }

    // Eliminar archivo físico
    const filePath = path.join(__dirname, '..', '..', archivo.ruta);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Eliminar registro de la base de datos
    await archivo.destroy();

    res.json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });
  });

  /**
   * GET /api/archivos/:id/descargar
   * Descargar archivo
   */
  download = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const archivo = await Archivo.findByPk(id);

    if (!archivo) {
      throw new AppError('Archivo no encontrado', 404);
    }

    const filePath = path.join(__dirname, '..', '..', archivo.ruta);

    if (!fs.existsSync(filePath)) {
      throw new AppError('El archivo físico no existe', 404);
    }

    res.download(filePath, archivo.nombre_original || archivo.nombre_archivo);
  });
}

module.exports = new ArchivoController();
