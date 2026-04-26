const express = require('express');
const router = express.Router();
const grupoController = require('../controllers/grupo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { rbacMiddleware } = require('../middlewares/rbac.middleware');

/**
 * Todas las rutas requieren autenticación
 */
router.use(authMiddleware);

// GET /api/grupos/simple - Lista simple de grupos (para selects)
router.get('/simple', grupoController.getAllSimple);

// GET /api/grupos - Listar grupos (paginado)
router.get('/', grupoController.getAll);

// GET /api/grupos/:id - Obtener grupo por ID
router.get('/:id', grupoController.getById);

// POST /api/grupos - Crear grupo (solo prefecto y admin)
router.post('/', rbacMiddleware('prefecto'), grupoController.create);

// PUT /api/grupos/:id - Actualizar grupo (solo prefecto y admin)
router.put('/:id', rbacMiddleware('prefecto'), grupoController.update);

// DELETE /api/grupos/:id - Eliminar grupo (solo admin)
router.delete('/:id', rbacMiddleware('administrador'), grupoController.delete);

module.exports = router;