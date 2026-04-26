const { Archivo, Incidencia, Alumno } = require('../models');
const path = require('path');
const fs = require('fs');

class ArchivoService {

  async upload(files, incidenciaId, alumnoId = null) {
    const incidencia = await Incidencia.findByPk(incidenciaId);
    if (!incidencia) {
      throw new Error('Incidencia no encontrada');
    }

    if (alumnoId) {
      const alumno = await Alumno.findByPk(alumnoId);
      if (!alumno) {
        throw new Error('Alumno no encontrado');
      }
    }

    const determinarTipo = (mimetype) => {
      if (mimetype.startsWith('image/')) return 'imagen';
      if (mimetype === 'application/pdf') return 'pdf';
      return 'documento';
    };

    const archivosGuardados = [];
    for (const file of files) {
      const archivo = await Archivo.create({
        incidencia_id: parseInt(incidenciaId),
        alumno_id: alumnoId ? parseInt(alumnoId) : null,
        nombre_archivo: file.filename,
        nombre_original: file.originalname,
        tipo: determinarTipo(file.mimetype),
        ruta: file.path.replace(/\\/g, '/'),
        fecha: new Date()
      });
      archivosGuardados.push(archivo);
    }

    return archivosGuardados;
  }

  async getById(id) {
    const archivo = await Archivo.findByPk(id, {
      include: [
        { association: 'incidencia', attributes: ['id', 'titulo'] },
        { association: 'alumno', attributes: ['id', 'nombre', 'matricula'] }
      ]
    });

    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }

    return archivo;
  }

  async getByIncidencia(incidenciaId) {
    return await Archivo.findAll({
      where: { incidencia_id: incidenciaId },
      include: [
        { association: 'alumno', attributes: ['id', 'nombre', 'matricula'] }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  async delete(id) {
    const archivo = await Archivo.findByPk(id);

    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }

    // Eliminar archivo físico
    const filePath = path.join(__dirname, '..', '..', archivo.ruta);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await archivo.destroy();
    return { message: 'Archivo eliminado correctamente' };
  }

  async download(id) {
    const archivo = await Archivo.findByPk(id);

    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }

    const filePath = path.join(__dirname, '..', '..', archivo.ruta);

    if (!fs.existsSync(filePath)) {
      throw new Error('El archivo físico no existe');
    }

    return {
      filePath,
      nombreOriginal: archivo.nombre_original || archivo.nombre_archivo
    };
  }
}

module.exports = new ArchivoService();
