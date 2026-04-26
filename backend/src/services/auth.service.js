const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { Usuario, Rol, RefreshToken } = require('../models');

class AuthService {

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Usuario y token
   */
  async login(email, password) {
    // Buscar usuario por email con su rol
    const usuario = await Usuario.findOne({
      where: { email },
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }]
    });

    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar si está activo
    if (!usuario.activo) {
      throw new Error('Usuario desactivado. Contacte al administrador');
    }

    // Verificar contraseña
    const passwordValido = await usuario.comparePassword(password);
    if (!passwordValido) {
      throw new Error('Credenciales inválidas');
    }

    // Generar tokens
    const token = this.generateToken(usuario);
    const refreshToken = await this.createRefreshToken(usuario.id);

    return {
      usuario: usuario.toJSON(),
      token,
      refreshToken
    };
  }

  /**
   * Obtener usuario actual
   * @param {number} id - ID del usuario
   * @returns {Object} Usuario
   */
  async getMe(id) {
    const usuario = await Usuario.findByPk(id, {
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }]
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario.toJSON();
  }

  /**
   * Cambiar contraseña
   * @param {number} userId - ID del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    const usuario = await Usuario.findByPk(userId);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const passwordValido = await usuario.comparePassword(currentPassword);
    if (!passwordValido) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Actualizar contraseña
    await usuario.update({ password: newPassword });
    await RefreshToken.update(
      { revocado: true },
      { where: { usuario_id: userId, revocado: false } }
    );

    return { message: 'Contraseña actualizada correctamente' };
  }

  /**
   * Generar token JWT
   * @param {Object} usuario - Usuario
   * @returns {string} Token JWT
   */
  generateToken(usuario) {
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol?.nombre || usuario.rol_id
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createRefreshToken(usuarioId) {
    const refreshToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(refreshToken);
    const expiraEn = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));

    await RefreshToken.create({
      usuario_id: usuarioId,
      token_hash: tokenHash,
      expira_en: expiraEn
    });

    return refreshToken;
  }

  async refreshAccessToken(refreshToken) {
    const tokenHash = this.hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash: tokenHash,
        revocado: false,
        expira_en: { [Op.gte]: new Date() }
      },
      include: [{
        model: Usuario,
        as: 'usuario',
        include: [{ model: Rol, as: 'rol', attributes: ['id', 'nombre'] }]
      }]
    });

    if (!storedToken || !storedToken.usuario || !storedToken.usuario.activo) {
      throw new Error('Refresh token inválido o expirado');
    }

    // Rotación de refresh token
    await storedToken.update({ revocado: true });
    const nextRefreshToken = await this.createRefreshToken(storedToken.usuario_id);
    const accessToken = this.generateToken(storedToken.usuario);

    return {
      token: accessToken,
      refreshToken: nextRefreshToken
    };
  }

  async logout(userId, refreshToken = null) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await RefreshToken.update(
        { revocado: true },
        { where: { usuario_id: userId, token_hash: tokenHash } }
      );
      return { message: 'Sesión cerrada correctamente' };
    }

    await RefreshToken.update(
      { revocado: true },
      { where: { usuario_id: userId, revocado: false } }
    );
    return { message: 'Sesiones cerradas correctamente' };
  }
}

module.exports = new AuthService();