const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumno.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { rbacMiddleware } = require('../middlewares/rbac.middleware');

/**
 * Todas las rutas requieren autenticación
 */
router.use(authMiddleware);

// GET /api/alumnos/search - Buscar alumnos (para autocompletado)
router.get('/search', alumnoController.search);

// GET /api/alumnos/grupo/:grupoId - Alumnos por grupo
router.get('/grupo/:grupoId', alumnoController.getByGrupo);

// GET /api/alumnos - Listar alumnos (paginado)
router.get('/', alumnoController.getAll);

// GET /api/alumnos/:id - Obtener alumno por ID
router.get('/:id', alumnoController.getById);

// POST /api/alumnos - Crear alumno (solo prefecto y admin)
router.post('/', rbacMiddleware('prefecto'), alumnoController.create);

// PUT /api/alumnos/:id - Actualizar alumno (solo prefecto y admin)
router.put('/:id', rbacMiddleware('prefecto'), alumnoController.update);

// DELETE /api/alumnos/:id - Desactivar alumno (solo admin)
router.delete('/:id', rbacMiddleware('administrador'), alumnoController.delete);

// PATCH /api/alumnos/:id/restore - Reactivar alumno (solo admin)
router.patch('/:id/restore', rbacMiddleware('administrador'), alumnoController.restore);

module.exports = router;