const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { rbacMiddleware } = require('../middlewares/rbac.middleware');
const { upload, uploadError } = require('../middlewares/upload.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Subir archivos (máximo 10 archivos por request)
router.post(
  '/',
  upload.array('files', 10),
  uploadError,
  archivoController.upload
);

// Descargar archivo
router.get('/:id/descargar', archivoController.download);

// Obtener archivos de una incidencia
router.get('/incidencia/:incidenciaId', archivoController.getByIncidencia);

// Obtener archivo por ID
router.get('/:id', archivoController.getById);

// Eliminar archivo (solo admin y prefecto)
router.delete('/:id', rbacMiddleware('prefecto'), archivoController.delete);

module.exports = router;
