const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { rbacMiddleware } = require('../middlewares/rbac.middleware');

/**
 * Todas las rutas requieren autenticación y rol de administrador
 */
router.use(authMiddleware);
router.use(rbacMiddleware('administrador'));

// GET /api/usuarios/roles - Obtener roles disponibles
router.get('/roles', usuarioController.getRoles);

// GET /api/usuarios - Listar usuarios
router.get('/', usuarioController.getAll);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', usuarioController.getById);

// POST /api/usuarios - Crear usuario
router.post('/', usuarioController.create);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', usuarioController.update);

// DELETE /api/usuarios/:id - Eliminar usuario (soft delete)
router.delete('/:id', usuarioController.delete);

// PATCH /api/usuarios/:id/restore - Restaurar usuario
router.patch('/:id/restore', usuarioController.restore);

// PATCH /api/usuarios/:id/password - Cambiar contraseña
router.patch('/:id/password', usuarioController.changePassword);

module.exports = router;