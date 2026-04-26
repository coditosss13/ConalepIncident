const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');
const gruposRoutes = require('./grupos.routes');
const alumnosRoutes = require('./alumnos.routes');
const incidenciasRoutes = require('./incidencias.routes');
const archivosRoutes = require('./archivos.routes');
const acuerdosRoutes = require('./acuerdos.routes');
const metricasRoutes = require('./metricas.routes');

// Montar rutas
router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/grupos', gruposRoutes);
router.use('/alumnos', alumnosRoutes);
router.use('/incidencias', incidenciasRoutes);
router.use('/archivos', archivosRoutes);
router.use('/acuerdos', acuerdosRoutes);
router.use('/metricas', metricasRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;