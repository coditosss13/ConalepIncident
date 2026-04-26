const authService = require('../services/auth.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');
const { validatePasswordStrength } = require('../utils/password.util');
const auditService = require('../services/audit.service');
const { registerLoginFailure, registerLoginSuccess } = require('../middlewares/security.middleware');

class AuthController {

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      throw new AppError('Email y contraseña son requeridos', 400);
    }

    try {
      const result = await authService.login(email, password);
      registerLoginSuccess(req);
      await auditService.record('auth.login.success', {
        user_id: result?.usuario?.id,
        email: email?.toLowerCase(),
        ip: req.ip
      });

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      registerLoginFailure(req);
      await auditService.record('auth.login.failure', {
        email: email?.toLowerCase(),
        ip: req.ip,
        reason: error.message
      });
      throw new AppError(error.message || 'Credenciales inválidas', 401);
    }
  });

  /**
   * GET /api/auth/me
   * Obtener usuario actual
   */
  getMe = asyncHandler(async (req, res) => {
    const usuario = await authService.getMe(req.usuario.id);

    res.json({
      success: true,
      data: usuario
    });
  });

  /**
   * POST /api/auth/change-password
   * Cambiar contraseña
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.usuario.id;

    if (!currentPassword || !newPassword) {
      throw new AppError('Contraseña actual y nueva contraseña son requeridas', 400);
    }

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      throw new AppError(passwordError, 400);
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);
    await auditService.record('auth.password.changed', {
      user_id: userId,
      ip: req.ip
    });

    res.json({
      success: true,
      message: result.message
    });
  });

  /**
   * POST /api/auth/refresh
   * Renovar access token
   */
  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token requerido', 400);
    }

    const tokens = await authService.refreshAccessToken(refreshToken);
    await auditService.record('auth.refresh.success', {
      user_id: req.usuario?.id || null,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Token renovado correctamente',
      data: tokens
    });
  });

  /**
   * POST /api/auth/logout
   * Cerrar sesión (cliente debe eliminar token)
   */
  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.logout(req.usuario.id, refreshToken);
    await auditService.record('auth.logout', {
      user_id: req.usuario.id,
      ip: req.ip
    });

    res.json({
      success: true,
      message: result.message
    });
  });
}

module.exports = new AuthController();