const express = require('express');
const router = express.Router();
const incidenciaController = require('../controllers/incidencia.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas públicas para todos los roles autenticados
router.get('/', incidenciaController.getAll);
router.post('/', incidenciaController.create);
router.get('/stats', incidenciaController.getStats);

// Rutas específicas por ID
router.get('/:id', incidenciaController.getById);
router.put('/:id', incidenciaController.update);
router.patch('/:id/estado', incidenciaController.changeStatus);
router.post('/:id/seguimientos', incidenciaController.addSeguimiento);
router.delete('/:id', incidenciaController.delete);

module.exports = router;
