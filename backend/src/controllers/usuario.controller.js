const usuarioService = require('../services/usuario.service');
const { asyncHandler, AppError } = require('../middlewares/error.middleware');
const { validatePasswordStrength } = require('../utils/password.util');

class UsuarioController {

  /**
   * GET /api/usuarios
   * Listar usuarios con paginación y filtros
   */
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, search, rol_id, activo } = req.query;

    const result = await usuarioService.getAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      rol_id: rol_id || null,
      activo: activo === 'true' ? true : activo === 'false' ? false : null
    });

    res.json({
      success: true,
      data: result.usuarios,
      pagination: result.pagination
    });
  });

  /**
   * GET /api/usuarios/:id
   * Obtener usuario por ID
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const usuario = await usuarioService.getById(id);

    res.json({
      success: true,
      data: usuario
    });
  });

  /**
   * POST /api/usuarios
   * Crear nuevo usuario
   */
  create = asyncHandler(async (req, res) => {
    const { nombre, email, password, rol_id } = req.body;

    if (!nombre || !email || !password || !rol_id) {
      throw new AppError('Todos los campos son requeridos: nombre, email, password, rol_id', 400);
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      throw new AppError(passwordError, 400);
    }

    const usuario = await usuarioService.create({
      nombre,
      email,
      password,
      rol_id: parseInt(rol_id)
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: usuario
    });
  });

  /**
   * PUT /api/usuarios/:id
   * Actualizar usuario
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol_id, activo } = req.body;

    const usuario = await usuarioService.update(id, {
      nombre,
      email,
      rol_id: rol_id ? parseInt(rol_id) : undefined,
      activo
    });

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: usuario
    });
  });

  /**
   * DELETE /api/usuarios/:id
   * Eliminar usuario (soft delete)
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await usuarioService.delete(id);

    res.json({
      success: true,
      message: result.message
    });
  });

  /**
   * PATCH /api/usuarios/:id/restore
   * Restaurar usuario desactivado
   */
  restore = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const usuario = await usuarioService.restore(id);

    res.json({
      success: true,
      message: 'Usuario activado correctamente',
      data: usuario
    });
  });

  /**
   * PATCH /api/usuarios/:id/password
   * Cambiar contraseña (Admin)
   */
  changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      throw new AppError(passwordError, 400);
    }

    const result = await usuarioService.changePasswordByAdmin(id, newPassword);

    res.json({
      success: true,
      message: result.message
    });
  });

  /**
   * GET /api/usuarios/roles
   * Obtener todos los roles disponibles
   */
  getRoles = asyncHandler(async (req, res) => {
    const roles = await usuarioService.getRoles();

    res.json({
      success: true,
      data: roles
    });
  });
}

module.exports = new UsuarioController();