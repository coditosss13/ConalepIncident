const { Acuerdo, Incidencia, Alumno, Seguimiento } = require('../models');
const pdfService = require('../services/pdf.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');
const auditService = require('../services/audit.service');
const path = require('path');
const fs = require('fs');

const isValidPhoneFlexible = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.trim();
  const validChars = /^[\d+\-().\s/]+$/.test(cleaned);
  const digits = (cleaned.match(/\d/g) || []).length;
  return validChars && digits >= 7 && digits <= 16;
};

class AcuerdoController {

  /**
   * POST /api/acuerdos/generar
   * Generar PDF de acuerdo para un alumno en una incidencia
   */
  generar = asyncHandler(async (req, res) => {
    const { incidencia_id, alumno_id, nombre_tutor, telefono_tutor, parentesco } = req.body;

    if (!incidencia_id || !alumno_id) {
      throw new AppError('incidencia_id y alumno_id son requeridos', 400);
    }
    if (!nombre_tutor || !telefono_tutor) {
      throw new AppError('nombre_tutor y telefono_tutor son requeridos', 400);
    }
    if (!isValidPhoneFlexible(telefono_tutor)) {
      throw new AppError('telefono_tutor no tiene un formato válido', 400);
    }

    // Verificar que la incidencia y alumno existen
    const incidencia = await Incidencia.findByPk(incidencia_id);
    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }
    if (incidencia.estado === 'cerrada') {
      throw new AppError('No se pueden generar acuerdos para incidencias cerradas', 409);
    }

    const alumno = await Alumno.findByPk(alumno_id);
    if (!alumno) {
      throw new AppError('Alumno no encontrado', 404);
    }

    const filtrosSeguimiento = {
      incidencia_id: incidencia_id,
      descripcion: { [require('sequelize').Op.ne]: 'Incidencia registrada en el sistema' }
    };

    const ultimoSeguimiento = await Seguimiento.findOne({
      where: {
        ...filtrosSeguimiento,
        alumno_id: parseInt(alumno_id)
      },
      order: [['fecha', 'DESC']]
    }) || await Seguimiento.findOne({
      where: {
        ...filtrosSeguimiento,
        alumno_id: null
      },
      order: [['fecha', 'DESC']]
    });

    if (!ultimoSeguimiento) {
      throw new AppError('Primero debes guardar un seguimiento para poder generar el acuerdo', 409);
    }

    // Generar el PDF
    const resultado = await pdfService.generarAcuerdo(incidencia_id, alumno_id, {
      seguimientoSesion: ultimoSeguimiento.descripcion,
      tutorNombre: nombre_tutor,
      tutorTelefono: telefono_tutor,
      parentesco: parentesco || ''
    });

    // Guardar registro en la base de datos
    const acuerdo = await Acuerdo.create({
      incidencia_id: parseInt(incidencia_id),
      alumno_id: parseInt(alumno_id),
      ruta_pdf: resultado.filePath,
      contenido: `Acuerdo generado para la incidencia ${incidencia_id} - Alumno: ${alumno.nombre}. Acuerdos: ${ultimoSeguimiento.descripcion}`,
      nombre_tutor: nombre_tutor.trim(),
      telefono_tutor: telefono_tutor.trim(),
      parentesco: (parentesco || '').trim(),
      firmado: false,
      fecha: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Acuerdo generado correctamente',
      data: {
        acuerdo,
        downloadUrl: `/api/acuerdos/${acuerdo.id}/descargar`
      }
    });
  });

  /**
   * POST /api/acuerdos/generar-descarga
   * Generar hoja PDF y descargarla sin guardar acuerdo
   */
  generarDescarga = asyncHandler(async (req, res) => {
    const { incidencia_id } = req.body;

    if (!incidencia_id) {
      throw new AppError('incidencia_id es requerido', 400);
    }

    const incidencia = await Incidencia.findByPk(incidencia_id);
    if (!incidencia) {
      throw new AppError('Incidencia no encontrada', 404);
    }
    if (incidencia.estado === 'cerrada') {
      throw new AppError('No se puede generar hoja para incidencias cerradas', 409);
    }

    const alumno = await Alumno.findOne({
      include: [{
        association: 'incidencias',
        where: { id: incidencia_id },
        through: { attributes: [] }
      }],
      order: [['id', 'ASC']]
    });

    if (!alumno) {
      throw new AppError('La incidencia no tiene alumnos asociados', 409);
    }

    if (!alumno.nombre_tutor || !alumno.telefono_tutor) {
      throw new AppError('El alumno asociado no tiene nombre/teléfono de tutor', 409);
    }

    const filtrosSeguimiento = {
      incidencia_id: incidencia_id,
      descripcion: { [require('sequelize').Op.ne]: 'Incidencia registrada en el sistema' }
    };
    const ultimoSeguimiento = await Seguimiento.findOne({
      where: {
        ...filtrosSeguimiento,
        alumno_id: alumno.id
      },
      order: [['fecha', 'DESC']]
    }) || await Seguimiento.findOne({
      where: {
        ...filtrosSeguimiento,
        alumno_id: null
      },
      order: [['fecha', 'DESC']]
    });

    if (!ultimoSeguimiento) {
      throw new AppError('Primero debes guardar un seguimiento para generar la hoja', 409);
    }

    const resultado = await pdfService.generarAcuerdo(incidencia_id, alumno.id, {
      seguimientoSesion: ultimoSeguimiento.descripcion,
      tutorNombre: alumno.nombre_tutor,
      tutorTelefono: alumno.telefono_tutor,
      parentesco: alumno.parentesco_tutor || ''
    });

    const absolutePath = path.join(__dirname, '..', '..', resultado.filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new AppError('No se pudo localizar la hoja PDF generada', 500);
    }

    res.download(absolutePath, `hoja_acuerdo_incidencia_${incidencia_id}.pdf`, (error) => {
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
      if (error && !res.headersSent) {
        throw new AppError('No se pudo descargar la hoja generada', 500);
      }
    });
  });

  /**
   * GET /api/acuerdos/:id/descargar
   * Descargar acuerdo
   */
  descargar = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const acuerdo = await Acuerdo.findByPk(id);

    if (!acuerdo) {
      throw new AppError('Acuerdo no encontrado', 404);
    }

    const filePath = path.join(__dirname, '..', '..', acuerdo.ruta_pdf);

    if (!fs.existsSync(filePath)) {
      throw new AppError('El archivo PDF no existe', 404);
    }

    res.download(filePath, `acuerdo_${acuerdo.id}.pdf`);
  });

  /**
   * PATCH /api/acuerdos/:id/firmar
   * Marcar acuerdo como firmado
   */
  firmar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { seguimiento_sesion } = req.body;

    const acuerdo = await Acuerdo.findByPk(id, {
      include: [{ association: 'incidencia', attributes: ['id', 'estado'] }]
    });

    if (!acuerdo) {
      throw new AppError('Acuerdo no encontrado', 404);
    }
    if (acuerdo.incidencia?.estado === 'cerrada') {
      throw new AppError('No se pueden firmar acuerdos de incidencias cerradas', 409);
    }

    const ultimoSeguimiento = await Seguimiento.findOne({
      where: { incidencia_id: acuerdo.incidencia_id, alumno_id: acuerdo.alumno_id },
      order: [['fecha', 'DESC']]
    });

    const textoSeguimiento = seguimiento_sesion || ultimoSeguimiento?.descripcion || 'Sin seguimiento de sesión registrado';
    const resultadoFirmado = await pdfService.generarAcuerdo(acuerdo.incidencia_id, acuerdo.alumno_id, {
      firmado: true,
      seguimientoSesion: textoSeguimiento
    });

    const contenidoFirma = req.file
      ? `Acuerdo firmado con archivo adjunto: ${req.file.originalname}`
      : `Acuerdo firmado digitalmente. Seguimiento de sesión: ${textoSeguimiento}`;

    await acuerdo.update({
      firmado: true,
      fecha_firma: new Date(),
      ruta_pdf: req.file ? req.file.path.replace(/\\/g, '/') : resultadoFirmado.filePath,
      contenido: contenidoFirma
    });
    await auditService.record('acuerdo.signed', {
      acuerdo_id: acuerdo.id,
      incidencia_id: acuerdo.incidencia_id,
      alumno_id: acuerdo.alumno_id,
      user_id: req.usuario.id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Acuerdo marcado como firmado',
      data: acuerdo
    });
  });

  /**
   * GET /api/acuerdos/incidencia/:incidenciaId
   * Obtener todos los acuerdos de una incidencia
   */
  getByIncidencia = asyncHandler(async (req, res) => {
    const { incidenciaId } = req.params;

    const acuerdos = await Acuerdo.findAll({
      where: { incidencia_id: incidenciaId },
      include: [
        { association: 'alumno', attributes: ['id', 'nombre', 'matricula'] }
      ]
    });

    res.json({
      success: true,
      data: acuerdos
    });
  });

  /**
   * DELETE /api/acuerdos/:id
   * Eliminar acuerdo
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const acuerdo = await Acuerdo.findByPk(id, {
      include: [{ association: 'incidencia', attributes: ['id', 'estado'] }]
    });

    if (!acuerdo) {
      throw new AppError('Acuerdo no encontrado', 404);
    }
    if (acuerdo.incidencia?.estado === 'cerrada') {
      throw new AppError('Los acuerdos de incidencias cerradas son de solo lectura', 409);
    }

    // Eliminar archivo físico
    const filePath = path.join(__dirname, '..', '..', acuerdo.ruta_pdf);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await acuerdo.destroy();

    res.json({
      success: true,
      message: 'Acuerdo eliminado correctamente'
    });
  });
}

module.exports = new AcuerdoController();
