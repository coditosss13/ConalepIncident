const express = require('express');
const router = express.Router();
const acuerdoController = require('../controllers/acuerdo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { hasRole, rbacMiddleware } = require('../middlewares/rbac.middleware');
const { upload, uploadError } = require('../middlewares/upload.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Generar acuerdo (solo prefecto y admin)
router.post(
  '/generar',
  hasRole(['prefecto', 'administrador']),
  acuerdoController.generar
);

router.post(
  '/generar-descarga',
  hasRole(['prefecto', 'administrador']),
  acuerdoController.generarDescarga
);

// Marcar acuerdo como firmado
router.patch(
  '/:id/firmar',
  hasRole(['prefecto', 'administrador']),
  upload.single('archivo_firmado'),
  uploadError,
  acuerdoController.firmar
);

// Descargar acuerdo
router.get('/:id/descargar', acuerdoController.descargar);

// Obtener acuerdos de una incidencia
router.get('/incidencia/:incidenciaId', acuerdoController.getByIncidencia);

// Eliminar acuerdo (solo admin)
router.delete('/:id', rbacMiddleware('administrador'), acuerdoController.delete);

module.exports = router;
