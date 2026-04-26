const express = require('express');
const router = express.Router();
const metricasController = require('../controllers/metricas.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { hasRole } = require('../middlewares/rbac.middleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Solo prefecto y administrador pueden acceder a métricas
router.use(hasRole(['prefecto', 'administrador']));

// Dashboard completo
router.get('/dashboard', metricasController.getDashboard);

// Resumen rápido
router.get('/resumen', metricasController.getResumen);

module.exports = router;
