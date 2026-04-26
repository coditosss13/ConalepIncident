const PdfKit = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Incidencia, Alumno, Usuario, Grupo } = require('../models');

class PDFService {

  /**
   * Generar PDF de acuerdo para una incidencia
   */
  async generarAcuerdo(incidenciaId, alumnoId, options = {}) {
    const { firmado = false } = options;
    // Obtener datos de la incidencia y alumno
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { association: 'severidad' },
        { association: 'grupo' },
        { association: 'profesor', attributes: ['nombre', 'email'] },
        {
          association: 'alumnos',
          where: { id: alumnoId },
          through: { attributes: ['grupo_snapshot'] }
        }
      ]
    });

    if (!incidencia) {
      throw new Error('Incidencia no encontrada');
    }

    const alumno = incidencia.alumnos[0];
    if (!alumno) {
      throw new Error('Alumno no encontrado en esta incidencia');
    }

    // Crear directorio de acuerdos si no existe
    const acuerdosDir = path.join(__dirname, '../../uploads/acuerdos');
    if (!fs.existsSync(acuerdosDir)) {
      fs.mkdirSync(acuerdosDir, { recursive: true });
    }

    // Nombre del archivo
    const fileName = `acuerdo_${incidencia.id}_${alumno.id}_${Date.now()}.pdf`;
    const filePath = path.join(acuerdosDir, fileName);
    const relativePath = path.join('uploads', 'acuerdos', fileName).replace(/\\/g, '/');

    // Crear el PDF
    const doc = new PdfKit({
      size: 'LETTER',
      margins: { top: 30, bottom: 30, left: 30, right: 30 }
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const templatePath = path.resolve(__dirname, '../assets/formato_acuerdo_base.png');
    if (!fs.existsSync(templatePath)) {
      throw new Error('No se encontró la plantilla oficial del acuerdo');
    }
    doc.image(templatePath, 0, 0, { width: 612, height: 792 });

    const fechaDoc = new Date();
    doc.fontSize(7).font('Helvetica').text(
      firmado
        ? `Documento firmado. Generado automáticamente: ${fechaDoc.toLocaleString('es-MX')}`
        : `Documento generado automáticamente: ${fechaDoc.toLocaleString('es-MX')}`,
      390,
      741,
      { width: 180, align: 'right' }
    );

    // Finalizar el documento
    doc.end();

    // Esperar a que el archivo se escriba
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return {
      fileName,
      filePath: relativePath,
      fileSize: fs.statSync(filePath).size
    };
  }

  /**
   * Generar reporte de incidencia completa
   */
  async generarReporteIncidencia(incidenciaId) {
    const incidencia = await Incidencia.findByPk(incidenciaId, {
      include: [
        { association: 'severidad' },
        { association: 'grupo' },
        { association: 'profesor', attributes: ['nombre', 'email'] },
        { association: 'alumnos', through: { attributes: ['grupo_snapshot'] } },
        { association: 'archivos' },
        {
          association: 'seguimientos',
          include: [
            { association: 'alumno', attributes: ['nombre', 'matricula'] },
            { association: 'usuario', attributes: ['nombre', 'email'] }
          ]
        }
      ]
    });

    if (!incidencia) {
      throw new Error('Incidencia no encontrada');
    }

    const reportesDir = path.join(__dirname, '../../uploads/reportes');
    if (!fs.existsSync(reportesDir)) {
      fs.mkdirSync(reportesDir, { recursive: true });
    }

    const fileName = `reporte_${incidencia.id}_${Date.now()}.pdf`;
    const filePath = path.join(reportesDir, fileName);
    const relativePath = path.join('uploads', 'reportes', fileName).replace(/\\/g, '/');

    const doc = new PdfKit({ size: 'LETTER' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('REPORTE DE INCIDENCIA', { align: 'center' })
      .moveDown(0.5)
      .fontSize(12)
      .text('Documento oficial de registro', { align: 'center' })
      .moveDown(1);

    // Datos generales
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN GENERAL')
      .moveDown(0.5);

    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Folio: ${incidencia.id}`)
      .text(`Fecha: ${new Date(incidencia.fecha).toLocaleDateString('es-MX')}`)
      .text(`Estado: ${incidencia.estado}`)
      .text(`Título: ${incidencia.titulo}`)
      .text(`Severidad: ${incidencia.severidad.nombre}`)
      .text(`Grupo: ${incidencia.grupo.nombre} - Semestre ${incidencia.grupo.semestre}`)
      .text(`Profesor: ${incidencia.profesor.nombre}`)
      .moveDown(0.5)
      .text('Descripción:')
      .text(incidencia.descripcion, { width: 500, align: 'justify' })
      .moveDown(1);

    // Alumnos involucrados
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('ALUMNOS INVOLUCRADOS')
      .moveDown(0.5);

    incidencia.alumnos.forEach((alumno, index) => {
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`${index + 1}. ${alumno.nombre}`)
        .font('Helvetica')
        .text(`   Matrícula: ${alumno.matricula}`)
        .text(`   Grupo al momento: ${alumno.IncidenciaAlumnos.grupo_snapshot || incidencia.grupo.nombre}`);
    });

    doc.moveDown(1);

    // Seguimientos
    if (incidencia.seguimientos.length > 0) {
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('SEGUIMIENTOS')
        .moveDown(0.5);

      incidencia.seguimientos.forEach((seg, index) => {
        const alumnoInfo = seg.alumno ? ` - Alumno: ${seg.alumno.nombre}` : '';
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(`${new Date(seg.fecha).toLocaleDateString('es-MX')} ${alumnoInfo}`)
          .font('Helvetica')
          .text(`   Por: ${seg.usuario.nombre}`)
          .text(seg.descripcion, { width: 500, align: 'justify' })
          .moveDown(0.3);
      });

      doc.moveDown(0.5);
    }

    // Archivos adjuntos
    if (incidencia.archivos.length > 0) {
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('ARCHIVOS ADJUNTOS')
        .moveDown(0.5);

      incidencia.archivos.forEach((archivo, index) => {
        doc
          .fontSize(11)
          .font('Helvetica')
          .text(`${index + 1}. ${archivo.nombre_original || archivo.nombre_archivo} (${archivo.tipo})`);
      });
    }

    // Footer
    doc
      .moveDown(2)
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Reporte generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`,
        { align: 'center' }
      );

    doc.end();

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return {
      fileName,
      filePath: relativePath,
      fileSize: fs.statSync(filePath).size
    };
  }
}

module.exports = new PDFService();
