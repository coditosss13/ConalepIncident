const { Usuario, Rol } = require('../models');
const { Op } = require('sequelize');

class UsuarioService {

  /**
   * Obtener todos los usuarios con paginación y filtros
   */
  async getAll({ page = 1, limit = 10, search = '', rol_id = null, activo = null }) {
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filtro de búsqueda
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filtro por rol
    if (rol_id) {
      whereClause.rol_id = rol_id;
    }

    // Filtro por estado activo
    if (activo !== null && activo !== undefined) {
      whereClause.activo = activo;
    }

    const { count, rows } = await Usuario.findAndCountAll({
      where: whereClause,
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      usuarios: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
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
   * Crear nuevo usuario
   */
  async create(data) {
    const { nombre, email, password, rol_id } = data;

    // Verificar si el email ya existe
    const existeEmail = await Usuario.findOne({ where: { email } });
    if (existeEmail) {
      throw new Error('El email ya está registrado');
    }

    // Verificar que el rol existe
    const rol = await Rol.findByPk(rol_id);
    if (!rol) {
      throw new Error('El rol especificado no existe');
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password, // Se hashea automáticamente en el hook beforeCreate
      rol_id,
      activo: true
    });

    // Retornar con el rol incluido
    return await this.getById(usuario.id);
  }

  /**
   * Actualizar usuario
   */
  async update(id, data) {
    const { nombre, email, rol_id, activo } = data;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Si se cambia el email, verificar que no exista
    if (email && email !== usuario.email) {
      const existeEmail = await Usuario.findOne({
        where: { email, id: { [Op.ne]: id } }
      });
      if (existeEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    // Verificar que el rol existe si se proporciona
    if (rol_id) {
      const rol = await Rol.findByPk(rol_id);
      if (!rol) {
        throw new Error('El rol especificado no existe');
      }
    }

    await usuario.update({
      nombre: nombre || usuario.nombre,
      email: email || usuario.email,
      rol_id: rol_id || usuario.rol_id,
      activo: activo !== undefined ? activo : usuario.activo
    });

    return await this.getById(id);
  }

  /**
   * Eliminar usuario (soft delete - marcar como inactivo)
   */
  async delete(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // No permitir eliminar el último administrador
    if (usuario.rol_id === 3) {
      const adminCount = await Usuario.count({ where: { rol_id: 3, activo: true } });
      if (adminCount <= 1) {
        throw new Error('No se puede eliminar el último administrador activo');
      }
    }

    // Soft delete
    await usuario.update({ activo: false });
    return { message: 'Usuario desactivado correctamente' };
  }

  /**
   * Restaurar usuario
   */
  async restore(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.update({ activo: true });
    return await this.getById(id);
  }

  /**
   * Cambiar contraseña (Admin)
   */
  async changePasswordByAdmin(id, newPassword) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    await usuario.update({ password: newPassword });
    return { message: 'Contraseña actualizada correctamente' };
  }

  /**
   * Obtener todos los roles
   */
  async getRoles() {
    return await Rol.findAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']]
    });
  }
}

module.exports = new UsuarioService();