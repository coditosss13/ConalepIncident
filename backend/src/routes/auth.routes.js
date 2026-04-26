const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter, refreshLimiter, checkLoginLock } = require('../middlewares/security.middleware');

/**
 * Rutas públicas (sin autenticación)
 */

// POST /api/auth/login - Iniciar sesión
router.post('/login', authLimiter, checkLoginLock, authController.login);
router.post('/refresh', refreshLimiter, authController.refresh);

/**
 * Rutas protegidas (requieren autenticación)
 */

// GET /api/auth/me - Obtener usuario actual
router.get('/me', authMiddleware, authController.getMe);

// POST /api/auth/change-password - Cambiar contraseña
router.post('/change-password', authMiddleware, authController.changePassword);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;